<?php
namespace W3TC;

/**
 * PECL Memcached class
 */
class Cache_Memcached extends Cache_Base {
	/**
	 * Memcache object
	 *
	 * @var Memcache
	 */
	private $_memcache = null;

	/*
     * Used for faster flushing
     *
     * @var integer $_key_version
     */
	private $_key_version = array();

	/*
     * Configuration used to reinitialize persistent object
     *
     * @var integer $_key_version
     */
	private $_config = null;

	/**
	 * constructor
	 *
	 * @param array   $config
	 */
	function __construct( $config ) {
		parent::__construct( $config );

		if ( isset( $config['persistent'] ) && $config['persistent'] ) {
			$this->_config = $config;
			$this->_memcache = new \Memcached( $this->_get_key_version_key( '' ) );
			$server_list = $this->_memcache->getServerList();

			if ( empty( $server_list ) )
				return $this->initialize( $config );
			else
				return true;
		} else {
			$this->_memcache = new \Memcached();
			return $this->initialize( $config );
		}
	}

	/**
	 * Initializes
	 */
	private function initialize( $config ) {
		if ( empty( $config['servers'] ) )
			return false;

		if ( defined( '\Memcached::OPT_REMOVE_FAILED_SERVERS' ) ) {
			$this->_memcache->setOption( \Memcached::OPT_REMOVE_FAILED_SERVERS, true );
		}

		if ( isset( $config['aws_autodiscovery'] ) &&
			$config['aws_autodiscovery'] &&
			defined( '\Memcached::OPT_CLIENT_MODE' ) &&
			defined( '\Memcached::DYNAMIC_CLIENT_MODE' ) )
			$this->_memcache->setOption( \Memcached::OPT_CLIENT_MODE,
				\Memcached::DYNAMIC_CLIENT_MODE );

		foreach ( (array)$config['servers'] as $server ) {
			if ( substr( $server, 0, 5 ) == 'unix:' )
				$this->_memcache->addServer( trim( $server ), 0 );
			else {
				list( $ip, $port ) = explode( ':', $server );
				$this->_memcache->addServer( trim( $ip ), (integer) trim( $port ) );
			}
		}

		if ( isset( $config['username'] ) && !empty( $config['username'] ) &&
			method_exists( $this->_memcache, 'setSaslAuthData' ) &&
			ini_get( 'memcached.use_sasl' ) )
			$this->_memcache->setSaslAuthData( $config['username'],
				$config['password'] );

		return true;
	}

	/**
	 * Adds data
	 *
	 * @param string  $key
	 * @param mixed   $var
	 * @param integer $expire
	 * @param string  $group  Used to differentiate between groups of cache values
	 * @return boolean
	 */
	function add( $key, &$var, $expire = 0, $group = '' ) {
		return $this->set( $key, $var, $expire, $group );
	}

	/**
	 * Sets data
	 *
	 * @param string  $key
	 * @param mixed   $var
	 * @param integer $expire
	 * @param string  $group  Used to differentiate between groups of cache values
	 * @return boolean
	 */
	function set( $key, $var, $expire = 0, $group = '' ) {
		$var['key_version'] = $this->_get_key_version( $group );

		$storage_key = $this->get_item_key( $key );
		return @$this->_memcache->set( $storage_key, $var, $expire );
	}

	/**
	 * Returns data
	 *
	 * @param string  $key
	 * @param string  $group Used to differentiate between groups of cache values
	 * @return mixed
	 */
	function get_with_old( $key, $group = '' ) {
		$has_old_data = false;

		$storage_key = $this->get_item_key( $key );

		$v = @$this->_memcache->get( $storage_key );
		if ( !is_array( $v ) || !isset( $v['key_version'] ) )
			return array( null, $has_old_data );

		$key_version = $this->_get_key_version( $group );
		if ( $v['key_version'] == $key_version )
			return array( $v, $has_old_data );

		if ( $v['key_version'] > $key_version ) {
			$this->_set_key_version( $v['key_version'], $group );
			return array( $v, $has_old_data );
		}

		// key version is old
		if ( !$this->_use_expired_data )
			return array( null, $has_old_data );

		// if we have expired data - update it for future use and let
		// current process recalculate it
		$expires_at = isset( $v['expires_at'] ) ? $v['expires_at'] : null;
		if ( $expires_at == null || time() > $expires_at ) {
			$v['expires_at'] = time() + 30;
			@$this->_memcache->set( $storage_key, $v, 0 );
			$has_old_data = true;

			return array( null, $has_old_data );
		}

		// return old version
		return array( $v, $has_old_data );
	}

	/**
	 * Replaces data
	 *
	 * @param string  $key
	 * @param mixed   $var
	 * @param integer $expire
	 * @param string  $group  Used to differentiate between groups of cache values
	 * @return boolean
	 */
	function replace( $key, &$var, $expire = 0, $group = '' ) {
		return $this->set( $key, $var, $expire, $group );
	}

	/**
	 * Deletes data
	 *
	 * @param string  $key
	 * @param string  $group
	 * @return boolean
	 */
	function delete( $key, $group = '' ) {
		$storage_key = $this->get_item_key( $key );

		if ( $this->_use_expired_data ) {
			$v = @$this->_memcache->get( $storage_key );
			if ( is_array( $v ) ) {
				$v['key_version'] = 0;
				@$this->_memcache->set( $storage_key, $v, 0 );
				return true;
			}
		}
		return @$this->_memcache->delete( $storage_key );
	}

