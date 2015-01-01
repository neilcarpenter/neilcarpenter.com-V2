<?
/**
 *
 * Template Name: Homepage
 *
 */
?>
<? get_template_part( 'parts/shared/html-header' ); ?>
	
	<? get_template_part( 'parts/shared/header' ); ?>

	<?
		$taglines     = get_field('home_taglines');
		$firstTagline = explode("<br/>", $taglines[0]['tagline']);
	?>

		<div class="page page-home" data-template="page-home">

			<h2 class="home-tagline" data-tagline data-page-transition>
				<span class="wo"><span class="wi"><?= $firstTagline[0] ?></span></span></br><span class="wo"><span class="wi"><?= $firstTagline[1] ?></span></span>
			</h2>

			<script>
				window._TAGLINES = <?= json_encode($taglines); ?>;
			</script>
			
		</div>
	
<? get_template_part( 'parts/shared/html-footer' ); ?>
