<?
 /**
  * REMEBER to edit this in /project/html, not in WP template directory
  */

	$id   = get_the_ID();
	$meta = nc_get_meta( $id );
?>
<!DOCTYPE html>
<html class="no-js" lang="en-gb">
<head>
	<meta content="content-type" content="text/html; charset=utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<meta name="google" value="notranslate">
	<META NAME="ROBOTS" CONTENT="INDEX, FOLLOW">
	<title><?php wp_title( '&bull;', TRUE, 'right' ); ?><?php bloginfo( 'name' ); ?></title>

	<meta name="description" content="<?= $meta['description'] ?>">
	<meta name="keywords" content="<?= $meta['keywords'] ?>">
	<meta name="viewport" id="viewport" content="width=device-width, initial-scale=1.0" />

	<link rel="shortcut icon" href="<? bloginfo('url');?>/favicon.png" type="image/x-icon" />
	<link rel="apple-touch-icon" href="<? bloginfo('url');?>/apple-touch-icon.png" />
	<link rel="apple-touch-icon" sizes="57x57" href="<? bloginfo('url');?>/apple-touch-icon-57x57.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="<? bloginfo('url');?>/apple-touch-icon-72x72.png" />
	<link rel="apple-touch-icon" sizes="76x76" href="<? bloginfo('url');?>/apple-touch-icon-76x76.png" />
	<link rel="apple-touch-icon" sizes="114x114" href="<? bloginfo('url');?>/apple-touch-icon-114x114.png" />
	<link rel="apple-touch-icon" sizes="120x120" href="<? bloginfo('url');?>/apple-touch-icon-120x120.png" />
	<link rel="apple-touch-icon" sizes="144x144" href="<? bloginfo('url');?>/apple-touch-icon-144x144.png" />
	<link rel="apple-touch-icon" sizes="152x152" href="<? bloginfo('url');?>/apple-touch-icon-152x152.png" />

	<meta property="og:title"        content="<?= $meta['title'] ?>">
	<meta property="og:url"          content="<?= $meta['url'] ?>">
	<meta property="og:image"        content="<?= $meta['image'] ?>">
	<meta property="og:description"  content="<?= $meta['description'] ?>">
	<meta property="og:site_name"    content="<?php bloginfo('name'); ?>">

	<meta name="twitter:card"        content="summary_large_image">
	<meta name="twitter:creator"     content="@neilcarpenter">
	<meta name="twitter:url"         content="<?= $meta['url'] ?>">
	<meta name="twitter:title"       content="<?= $meta['title'] ?>">
	<meta name="twitter:description" content="<?= $meta['description'] ?>">
	<meta name="twitter:image"       content="<?= $meta['image'] ?>">

	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

	<link rel="stylesheet" href="<? bloginfo('template_directory');?>/{{ css/main.css }}">
	<script src="<? bloginfo('template_directory');?>/{{ js/vendor/modernizr-custom.js }}"></script>

</head>

<body>

	<div id="main" data-template="main">

		<div id="preloader" class="preloader preloader-site show">
			<span class="preloader-inner"><span class="mask" data-preloader-mask="inner"></span></span>
			<span class="preloader-outer"><span class="mask" data-preloader-mask="outer"></span></span>
		</div>
