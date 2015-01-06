<?
/**
 *
 * Template Name: Work -> Project page
 *
 */
?>
<? get_template_part( 'parts/shared/html-header' ); ?>
	
	<? get_template_part( 'parts/shared/header' ); ?>

		<?
		$prevProject = nc_get_project_nav($id, 'previous');
		$nextProject = nc_get_project_nav($id, 'next');
		?>

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
					<span class="scroll-to-content arrow arrow-down-medium" data-scroll-to-content></span>
				</div>

				<h3 class="proj-subtitle" data-scroll-item><? the_field('project_client') ?> - <?= get_the_title() ?></h3>

				<? //the_field('project_content') ?>

				<nav class="proj-nav-top" data-scroll-item>
					<? if ($prevProject) { ?>
						<a href="<?= $prevProject['url']; ?>" class="prev-proj arrow arrow-left-medium" title="<?= $prevProject['text']; ?>"></a>
					<? } ?>
					<? if ($nextProject) { ?>
						<a href="<?= $nextProject['url']; ?>" class="next-proj arrow arrow-right-medium" title="<?= $nextProject['text']; ?>"></a>
					<? } ?>
				</nav>

				<div class="proj-intro" data-scroll-item>
					<p>Fully responsive, single-page, interactive site for the Resonate conference 2015 - bringing together artists to drive a forward-looking debate on the position of technology in art and culture.</p>
					<p><a href="http://three.co.uk/calendarMe" target="_blank">Visit site</a></p>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full" data-post-intro>
						<div class="proj-img-wrap proj-img_3">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam odit perspiciatis cupiditate magnam asperiores quod nisi iure error adipisci dicta nam quo, quibusdam natus obcaecati modi, molestiae eveniet rem ea! Nulla, quas tenetur iure vitae eius est totam veritatis iste!</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicin veritatis iste!</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam odit perspiciatis cupiditate magnam asperiores quod nisi iure error adipisci dicta nam quo, quibusdam natus obcaecati modi, molestiae eveniet rem ea! Nulla, quas tenetur iure vitae eius est totam veritatis iste!</p>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam odit perspiciatis cupiditate magnam asperiores quod nisi iure error adipisci dicta nam quo, quibusdam natus obcaecati modi, molestiae eveniet rem ea! Nulla, quas tenetur iure vitae eius est totam veritatis iste!</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_3">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_3">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="http://neilcarpenter.com/wp-content/uploads/2014/12/thumb-resonate2015.jpg">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<nav class="proj-nav-bottom cf">
					<? if ($prevProject) { ?>
						<a href="<?= $prevProject['url']; ?>" class="prev-proj"><?= $prevProject['text']; ?></a>
					<? } ?>
					<? if ($nextProject) { ?>
						<a href="<?= $nextProject['url']; ?>" class="next-proj"><?= $nextProject['text']; ?></a>
					<? } ?>
				</nav>

			</article>

		</div>
	
<? get_template_part( 'parts/shared/html-footer' ); ?>
