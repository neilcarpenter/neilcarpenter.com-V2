<?php

/**
 *
 * Host- based config
 *
 */

switch ($_SERVER['SERVER_NAME']) {
	case 'localhost':
	case '192.168.168.192':
	case '192.168.168.209':
	case 'local.v2.neilcarpenter.com':
		$db_name   = 'neil_v2_local';
		$db_user   = 'root';
		$db_pw     = 'root';
		$db_host   = 'localhost';
		$base_path = '';
		break;
	
	default:
		$db_name   = '';
		$db_user   = '';
		$db_pw     = '';
		$db_host   = '';
		$base_path = '';
		break;
}

/*
 * globals
 */

$GLOBALS['HOME_ID'] = 7;
$GLOBALS['WORK_ID'] = 12;

?>
