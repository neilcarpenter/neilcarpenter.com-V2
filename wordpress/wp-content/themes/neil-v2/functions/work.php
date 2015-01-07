<?php
/**
 * Work functions
 *
 * @author Neil Carpenter
 *
 */

function nc_get_all_projects() {

	$args     = array('post_type' => 'page', 'posts_per_page' => -1, 'post_parent' => $GLOBALS['WORK_ID']);
	$query    = new WP_Query( $args );
	$projects = $query->posts;
	$count    = count($projects);

	foreach ($projects as $idx => $project) {

		$row  = ceil(($idx+1)/2);
		$size = (($row % 2 == 0 && $idx % 2 == 1) || ($row % 2 == 1 && $idx % 2 == 0)) ? 'large' : 'small';

		$_imgSrc = wp_get_attachment_image_src( get_field('project_thumbnail', $project->ID), 'large' );
		$imgSrc  = $_imgSrc[0];

		$project->grid_size = $size;
		$project->thumbnail = $imgSrc;

	}

	return $projects;

}

?>