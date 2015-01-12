<?
 /**
  * REMEBER to edit this in /project/html, not in WP template directory
  */

require('neil-v2-config.php');
?>
	</section>

		<script type="text/javascript">

			window.config = {
				ENV             : "",
				GA_code         : window.location.host === 'neilcarpenter.com' ? "UA-16253496-4" : false,
				base_path       : "<?= $base_path ?>",
				base_url        : "<?= site_url(); ?>",
				base_url_assets : "<? bloginfo('template_directory'); ?>",
				dependencies : {
					pixi : "<? bloginfo('template_directory');?>/{{ js/vendor/pixi.js }}"
				}
			};

		</script>

		<script src="<? bloginfo('template_directory');?>/{{ js/vendor/v.js }}"></script>
		<script src="<? bloginfo('template_directory');?>/{{ js/main.js }}"></script>

		<noscript>
			<p>Sorry, JavaScript be needed</p>
		</noscript>

		<script>
			if (window.config.GA_code) {
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

				ga('create', window.config.GA_code, 'auto');
				ga('send', 'pageview');
			}
		</script>

	</div>

</body>

</html>
