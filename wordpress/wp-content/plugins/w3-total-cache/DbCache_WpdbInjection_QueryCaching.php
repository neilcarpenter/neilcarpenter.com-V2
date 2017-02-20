<?php
namespace W3TC;

/**
 * class DbCache_WpdbInjection_QueryCaching
 */
class DbCache_WpdbInjection_QueryCaching extends DbCache_WpdbInjection {
	/**
	 * Array of queries
	 *
	 * @var array
	 */
	var $query_stats = array();

	/**
	 * Queries total
	 *
	 * @var integer
	 */
	var $query_total = 0;

	/**
	 * Query cache hits
	 *
	 * @var integer
	 */
	var $query_hits = 0;

	/**
	 * Query cache misses
	 *
	 * @var integer
	 */
	var $query_misses = 0;

	/**
	 * Time total
	 *
	 * @var integer
	 */
	var $time_total = 0;

	/**
	 * Config
	 */
	var $_config = null;

	/**
	 * Lifetime
	 *
	 * @var integer
	 */
	var $_lifetime = null;

	/**
	 * Request-global cache reject reason
	 * null until filled
	 *
	 * @var string
	 */
	private $cache_reject_reason = null;

	/**
	 * Request-global check reject scope
	 * false until set
	 *
	 * @var bool
	 */
	private $cache_reject_request_wide = false;
	private $debug = false;
	private $reject_logged = false;
	private $reject_constants;

	/**
	 * Result of check if caching is possible at the level of current http request
	 * null until filled
	 */
	private $can_cache_once_per_request_result = null;

	/*
     * @param string $dbuser
     * @param string $dbpassword
     * @param string $dbname
     * @param string $dbhost
     */
	function __construct() {
		$c = Dispatcher::config();
		$this->_config = $c;
		$this->_lifetime = $c->get_integer( 'dbcache.lifetime' );
		$this->debug = $c->get_boolean( 'dbcache.debug' );
		$this->reject_logged = $c->get_boolean( 'dbcache.reject.logged' );
		$this->reject_constants = $c->get_array( 'dbcache.reject.constants' );
	}

	/**
	 * Executes query
	 *
	 * @param string  $query
	 * @return integer
	 */
	function query( $query ) {
		if ( !$this->wpdb_mixin->ready ) {
			return $this->next_injection->query( $query );
		}

		$reason = '';
		$cached = false;
		$data = false;
		$time_total = 0;

		$this->query_total++;

		$caching = $this->_can_cache( $query, $reason );
		if ( preg_match( '~^\s*start transaction\b~is', $query ) ) {
			$this->cache_reject_reason = 'transaction';
			$caching = false;
		}

		if ( preg_match( '~^\s*insert\b|^\s*delete\b|^\s*update\b|^\s*replace\b|^\s*commit\b|^\s*truncate\b~is', $query ) ) {
			if ( $caching ) {
				$this->cache_reject_reason = 'modification query';
				$caching = false;
			}

			$group = $this->_get_group( $query );
			$this->_flush_cache_group( $group );
		}

		if ( $caching ) {
			$this->wpdb_mixin->timer_start();
			//$cache_key = $this->_get_cache_key($query);
			$cache = $this->_get_cache();
			$group = $this->_get_group( $query );
			$data = $cache->get( md5( $query ), $group );
			$time_total = $this->wpdb_mixin->timer_stop();
		}

		if ( is_array( $data ) ) {
			$cached = true;
			$this->query_hits++;

			$this->wpdb_mixin->last_error = $data['last_error'];
			$this->wpdb_mixin->last_query = $data['last_query'];
			$this->wpdb_mixin->last_result = $data['last_result'];
			$this->wpdb_mixin->col_info = $data['col_info'];
			$this->wpdb_mixin->num_rows = $data['num_rows'];

			$return_val = $data['return_val'];
		} else {
			$this->query_misses++;

			$this->wpdb_mixin->timer_start();
			$return_val = $this->next_injection->query( $query );
			$time_total = $this->wpdb_mixin->timer_stop();

			if ( $caching ) {
				$data = array(
					'last_error' => $this->wpdb_mixin->last_error,
					'last_query' => $this->wpdb_mixin->last_query,
					'last_result' => $this->wpdb_mixin->last_result,
					'col_info' => $this->wpdb_mixin->col_info,
					'num_rows' => $this->wpdb_mixin->num_rows,
					'return_val' => $return_val
				);

				$cache = $this->_get_cache();
				$group = $this->_get_group( $query );
				$cache->set( md5( $query ), $data, $this->_lifetime, $group );
			}
		}

		if ( $this->debug ) {
			$this->query_stats[] = array(
				'query' => $query,
				'caching' => $caching,
				'reason' => $reason,
				'cached' => $cached,
				'data_size' => ( $data ? strlen( serialize( $data ) ) : 0 ),
				'time_total' => $time_total
			);
		}

		$this->time_total += $time_total;

		return $return_val;
	}

