<?php
/**
 * Misc functions
 *
 * @author Neil Carpenter
 *
 */

/**
 * Get all html <meta>
 *
 * @author Neil Carpenter
 * @returns Array
 *
 */
function nc_get_meta( $id ) {

	$post_type = get_post_type( $id );

	$meta                = array();
	$meta['title']       = _get_title( $id, $post_type );
	$meta['keywords']    = _get_keywords( $id, $post_type );
	$meta['description'] = _get_description( $id, $post_type );
	$meta['url']         = _get_url( $id, $post_type );
	$meta['image']       = _get_image( $id, $post_type );

	return $meta;

}

function _get_title( $id, $post_type ) {

	if ($post_type == 'post') {
		$title = get_the_title();
	} else {
		$title = get_bloginfo('name');
	}

	return $title;

}

function _get_keywords( $id, $post_type ) {

	if (get_field('meta_keywords')) {
		$words = get_field('meta_keywords');
	} else {
		$words = get_field('meta_keywords', $GLOBALS['HOME_ID']);
	}

	return $words;

}

function _get_description( $id, $post_type ) {

	if (get_field('meta_description') != '') {
		$descr = get_field('meta_description');
	} else if ($post_type == 'post') {
		$descr = trunc( strip_tags( get_field('person_bio') ), 30 );
	} else {
		$descr = get_field('meta_description', $GLOBALS['HOME_ID']);
	}

	return $descr;

}

function _get_url( $id, $post_type ) {

	if ($post_type == 'post') {
		$post = get_post($id);
		$slug = $post->post_name;
		$url  = get_bloginfo('url').'/artists/'.$slug;
	} else {
		$url = get_bloginfo('url');
	}

	return $url;

}

function _get_image( $id, $post_type ) {

	if (get_field('sharing_image') != '') {
		$imgID = get_field('sharing_image');
	} else if ($post_type == 'post') {
		$imgs  = get_field('person_images');
		$imgID = empty($imgs) ? false : $imgs[0];
	} else {
		$imgID = get_field('sharing_image', $GLOBALS['HOME_ID']);
	}

	if ($imgID) {
		$imgSrc = wp_get_attachment_image_src( $imgID, 'medium');
		$img    = $imgSrc[0];
	} else {
		$img = "";
	}

	return $img;

}

function nc_get_preloader_shape() {

	$shapes = array('circle', 'square', 'triangle');
	shuffle($shapes);

	return $shapes[0];

}

?>