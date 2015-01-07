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
		$heroImgSrc  = wp_get_attachment_image_src( get_field('project_thumbnail'), 'original' );
		?>

		<div class="page page-project" data-template="page-project">

			<article class="project-content" data-page-transition>

				<div class="proj-hero">
					<div class="proj-heading">
						<h2 class="proj-client"><span class="wo"><span class="wi"><? the_field('project_client') ?></span></span></h2>
						<h1 class="proj-name"><span class="wo"><span class="wi"><?= get_the_title() ?></span></span></h1>
					</div>
					<div class="proj-img-wrap proj-img_1">
						<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="<?= $heroImgSrc[0] ?>">
							<span class="bg-image"></span>
						</span>
					</div>
					<span class="scroll-to-content arrow arrow-down arrow-medium" data-scroll-to-content></span>
				</div>

				<h3 class="proj-subtitle" data-scroll-item><? the_field('project_client') ?> - <?= get_the_title() ?></h3>

				<nav class="proj-nav-top" data-scroll-item>
					<? if ($prevProject) { ?>
						<a href="<?= $prevProject['url']; ?>" class="prev-proj arrow arrow-left arrow-medium" title="<?= $prevProject['text']; ?>"></a>
					<? } ?>
					<? if ($nextProject) { ?>
						<a href="<?= $nextProject['url']; ?>" class="next-proj arrow arrow-right arrow-medium" title="<?= $nextProject['text']; ?>"></a>
					<? } ?>
				</nav>

				<? //the_field('project_content') ?>

				<? /* here just for reference */ ?>

				<div class="proj-intro" data-scroll-item>
					<p>Fully responsive, single-page, interactive site for the Resonate conference 2015 - bringing together artists to drive a forward-looking debate on the position of technology in art and culture.</p>
					<p><a href="http://resonate.io/2015" target="_blank">Visit site</a></p>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full" data-post-intro>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-01_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small" data-scroll-item>
						<p><a href="http://fluuu.id" target="_blank">FLUUUID</a> collaborated with <a href="http://twitter.com/jocabola" target="_blank">@jocabola</a>, <a href="http://twitter.com/crookookoo" target="_blank">@crookookoo</a> and <a href="http://field.io" target="_blank">FIELD</a> to create the new site for the annual Resonate conference, integrating new branding courtesy of <a href="http://www.hudson-powell.com/" target="_blank">Hudson-Powell</a>, including playful transitions and animations througout the site.</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-02_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-03_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-04_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-05_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>As part of FLUUUID, I helped build the core of the site, including CMS and basic app architecture. FLUUUID was 100% responsible for the build, but worked closely with numerous collaborators during the course of the project.</p>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>The site is built on WordPress, with all content rendered in PHP, but is progressively-enhanced to become a fully single page application thanks to a modified version of UNIT9's <a href="https://github.com/unit9/coffee-bone" target="_blank">coffee-bone boilerplate</a>. Coffee-bone uses Backbone, Underscore, jQuery, TweenLite, Modernizr, Script.js, CoffeeScript, Sass, Gulp, Browserify, amongst other things. The site makes use of PIXI.js for the animation overlaying the site. The site is fully responsive and heavily optimised for performance.</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-06_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-07_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-09_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-08_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_3">
							<span class="proj-img proj-img-iphone bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-10_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img proj-img-iphone bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-11_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img proj-img-iphone bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-12_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-13_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-14_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-15_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-16_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-17_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-resonate2015-18_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<?/**/  ?>

				<nav class="proj-nav-bottom cf">
					<? if ($prevProject) { ?>
						<a href="<?= $prevProject['url']; ?>" class="prev-proj"><?= $prevProject['text']; ?><span class="arrow arrow-small arrow-left"></span></a>
					<? } ?>
					<? if ($nextProject) { ?>
						<a href="<?= $nextProject['url']; ?>" class="next-proj"><?= $nextProject['text']; ?><span class="arrow arrow-small arrow-right"></span></a>
					<? } ?>
				</nav>

			</article>

		</div>
	
<? get_template_part( 'parts/shared/html-footer' ); ?>
