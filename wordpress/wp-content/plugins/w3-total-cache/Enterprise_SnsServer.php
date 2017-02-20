<?php
namespace W3TC;

/**
 * Purge using AmazonSNS object
 */

require_once W3TC_LIB_DIR . '/SNS/services/MessageValidator/Message.php';
require_once W3TC_LIB_DIR . '/SNS/services/MessageValidator/MessageValidator.php';

/**
 * class Sns
 */
class Enterprise_SnsServer extends Enterprise_SnsBase {

	/**
	 * Processes message from SNS
	 *
	 * @throws Exception
	 */
	function process_message() {
		$this->_log( 'Received message' );

		try {
			$message = \Message::fromRawPostData();
			$validator = new \MessageValidator();
			$error = '';
			if ( $validator->isValid( $message ) ) {
				$topic_arn = $this->_config->get_string( 'cluster.messagebus.sns.topic_arn' );

				if ( empty( $topic_arn ) || $topic_arn != $message->get( 'TopicArn' ) )
					throw new \Exception ( 'Not my Topic. Request came from ' .
						$message->get( 'TopicArn' ) );

				if ( $message->get( 'Type' ) == 'SubscriptionConfirmation' )
					$this->_subscription_confirmation( $message );
				elseif ( $message->get( 'Type' ) == 'Notification' )
					$this->_notification( $message->get( 'Message' ) );
			} else {
				$this->_log( 'Error processing message it was not valid.' );
			}
		} catch ( \Exception $e ) {
			$this->_log( 'Error processing message: ' . $e->getMessage() );
		}
		$this->_log( 'Message processed' );
	}

	/**
	 * Confirms subscription
	 *
	 * @param Message $message
	 * @throws Exception
	 */
	private function _subscription_confirmation( $message ) {
		$this->_log( 'Issuing confirm_subscription' );
		$response = $this->_get_api()->confirm_subscription(
			$topic_arn, $message->get( 'Token' ) );
		$this->_log( 'Subscription confirmed: ' .
			( $response->isOK() ? 'OK' : 'Error' ) );
	}

	/**
	 * Processes notification
	 *
	 * @param array   $v
	 */
	private function _notification( $v ) {
		$m = json_decode( $v, true );
		if ( isset( $m['hostname'] ) )
			$this->_log( 'Message originated from hostname: ' . $m['hostname'] );

		define( 'DOING_SNS', true );
		$this->_log( 'Actions executing' );
		do_action( 'w3tc_messagebus_message_received' );

		if ( isset( $m['actions'] ) ) {
			$actions = $m['actions'];
			foreach ( $actions as $action )
				$this->_execute( $action );
		} else {
			$this->_execute( $m['action'] );
		}

		do_action( 'w3tc_messagebus_message_processed' );
		$this->_log( 'Actions executed' );
	}

	/**
	 * Execute action
	 *
	 * @param unknown $m
	 * @throws Exception
	 */
	private function _execute( $m ) {
		$action = $m['action'];
		$this->_log( 'Executing action ' . $action );
		//Needed for cache flushing
		$executor = new CacheFlush_Locally();
		//Needed for cache cleanup
		$pgcache_admin = Dispatcher::component( 'PgCache_Plugin_Admin' );

		//See which message we got
		if ( $action == 'dbcache_flush' )
			$executor->dbcache_flush();
		elseif ( $action == 'objectcache_flush' )
			$executor->objectcache_flush();
		elseif ( $action == 'fragmentcache_flush' )
			$executor->fragmentcache_flush();
		elseif ( $action == 'fragmentcache_flush_group' )
			$executor->fragmentcache_flush_group( $m['group'] );
		elseif ( $action == 'minifycache_flush' )
			$executor->minifycache_flush();
		elseif ( $action == 'browsercache_flush' )
			$executor->browsercache_flush();
		elseif ( $action == 'cdn_purge_files' )
			$executor->cdn_purge_files( $m['purgefiles'] );
		elseif ( $action == 'pgcache_cleanup' )
			$pgcache_admin->cleanup_local();
		elseif ( $action == 'opcache_flush' )
			$executor->opcache_flush();
		elseif ( $action == 'opcache_flush_file' )
			$executor->opcache_flush_file( $m['filename'] );
		elseif ( $action == 'flush_all' )
			$executor->flush_all(
				isset( $m['extras'] ) ? $m['extras'] : null );
		elseif ( $action == 'flush_post' )
			$executor->flush_post( $m['post_id'] );
		elseif ( $action == 'flush_url' )
			$executor->flush_url( $m['url'] );
		elseif ( $action == 'prime_post' )
			$executor->prime_post( $m['post_id'] );
		else
			throw new \Exception( 'Unknown action ' . $action );

		$this->_log( 'succeeded' );
	}
}
