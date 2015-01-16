<?php
/**
 * Work functions
 *
 * @author Neil Carpenter
 *
 */

function nc_get_all_projects() {

	$shapes   = array('circle', 'square', 'triangle');
	$projects = get_field('work_projects');

	foreach ($projects as $idx => $project) {

		$row  = ceil(($idx+1)/2);
		$size = (($row % 2 == 0 && $idx % 2 == 1) || ($row % 2 == 1 && $idx % 2 == 0)) ? 'large' : 'small';

		$_imgSrc = wp_get_attachment_image_src( get_field('project_thumbnail', $project['post_object']->ID), 'large' );
		$imgSrc  = $_imgSrc[0];

		$shape = $shapes[ $idx % 3 ];

		$project['post_object']->grid_size       = $size;
		$project['post_object']->thumbnail       = $imgSrc;
		$project['post_object']->preloader_shape = $shape;

	}

	return $projects;

}

?>