	/**
	 * Initializes object, calls underlying processor
	 */
	function initialize() {
		return $this->next_injection->initialize();
	}

	/**
	 * Insert a row into a table.
	 *
	 * @param string  $table
	 * @param array   $data
	 * @param array|string $format
	 * @return int|false
	 */
	function insert( $table, $data, $format = null ) {
		return $this->next_injection->insert( $table, $data, $format );
	}

	/**
	 * Replace a row into a table.
	 *
	 * @param string  $table
	 * @param array   $data
	 * @param array|string $format
	 * @return int|false
	 */
	function replace( $table, $data, $format = null ) {
		$group = $this->_get_group( $table );
		$this->_flush_cache_group( $group );
		return $this->next_injection->replace( $table, $data, $format );
	}

	/**
	 * Update a row in the table
	 *
	 * @param string  $table
	 * @param array   $data
	 * @param array   $where
	 * @param array|string $format
	 * @param array|string $format_where
	 * @return int|false
	 */
	function update( $table, $data, $where, $format = null, $where_format = null ) {
		$group = $this->_get_group( $table );
		$this->_flush_cache_group( $group );
		return $this->next_injection->update( $table, $data, $where, $format, $where_format );
	}

	/**
	 * Deletes from table
	 */
	function delete( $table, $where, $where_format = null ) {
		$group = $this->_get_group( $table );
		$this->_flush_cache_group( $group );
		return $this->next_injection->delete( $table, $where, $where_format );
	}

	/**
	 * Flushes cache
	 *
	 * @return boolean
	 */
	function flush_cache() {
		return $this->_flush_cache_group( 'all' );
	}

	private function _flush_cache_group( $group ) {
		$cache = $this->_get_cache();
		$flush_groups = $this->_get_flush_groups( $group );
		$v = true;

		foreach ( $flush_groups as $f_group )
			$v &= $cache->flush( $f_group );

		return $v;
	}

	/**
	 * Returns cache object
	 *
	 * @return W3_Cache_Base
	 */
	function _get_cache() {
		static $cache = array();

		if ( !isset( $cache[0] ) ) {
			$engine = $this->_config->get_string( 'dbcache.engine' );

			switch ( $engine ) {
			case 'memcached':
				$engineConfig = array(
					'servers' => $this->_config->get_array( 'dbcache.memcached.servers' ),
					'persistent' => $this->_config->get_boolean( 'dbcache.memcached.persistent' ),
					'aws_autodiscovery' => $this->_config->get_boolean( 'dbcache.memcached.aws_autodiscovery' ),
					'username' => $this->_config->get_boolean( 'dbcache.memcached.username' ),
					'password' => $this->_config->get_boolean( 'dbcache.memcached.password' )
				);
				break;

			case 'redis':
				$engineConfig = array(
					'servers' => $this->_config->get_array( 'dbcache.redis.servers' ),
					'persistent' => $this->_config->get_boolean( 'dbcache.redis.persistent' ),
					'dbid' => $this->_config->get_boolean( 'dbcache.redis.dbid' ),
					'password' => $this->_config->get_boolean( 'dbcache.redis.password' )
				);
				break;

			case 'file':
				$engineConfig = array(
					'use_wp_hash' => true,
					'section' => 'db',
					'locking' => $this->_config->get_boolean( 'dbcache.file.locking' ),
					'flush_timelimit' => $this->_config->get_integer( 'timelimit.cache_flush' )
				);
				break;

			default:
				$engineConfig = array();
			}
			$engineConfig['module'] = 'dbcache';
			$engineConfig['host'] = Util_Environment::host();
			$engineConfig['instance_id'] = Util_Environment::instance_id();

			$cache[0] = Cache::instance( $engine, $engineConfig );
		}

		return $cache[0];
	}

