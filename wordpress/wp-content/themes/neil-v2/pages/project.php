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
		$prevProject    = nc_get_project_nav($id, 'previous');
		$nextProject    = nc_get_project_nav($id, 'next');
		$heroImgSrc     = wp_get_attachment_image_src( get_field('project_thumbnail'), 'original' );
		$preloaderShape = nc_get_preloader_shape();
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
							<div class="preloader preloader-image show" data-preloader-shape="<?= $preloaderShape ?>">
								<span class="preloader-inner"><span class="mask" data-preloader-mask="inner"></span></span>
								<span class="preloader-outer"><span class="mask" data-preloader-mask="outer"></span></span>
							</div>
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

				<? the_field('project_content') ?>

				<? /* here just for reference

				<div class="proj-intro">
					<p data-scroll-item>Desafio tudo ou nada - a daily treasure hunt within Google maps / street view throughout the 2014 FIFA World Cup.</p>
					<p data-scroll-item><a href="http://brazucadidas.appspot.com/" target="_blank">Visit site</a></p>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full" data-post-intro>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-01_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small">
						<p data-scroll-item>The site allows users to complete a Google maps / street view "treasure hunt" every day for the 2014 World Cup. Each day there are prize winners based on the player's score for that day's quest, and there are also prizes at the end of the World Cup for the players with the highest overall scores.</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-02_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-03_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-04_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-05_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
					<div class="grid-item grid-item-small">
						<p data-scroll-item>I was lead Front End developer at UNIT9. There was a super tight timeline on the project, with 6 weeks from initial idea brainstorming to full product release - just in time for the World Cup kick off. The dev team grew exponentially as the project progressed - from 3, to 6, and up to a max of 14 active developers at one point.</p>
						<p data-scroll-item>We had to be extremely agile in our build as the UX and project scope was still in flux, which meant a very abstract, and loosely-coupled approach to development. I was responsible for core site architecture, front end data management and API integration, and the user gameplay mechanic, including the Google maps / street view components, and gameplay UI.</p>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full">
						<div class="proj-img-wrap proj-img_3">
							<span class="proj-img proj-img-iphone bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-06_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img proj-img-iphone bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-07_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
							<span class="proj-img proj-img-iphone bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-08_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-09_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small">
						<p data-scroll-item>The site is a fully responsive single-page web app, built on Backbone, jQuery, Underscore, CoffeeScript, Sass, Grunt and Google App Engine (Python). We also make use of a series of third party APIs such as Facebook API, Google+ API, Google Maps API.</p>
						<p data-scroll-item>The site gameplay data is powered by a fully-customised CMS which allows authors to interact with Google maps / street view to easily create each day's "quest".</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-10_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-11_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-12_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-13_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-14_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
					<div class="grid-item grid-item-small" data-scroll-item>
						<h3 class="credit-title">Credits</h3>
						<ul class="credit-list">
							<li class="label">Client</li>
							<li>Adidas Brasil</li>
							<li class="label">Agency</li>
							<li>Google Zoo</li>
							<li class="label">Production Company</li>
							<li>UNIT9</li>
							<li class="label">Director</li>
							<li>Takayoshi Kishimoto</li>
							<li class="label">Executive producer</li>
							<li>Marc D'Souza</li>
							<li class="label">Technical director</li>
							<li>Yates Buckley</li>
							<li class="label">Project managers</li>
							<li>Cyriele Piancastelli</li>
							<li>Frederic Mouniguet </li>
							<li class="label">UX</li>
							<li>Quentin Gauvrit</li>
							<li class="label">Designers</li>
							<li>Karol Góreczny</li>
							<li>Steven Mengin</li>
							<li class="label">Technical lead</li>
							<li>Silvio Paganini</li>
							<li class="label">Lead frontend developer</li>
							<li>Neil Carpenter</li>
							<li class="label">Frontend developers</li>
							<li>William Mapan</li>
							<li>Michal Kleszcz</li>
							<li>Damien Mortini</li>
							<li>Sam Brown</li>
							<li>Edgard Zavarezzi</li>
							<li>Andy Kenward</li>
							<li class="label">Backend developers</li>
							<li>Krzysztof Kokoszka</li>
							<li>Krzysztof Skoracki</li>
							<li>Darko Stankovski</li>
							<li>Adrian Lolo</li>
							<li class="label">QA</li>
							<li>Peter Law</li>
							<li>zoonou</li>
						</ul>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full" data-post-intro>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-15_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-16_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-brazuca-17_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				*/  ?>

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