	/**
	 * Key to delete, deletes .old and primary if exists.
	 *
	 * @param unknown $key
	 * @return bool
	 */
	function hard_delete( $key ) {
		$storage_key = $this->get_item_key( $key );
		return @$this->_memcache->delete( $storage_key );
	}

	/**
	 * Flushes all data
	 *
	 * @param string  $group Used to differentiate between groups of cache values
	 * @return boolean
	 */
	function flush( $group = '' ) {
		$this->_get_key_version( $group );   // initialize $this->_key_version
		$this->_key_version[$group]++;
		$this->_set_key_version( $this->_key_version[$group], $group );

		// for persistent connections - apply new config to the object
		// otherwise it will keep old servers list
		if ( !is_null( $this->_config ) ) {
			if ( method_exists( $this->_memcache, 'resetServerList' ) )
				$this->_memcache->resetServerList();

			$this->initialize( $this->_config );
		}

		return true;
	}

	/**
	 * Checks if engine can function properly in this environment
	 *
	 * @return bool
	 */
	public function available() {
		return class_exists( 'Memcached' );
	}

	public function get_statistics() {
		$a = $this->_memcache->getStats();
		if ( count( $a ) > 0 ) {
			$keys = array_keys( $a );
			$key = $keys[0];
			return $a[$key];
		}

		return $a;
	}

	/**
	 * Returns key version
	 *
	 * @param string  $group Used to differentiate between groups of cache values
	 * @return integer
	 */
	private function _get_key_version( $group = '' ) {
		if ( !isset( $this->_key_version[$group] ) || $this->_key_version[$group] <= 0 ) {
			$v = @$this->_memcache->get( $this->_get_key_version_key( $group ) );
			$v = intval( $v );
			$this->_key_version[$group] = ( $v > 0 ? $v : 1 );
		}

		return $this->_key_version[$group];
	}

	/**
	 * Sets new key version
	 *
	 * @param unknown $v
	 * @param string  $group Used to differentiate between groups of cache values
	 * @return boolean
	 */
	private function _set_key_version( $v, $group = '' ) {
		@$this->_memcache->set( $this->_get_key_version_key( $group ), $v, 0 );
	}


	/**
	 * Returns size used by cache
	 */
	public function get_stats_size( $timeout_time ) {
		$size = array(
			'bytes' => 0,
			'items' => 0,
			'timeout_occurred' => false,
		);

		$key_prefix = $this->get_item_key( '' );
		$error_occurred = false;

		$server_list = $this->_memcache->getServerList();
		$n = 0;

		foreach ( $server_list as $server ) {
			$loader = new Cache_Memcached_Stats( $server['host'], $server['port'] );
			$slabs = $loader->slabs();
			if ( !is_array( $slabs ) ) {
				$error_occurred = true;
				continue;
			}

			foreach ( $slabs as $slab_id ) {
				$cdump = $loader->cachedump( $slab_id );
				if ( !is_array( $cdump ) )
					continue;

				foreach ( $cdump as $line ) {
					$key_data = explode( ' ', $line );
					if ( !is_array( $key_data ) || count( $key_data ) < 3 )
						continue;
					$n++;
					if ( $n % 10 == 0 ) {
						$size['timeout_occurred'] = ( time() > $timeout_time );
						if ( $size['timeout_occurred'] )
							return $size;
					}

					$key = $key_data[1];
					$bytes = substr( $key_data[2], 1 );

					if ( substr( $key, 0, strlen( $key_prefix ) ) == $key_prefix ) {
						$size['bytes'] += $bytes;
						$size['items']++;
					}
				}
			}
		}

		if ( $error_occurred && $size['items'] <= 0 ) {
			$size['bytes'] = null;
			$size['items'] = null;
		}

		return $size;
	}

	/**
	 * Used to replace as atomically as possible known value to new one
	 */
	public function set_if_maybe_equals( $key, $old_value, $new_value ) {
		$storage_key = $this->get_item_key( $key );

		$cas = null;
		$value = @$this->_memcache->get( $storage_key, null, $cas );

		if ( !is_array( $value ) )
			return false;

		if ( isset( $old_value['content'] ) &&
			$value['content'] != $old_value['content'] )
			return false;

		return @$this->_memcache->cas( $cas, $storage_key, $new_value );
	}

	/**
	 * Use key as a counter and add integet value to it
	 */
	public function counter_add( $key, $value ) {
		if ( $value == 0 )
			return true;

		$storage_key = $this->get_item_key( $key );
		$r = @$this->_memcache->increment( $storage_key, $value );
		if ( !$r )   // it doesnt initialize counter by itself
			$this->counter_set( $key, 0 );

		return $r;
	}

	/**
	 * Use key as a counter and add integet value to it
	 */
	public function counter_set( $key, $value ) {
		$storage_key = $this->get_item_key( $key );
		return @$this->_memcache->set( $storage_key, $value );
	}

	/**
	 * Get counter's value
	 */
	public function counter_get( $key ) {
		$storage_key = $this->get_item_key( $key );
		$v = (int)@$this->_memcache->get( $storage_key );

		return $v;
	}
}
