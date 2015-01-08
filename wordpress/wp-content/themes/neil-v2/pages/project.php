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

				<? the_field('project_content') ?>

				<? /* here just for reference

				<div class="proj-intro" data-scroll-item>
					<p>Create a calendar all about you, as a gift. You’re so thoughtful.</p>
					<p><a href="http://three.co.uk/CalendarMe" target="_blank">Visit site</a></p>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full" data-post-intro>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-01_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>UNIT9 were tasked with building Three's Christmas 2014 campaign, which allows users to upload / take a photo of themselves, and create a personalised annual calendar, which they can then share, or download as a PDF. They also had chance to enter daily competition to have a printed version delivered to them.</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-02_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-03_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>I was tech lead on the project at UNIT9, responsible for managing team of up to 9 developers, guiding technical decisions and liaising internally and with client throughout the course of the tight-timeline project (5 week production).</p>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-small" data-scroll-item>
						<p>The site is fully responsive, working across desktop, mobile, tablet. Front end is a Backbone app based on UNIT9's coffee-bone boilerplate, which uses Backbone, Underscore, jQuery, TweenLite, Modernizr, CoffeeScript, Sass, Gulp, Browserify. The FE also uses some JS plugins such as Fabric image editor, and slick.js carousel.</p>
						<p>I also wrote a node script to integrate with our gulp build process that automated deployment and versioning of static assets to S3, as well as interpolating static asset references throughout the front end codebase to use S3-hosted assets in production.</p>
						<p>The backend is Python + Django on AWS, using EC2, S3 and ELB. The backend image processing is handled by dedicated instances running OpenCV 2 on Python, with ReportLab to generate PDFs. The entire backend is configured to auto-scale based on user traffic to keep response times low (full calendar - 12 months + 1 cover, would be generated and uploaded to S3 in under 5s on average) which was an essential prerequisite of the build as it was the target of a high-profile media drive.</p>
					</div>
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-04_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-05_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-06_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-large">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-07_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img proj-image-browser bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-08_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-09_{{ RWD_SIZE }}.png">
								<span class="bg-image"></span>
							</span>
						</div>
					</div>
					<div class="grid-item grid-item-small" data-scroll-item>
						<h3>Credits</h3>
						<ul class="credit-list">
							<li class="label">Client</li>
							<li>Three</li>
							<li class="label">Agency</li>
							<li>Wieden+Kennedy London</li>
							<li class="label">Production Company</li>
							<li>UNIT9</li>
							<li class="label">Producer</li>
							<li>Richard Rowe</li>
							<li class="label">Project Manager</li>
							<li>Josselin Milon</li>
							<li class="label">UX</li>
							<li>Quentin Gauvrit</li>
							<li class="label">Creative</li>
							<li>Dirk van Ginkel</li>
							<li class="label">Design</li>
							<li>Sean Hobman</li>
							<li>Steve McGeorge</li>
							<li class="label">Motion design</li>
							<li>Godart Raets</li>
							<li class="label">Tech lead</li>
							<li>Neil Carpenter</li>
							<li class="label">Lead backend developer</li>
							<li>Dominique Peretti</li>
							<li class="label">Backend developer</li>
							<li>Krzysztof Skoracki</li>
							<li class="label">Developer</li>
							<li>Damien Mortini</li>
							<li class="label">Frontend developers</li>
							<li>Fabio Azevedo</li>
							<li>Michal Kleszcz</li>
							<li>Damien Seguin</li>
							<li>Edgard Zavarezzi</li>
							<li>Jaroslaw Wulnikowski</li>
						</ul>
					</div>
				</div>

				<div class="row cf">
					<div class="grid-item grid-item-full">
						<div class="proj-img-wrap proj-img_1">
							<span class="proj-img bg-image-wrapper" data-scroll-item data-lazyimage="{{ BASE_URL }}/wp-content/uploads/2015/01/proj-calendarme-10_{{ RWD_SIZE }}.png">
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