	/**
	 * Check if can cache sql
	 *
	 * @param string  $sql
	 * @param string  $cache_reject_reason
	 * @return boolean
	 */
	function _can_cache( $sql, &$cache_reject_reason ) {
		/**
		 * Skip if request-wide reject reason specified.
		 * Note - as a result requedt-wide checks are done only once per request
		 */
		if ( !is_null( $this->cache_reject_reason ) ) {
			$cache_reject_reason = $this->cache_reject_reason;
			$this->cache_reject_request_wide = true;
			return false;
		}

		/**
		 * Do once-per-request check if needed
		 */
		if ( is_null( $this->can_cache_once_per_request_result ) ) {
			$this->can_cache_once_per_request_result = $this->_can_cache_once_per_request();
			if ( !$this->can_cache_once_per_request_result ) {
				$this->cache_reject_request_wide = true;
				return false;
			}
		}

		/**
		 * Check for constants
		 */
		foreach ( $this->reject_constants as $name ) {
			if ( defined( $name ) && constant( $name ) ) {
				$this->cache_reject_reason = $name . ' constant defined';
				$cache_reject_reason = $this->cache_reject_reason;

				return false;
			}
		}

		/**
		 * Check for AJAX requests
		 */
		$ajax_skip = false;
		if ( defined( 'DOING_AJAX' ) ) {
			// wp_admin is always defined for ajax requests, check by referrer
			if ( strpos( $_SERVER['HTTP_REFERER'], '/wp-admin/' ) === false )
				$ajax_skip = true;
		}

		/**
		 * Skip if admin
		 */
		if ( defined( 'WP_ADMIN' ) && !$ajax_skip ) {
			$this->cache_reject_reason = 'WP_ADMIN';
			$cache_reject_reason = $this->cache_reject_reason;

			return false;
		}

		/**
		 * Skip if SQL is rejected
		 */
		if ( !$this->_check_sql( $sql ) ) {
			$cache_reject_reason = 'query not cacheable';

			return false;
		}

		/**
		 * Skip if user is logged in
		 */
		if ( $this->reject_logged && !$this->_check_logged_in() ) {
			$this->cache_reject_reason = 'user.logged_in';
			$cache_reject_reason = $this->cache_reject_reason;

			return false;
		}

		return true;
	}

	/**
	 * Check if can cache sql, checks which have constant results during whole request
	 *
	 * @return boolean
	 */
	function _can_cache_once_per_request() {
		/**
		 * Skip if disabled
		 */
		if ( !$this->_config->get_boolean( 'dbcache.enabled' ) ) {
			$this->cache_reject_reason = 'dbcache.disabled';

			return false;
		}

		/**
		 * Skip if request URI is rejected
		 */
		if ( !$this->_check_request_uri() ) {
			$this->cache_reject_reason = 'request';
			return false;
		}

		/**
		 * Skip if cookie is rejected
		 */
		if ( !$this->_check_cookies() ) {
			$this->cache_reject_reason = 'cookie';
			return false;
		}

		return true;
	}

