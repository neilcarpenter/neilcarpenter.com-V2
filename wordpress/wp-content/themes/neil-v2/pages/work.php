<?
/**
 *
 * Template Name: Work page
 *
 */
?>
<? get_template_part( 'parts/shared/html-header' ); ?>
	
	<? get_template_part( 'parts/shared/header' ); ?>

		<?
		$projects = nc_get_all_projects();
		?>

		<div class="page page-work" data-template="page-work">

			<div class="grid" data-page-transition>

			<?
				$count = count($projects);
				foreach ($projects as $idx => $_project) {
					$project = $_project['post_object'];
					echo ($idx % 2 == 0) ? "<div class=\"row cf\">" : "";
			?>
					<article class="grid-item grid-item-<?= $project->grid_size ?>" data-scroll-item>
						<a href="<?= get_site_url(); ?>/work/<?= $project->post_name ?>/">
							<span class="work-preview-thumb bg-image-wrapper" data-lazyimage="<?= $project->thumbnail ?>">
								<span class="bg-image"></span>
								<div class="preloader preloader-image show">
									<span class="preloader-inner"><span class="mask" data-preloader-mask="inner"></span></span>
									<span class="preloader-outer"><span class="mask" data-preloader-mask="outer"></span></span>
								</div>
							</span>
							<h2 class="work-preview-client"><span class="wo"><span class="wi"><? the_field('project_client', $project->ID) ?></span></span></h2>
							<h1 class="work-preview-name"><span class="wo"><span class="wi"><?= $project->post_title ?></span></span></h1>
						</a>
					</article>
			<?
				echo (($idx % 2 == 1) || ($idx == $count-1)) ? "</div>" : "";
				}
			?>

			</div>
			
		</div>
	
<? get_template_part( 'parts/shared/html-footer' ); ?>
