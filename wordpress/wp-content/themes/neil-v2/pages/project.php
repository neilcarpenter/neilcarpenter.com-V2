<?
/**
 *
 * Template Name: Work -> Project page
 *
 */
?>
<? get_template_part( 'parts/shared/html-header' ); ?>
	
	<? get_template_part( 'parts/shared/header' ); ?>

		<div class="page page-project" data-template="page-project">

			<article class="project-content" data-page-transition>

				<div class="proj-hero">
					<div class="proj-heading">
						<h2 class="proj-client"><span class="wo"><span class="wi"><? the_field('project_client') ?></span></span></h2>
						<h1 class="proj-name"><span class="wo"><span class="wi"><?= get_the_title() ?></span></span></h1>
					</div>
					<div class="proj-img-wrap proj-img_1">
						<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
							<span class="bg-image"></span>
						</span>
					</div>
					<span class="scroll-to-content" data-scroll-to-content></span>
				</div>

				<h3 class="proj-subtitle" data-scroll-item><? the_field('project_client') ?> - <?= get_the_title() ?></h3>

				<? the_field('project_content') ?>

			</article>

		</div>
	
<? get_template_part( 'parts/shared/html-footer' ); ?>