	/**
	 * Check SQL
	 *
	 * @param string  $sql
	 * @return boolean
	 */
	function _check_sql( $sql ) {

		$auto_reject_strings = $this->_config->get_array( 'dbcache.reject.words' );

		if ( preg_match( '~' . implode( '|', $auto_reject_strings ) . '~is', $sql ) ) {
			return false;
		}

		$reject_sql = $this->_config->get_array( 'dbcache.reject.sql' );

		foreach ( $reject_sql as $expr ) {
			$expr = trim( $expr );
			$expr = str_replace( '{prefix}', $this->wpdb_mixin->prefix, $expr );
			if ( $expr != '' && preg_match( '~' . $expr . '~i', $sql ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Check request URI
	 *
	 * @return boolean
	 */
	function _check_request_uri() {
		$auto_reject_uri = array(
			'wp-login',
			'wp-register'
		);

		foreach ( $auto_reject_uri as $uri ) {
			if ( strstr( $_SERVER['REQUEST_URI'], $uri ) !== false ) {
				return false;
			}
		}

		$reject_uri = $this->_config->get_array( 'dbcache.reject.uri' );
		$reject_uri = array_map( array( '\W3TC\Util_Environment', 'parse_path' ), $reject_uri );

		foreach ( $reject_uri as $expr ) {
			$expr = trim( $expr );
			if ( $expr != '' && preg_match( '~' . $expr . '~i', $_SERVER['REQUEST_URI'] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Checks for WordPress cookies
	 *
	 * @return boolean
	 */
	function _check_cookies() {
		foreach ( array_keys( $_COOKIE ) as $cookie_name ) {
			if ( $cookie_name == 'wordpress_test_cookie' ) {
				continue;
			}
			if ( preg_match( '/^wp-postpass|^comment_author/', $cookie_name ) ) {
				return false;
			}
		}

		foreach ( $this->_config->get_array( 'dbcache.reject.cookie' ) as $reject_cookie ) {
			foreach ( array_keys( $_COOKIE ) as $cookie_name ) {
				if ( strstr( $cookie_name, $reject_cookie ) !== false ) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Check if user is logged in
	 *
	 * @return boolean
	 */
	function _check_logged_in() {
		foreach ( array_keys( $_COOKIE ) as $cookie_name ) {
			if ( strpos( $cookie_name, 'wordpress_logged_in' ) === 0 )
				return false;
		}

		return true;
	}

	private function _get_group( $sql ) {
		$sql = strtolower( $sql );
		$matched = array();
		$options = false. $comments = false;
		$prefix = $this->wpdb_mixin->prefix;
		$options = preg_match( '~' . $prefix . 'options~i', $sql );
		$comments = preg_match( '~' . $prefix . '(comments|commentsmeta)~i', $sql );

		if ( $options && $comments )
			return 'options_comments';
		if ( $options )
			return 'options';
		if ( $comments )
			return 'comments';
		return 'all';
	}

	private function _get_flush_groups( $group ) {
		switch ( $group ) {
		case 'all':
			return array( 'all', 'options_comments', 'options', 'comments' );
		case 'options_comments':
			return array( 'options_comments', 'options', 'comments' );
		case 'options':
		case 'comments':
			return array( 'options_comments', $group );
			break;
		default:
			return array( $group );
		}
	}


	public function get_reject_reason() {
		if ( is_null( $this->cache_reject_reason ) )
			return '';
		$request_wide_string = $this->cache_reject_request_wide ?
			( function_exists( '__' ) ? __( 'Request-wide', 'w3-total-cache' ).' ' : 'Request ' ) : '';
		return $request_wide_string . $this->_get_reject_reason_message( $this->cache_reject_reason );
	}

	/**
	 *
	 *
	 * @param unknown $key
	 * @return string|void
	 */
	private function _get_reject_reason_message( $key ) {
		if ( !function_exists( '__' ) )
			return $key;
		switch ( $key ) {
		case 'dbcache.disabled':
				return __( 'Database caching is disabled', 'w3-total-cache' );
		case 'DONOTCACHEDB':
			return __( 'DONOTCACHEDB constant is defined', 'w3-total-cache' );
		case 'DOING_AJAX':
			return __( 'Doing AJAX', 'w3-total-cache' );
		case 'request':
			return __( 'Request URI is rejected', 'w3-total-cache' );
		case 'cookie':
			return __( 'Cookie is rejected', 'w3-total-cache' );
		case 'DOING_CRONG':
			return __( 'Doing cron', 'w3-total-cache' );
		case 'APP_REQUEST':
			return __( 'Application request', 'w3-total-cache' );
		case 'XMLRPC_REQUEST':
			return __( 'XMLRPC request', 'w3-total-cache' );
		case 'WP_ADMIN':
			return __( 'wp-admin', 'w3-total-cache' );
		case 'SHORTINIT':
			return __( 'Short init', 'w3-total-cache' );
		case 'query':
			return __( 'Query is rejected', 'w3-total-cache' );
		case 'user.logged_in':
			return __( 'User is logged in', 'w3-total-cache' );
		default:
			return $key;
		}
	}

	public function w3tc_footer_comment( $strings ) {
		if ( $this->debug ) {
			$strings[] = "Db cache debug info:";
			$strings[] = sprintf( "%s%s", str_pad( 'Engine: ', 20 ), Cache::engine_name( $this->_config->get_string( 'dbcache.engine' ) ) );
			$strings[] = sprintf( "%s%d", str_pad( 'Total queries: ', 20 ), $this->query_total );
			$strings[] = sprintf( "%s%d", str_pad( 'Cached queries: ', 20 ), $this->query_hits );
			$strings[] = sprintf( "%s%.4f", str_pad( 'Total query time: ', 20 ), $this->time_total );

			if ( count( $this->query_stats ) ) {
				$strings[] = "SQL info:";
				$strings[] = sprintf( "%s | %s | %s | % s | %s | %s",
					str_pad( '#', 5, ' ', STR_PAD_LEFT ), str_pad( 'Time (s)', 8, ' ', STR_PAD_LEFT ),
					str_pad( 'Caching (Reject reason)', 30, ' ', STR_PAD_BOTH ),
					str_pad( 'Status', 10, ' ', STR_PAD_BOTH ),
					str_pad( 'Data size (b)', 13, ' ', STR_PAD_LEFT ),
					'Query' );

				foreach ( $this->query_stats as $index => $query ) {
					$strings[] = sprintf( "%s | %s | %s | %s | %s | %s",
						str_pad( $index + 1, 5, ' ', STR_PAD_LEFT ),
						str_pad( round( $query['time_total'], 4 ), 8, ' ', STR_PAD_LEFT ),
						str_pad( ( $query['caching'] ? 'enabled'
								: sprintf( 'disabled (%s)', $query['reason'] ) ), 30, ' ', STR_PAD_BOTH ),
						str_pad( ( $query['cached'] ? 'cached' : 'not cached' ), 10, ' ', STR_PAD_BOTH ),
						str_pad( $query['data_size'], 13, ' ', STR_PAD_LEFT ),
						trim( $query['query'] ) );
				}
			}
		} else {
			$reason = $this->get_reject_reason();
			$append = ( $reason ? sprintf( ' (%s)', $reason ) : '' );

			if ( $this->query_hits ) {
				$strings[] = sprintf(
					__( 'Database Caching %d/%d queries in %.3f seconds using %s%s', 'w3-total-cache' ),
					$this->query_hits, $this->query_total, $this->time_total,
					Cache::engine_name( $this->_config->get_string( 'dbcache.engine' ) ),
					$append );
			} else {
				$strings[] = sprintf(
					__( 'Database Caching using %s%s', 'w3-total-cache' ),
					Cache::engine_name( $this->_config->get_string( 'dbcache.engine' ) ),
					$append );
			}
		}

		return $strings;
	}

	public function w3tc_usage_statistics_of_request( $storage ) {
		$storage->counter_add( 'dbcache_calls_total', $this->query_total );
		$storage->counter_add( 'dbcache_calls_hits', $this->query_hits );
	}
}
