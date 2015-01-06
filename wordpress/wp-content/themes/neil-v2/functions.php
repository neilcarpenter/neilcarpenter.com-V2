<?php
	/**
	 * Starkers functions and definitions
	 *
	 * For more information on hooks, actions, and filters, see http://codex.wordpress.org/Plugin_API.
	 *
 	 * @package 	WordPress
	 * @subpackage 	Resonate 2015
	 */

	/* ========================================================================================================================
	
	Required external files
	
	======================================================================================================================== */

	require_once( 'external/starkers-utilities.php' );

	/* ========================================================================================================================
	
	Theme specific settings

	Uncomment register_nav_menus to enable a single menu with the title of "Primary Navigation" in your theme
	
	======================================================================================================================== */

	add_theme_support('post-thumbnails');
	
	// register_nav_menus(array('primary' => 'Primary Navigation'));

	/* ========================================================================================================================
	
	Actions and Filters
	
	======================================================================================================================== */

	add_action( 'wp_enqueue_scripts', 'starkers_script_enqueuer' );

	add_filter( 'body_class', array( 'Starkers_Utilities', 'add_slug_to_body_class' ) );

	/* ========================================================================================================================
	
	Custom Post Types - include custom post types and taxonimies here e.g.

	e.g. require_once( 'custom-post-types/your-custom-post-type.php' );
	
	======================================================================================================================== */



	/* ========================================================================================================================
	
	Scripts
	
	======================================================================================================================== */

	/**
	 * Add scripts via wp_head()
	 *
	 * @return void
	 * @author Keir Whitaker
	 */

	function starkers_script_enqueuer() {
		wp_register_script( 'site', get_template_directory_uri().'/js/site.js', array( 'jquery' ) );
		wp_enqueue_script( 'site' );

		wp_register_style( 'screen', get_stylesheet_directory_uri().'/style.css', '', '', 'screen' );
        wp_enqueue_style( 'screen' );
	}	

	/* ========================================================================================================================
	
	Comments
	
	======================================================================================================================== */

	/**
	 * Custom callback for outputting comments 
	 *
	 * @return void
	 * @author Keir Whitaker
	 */
	function starkers_comment( $comment, $args, $depth ) {
		$GLOBALS['comment'] = $comment; 
		?>
		<?php if ( $comment->comment_approved == '1' ): ?>	
		<li>
			<article id="comment-<?php comment_ID() ?>">
				<?php echo get_avatar( $comment ); ?>
				<h4><?php comment_author_link() ?></h4>
				<time><a href="#comment-<?php comment_ID() ?>" pubdate><?php comment_date() ?> at <?php comment_time() ?></a></time>
				<?php comment_text() ?>
			</article>
		<?php endif;
	}

	/* ========================================================================================================================
	
	Resonate '15 custom stuffs
	
	======================================================================================================================== */

	/**
	 * Hide the featured image box in admin area
	 *
	 * @return void
	 * @author Neil Carpenter
	 */
	add_action('admin_head', 'hide_featured_image');

	function hide_featured_image() {
		?>
		
		<style>
			#postimagediv { display:none; }
		</style>

		<?php
	}

	/**
	 * Hide the main content editor area on certain templates 
	 *
	 * @return void
	 * @author Neil Carpenter
	 */
	add_action('admin_head', 'hide_editor');

	/*function hide_editor() {

		global $wp_query;

		// get post id from viewed page
		$post_id = $wp_query->post->ID;

		// does post id exist?
		if( !$post_id )
		{
			// get post id from admin page
			$post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'] ;
		}

		$template_name = get_post_meta( $post_id, '_wp_page_template', TRUE );
		$template_name = str_replace( '.php', '', $template_name );
		$template_name = str_replace( 'pages/', '', $template_name );

		$page_name = get_the_title( $post_id );

		// is it a page or post
		$post_type = get_post_type();
		
		if(
			$page_name == 'Navigation' ||
			$page_name == 'Footer' ||
			$page_name == 'Our employees' ||
			$template_name == 'homepage' ||
			$template_name == 'news-landing' ||
			$template_name == 'artist-single' ||
			$template_name == 'artists-landing' ||
			$template_name == 'artists-landing-sub' ||
			$template_name == 'projects-landing'
			//$post_type == 'page' ||
			//$post_type == 'post'
			) {
		?>
		
		<style>
			#postdivrich { display:none; }
		</style>

		<?php
		}
	}*/

	// you know what, just hide it always...

	function hide_editor() {
		?>
		
		<style>
			#postdivrich { display:none; }
		</style>

		<?php
	}

	/**
	 * Hide tags, not using these
	 *
	 * @return void
	 * @author Neil Carpenter
	 */
	add_action('admin_head', 'hide_tags');

	function hide_tags() {
		?>
		
		<style>
			#tagsdiv-post_tag { display:none; }
		</style>

		<?php
	}

	/**
	 * Get slug of post / page
	 *
	 * @return str
	 * @author Neil Carpenter
	 *
	 * FROM HERE - http://www.wprecipes.com/wordpress-function-to-get-postpage-slug
	 *
	 */
	function the_slug() {
	    $post_data = get_post($post->ID, ARRAY_A);
	    $slug = $post_data['post_name'];
	    return $slug; 
	}

	/**
	 * Remove ALL comments
	 *
	 * @return void
	 * @author Neil Carpenter
	 *
	 * FROM HERE - https://www.dfactory.eu/wordpress-how-to/turn-off-disable-comments/
	 *
	 */
	// Disable support for comments and trackbacks in post types
	function df_disable_comments_post_types_support() {
		$post_types = get_post_types();
		foreach ($post_types as $post_type) {
			if(post_type_supports($post_type, 'comments')) {
				remove_post_type_support($post_type, 'comments');
				remove_post_type_support($post_type, 'trackbacks');
			}
		}
	}
	add_action('admin_init', 'df_disable_comments_post_types_support');

	// Close comments on the front-end
	function df_disable_comments_status() {
		return false;
	}
	add_filter('comments_open', 'df_disable_comments_status', 20, 2);
	add_filter('pings_open', 'df_disable_comments_status', 20, 2);

	// Hide existing comments
	function df_disable_comments_hide_existing_comments($comments) {
		$comments = array();
		return $comments;
	}
	add_filter('comments_array', 'df_disable_comments_hide_existing_comments', 10, 2);

	// Remove comments page in menu
	function df_disable_comments_admin_menu() {
		remove_menu_page('edit-comments.php');
	}
	add_action('admin_menu', 'df_disable_comments_admin_menu');

	// Redirect any user trying to access comments page
	function df_disable_comments_admin_menu_redirect() {
		global $pagenow;
		if ($pagenow === 'edit-comments.php') {
			wp_redirect(admin_url()); exit;
		}
	}
	add_action('admin_init', 'df_disable_comments_admin_menu_redirect');

	// Remove comments metabox from dashboard
	function df_disable_comments_dashboard() {
		remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
	}
	add_action('admin_init', 'df_disable_comments_dashboard');

	// Remove comments links from admin bar
	function df_disable_comments_admin_bar() {
		if (is_admin_bar_showing()) {
			remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
		}
	}
	add_action('init', 'df_disable_comments_admin_bar');

	/**
	 * Stop WP from compressing JPGs when uploaded
	 *
	 * @return void
	 *
	 * FROM HERE - http://premium.wpmudev.org/blog/how-to-change-jpeg-compression-in-wordpress/
	 *
	 */
	add_filter( 'jpeg_quality', create_function( '', 'return 100;' ) );

	/**
	 * Truncate string by words
	 *
	 * @return void
	 *
	 * FROM HERE - http://css-tricks.com/snippets/php/truncate-string-by-words/
	 *
	 */
	function trunc($phrase, $max_words) {
		$phrase_array = explode(' ',$phrase);
		if(count($phrase_array) > $max_words && $max_words > 0)
			$phrase = implode(' ',array_slice($phrase_array, 0, $max_words)).'...';
		return $phrase;
	}

	/**
	 * INCLUDE ALL /functions FILES
	 *
	 * @author Neil Carpenter
	 *
	 */
	include('functions/misc.php');
	include('functions/project.php');

?>