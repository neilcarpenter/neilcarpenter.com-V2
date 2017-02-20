<?php
namespace W3TC;

/**
 * W3 Cache class
 */

/**
 * class Cache
 */
class Cache {
	/**
	 * Returns cache engine instance
	 *
	 * @param string  $engine
	 * @param array   $config
	 * @return W3_Cache_Base
	 */
	static function instance( $engine, $config = array() ) {
		static $instances = array();

		// common configuration data
		if ( !isset( $config['blog_id'] ) )
			$config['blog_id'] = Util_Environment::blog_id();

		$instance_key = sprintf( '%s_%s', $engine, md5( serialize( $config ) ) );

		if ( !isset( $instances[$instance_key] ) ) {
			switch ( $engine ) {
			case 'apc':
				if ( function_exists( 'apcu_store' ) )
					$instances[$instance_key] = new Cache_Apcu( $config );
				else if ( function_exists( 'apc_store' ) )
						$instances[$instance_key] = new Cache_Apc( $config );
					break;

			case 'eaccelerator':
				$instances[$instance_key] = new Cache_Eaccelerator( $config );
				break;

			case 'file':
				$instances[$instance_key] = new Cache_File( $config );
				break;

			case 'file_generic':
				$instances[$instance_key] = new Cache_File_Generic( $config );
				break;

			case 'memcached':
				if ( class_exists( '\Memcached' ) ) {
					$instances[$instance_key] = new Cache_Memcached( $config );
				} else if ( class_exists( '\Memcache' ) ) {
						$instances[$instance_key] = new Cache_Memcache( $config );
					}
				break;

			case 'redis':
				$instances[$instance_key] = new Cache_Redis( $config );
				break;

			case 'wincache':
				$instances[$instance_key] = new Cache_Wincache( $config );
				break;

			case 'xcache':
				$instances[$instance_key] = new Cache_Xcache( $config );
				break;

			default:
				trigger_error( 'Incorrect cache engine ' . $engine, E_USER_WARNING );
				$instances[$instance_key] = new Cache_Base( $config );
				break;
			}

			if ( !isset( $instances[$instance_key] ) ||
				!$instances[$instance_key]->available() ) {
				$instances[$instance_key] = new Cache_Base( $config );
			}
		}

		return $instances[$instance_key];
	}

	/**
	 * Returns caching engine name
	 *
	 * @param unknown $engine
	 * @param unknown $module
	 *
	 * @return string
	 */
	static public function engine_name( $engine, $module = '' ) {
		switch ( $engine ) {
		case 'memcached':
			if ( class_exists( 'Memcached' ) )
				$engine_name = 'memcached';
			else
				$engine_name = 'memcache';

			break;

		case 'apc':
			$engine_name = 'apc';
			break;

		case 'eaccelerator':
			$engine_name = 'eaccelerator';
			break;

		case 'redis':
			$engine_name = 'redis';
			break;

		case 'xcache':
			$engine_name = 'xcache';
			break;

		case 'wincache':
			$engine_name = 'wincache';
			break;

		case 'file':
			if ( $module == 'pgcache' )
				$engine_name = 'disk: basic';
			else
				$engine_name = 'disk';
			break;

		case 'file_generic':
			$engine_name = 'disk: enhanced';
			break;

		case 'ftp':
			$engine_name = 'self-hosted / file transfer protocol upload';
			break;

		case 's3':
			$engine_name = 'amazon simple storage service (s3)';
			break;

		case 'cf':
			$engine_name = 'amazon cloudfront';
			break;

		case 'google_drive':
			$engine_name = 'google drive';
			break;

		case 'highwinds':
			$engine_name = 'highwinds';
			break;

		case 'cf2':
			$engine_name = 'amazon cloudfront';
			break;

		case 'rscf':
			$engine_name = 'rackspace cloud files';
			break;

		case 'azure':
			$engine_name = 'microsoft azure storage';
			break;

		case 'mirror':
			$engine_name = 'mirror';
			break;

		case 'netdna':
			$engine_name = 'netdna';
			break;

		case 'maxcdn':
			$engine_name = 'maxcdn';
			break;

		case 'cotendo':
			$engine_name = 'cotendo';
			break;

		case 'akamai':
			$engine_name = 'akamai';
			break;

		case 'edgecast':
			$engine_name = 'media template procdn / edgecast';
			break;

		case 'att':
			$engine_name = 'at&amp;t';
			break;

		default:
			$engine_name = 'n/a';
			break;
		}

		return $engine_name;
	}

}
