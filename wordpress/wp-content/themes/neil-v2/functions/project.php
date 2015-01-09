<?php
/**
 * Project functions
 *
 * @author Neil Carpenter
 *
 */

function nc_get_project_nav($id, $direction) {

	$_posts = get_field('work_projects', $GLOBALS['WORK_ID']);
	$count  = count($_posts);

	$currentIdx = 0;

	foreach ($_posts as $idx => $_post) {
		if ($_post['post_object']->ID == $id) $currentIdx = $idx;
	}

	if (($currentIdx == 0 && $direction == 'previous') || ($currentIdx == $count-1 && $direction == 'next')) {
		$_project = false;
	} elseif ($direction == 'previous') {
		$_project = $_posts[$currentIdx-1]['post_object'];
	} elseif ($direction == 'next') {
		$_project = $_posts[$currentIdx+1]['post_object'];
	}

	$project = $_project ? array(
		'text' => get_field('project_client', $_project->ID).' - '.$_project->post_title,
		'url'  => home_url().'/work/'.$_project->post_name
	) : false;

	return $project;

}

?>