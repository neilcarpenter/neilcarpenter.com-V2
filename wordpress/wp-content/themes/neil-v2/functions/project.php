<?php
/**
 * Project functions
 *
 * @author Neil Carpenter
 *
 */

function nc_get_project_nav($id, $direction) {

	$args   = array('post_type' => 'page', 'posts_per_page' => -1, 'post_parent' => $GLOBALS['WORK_ID']);
	$query  = new WP_Query( $args );
	$_posts = $query->posts;
	$count  = count($_posts);

	$currentIdx = 0;

	foreach ($_posts as $idx => $_post) {
		if ($_post->ID == $id) $currentIdx = $idx;
	}

	if (($currentIdx == 0 && $direction == 'previous') || ($currentIdx == $count-1 && $direction == 'next')) {
		$_project = false;
	} elseif ($direction == 'previous') {
		$_project = $_posts[$currentIdx-1];
	} elseif ($direction == 'next') {
		$_project = $_posts[$currentIdx+1];
	}

	$project = $_project ? array(
		'text' => get_field('project_client', $_project->ID).' - '.$_project->post_title,
		'url'  => home_url().'/work/'.$_project->post_name
	) : false;

	return $project;

}

?>