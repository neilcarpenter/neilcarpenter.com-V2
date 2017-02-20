<?php
namespace W3TC;

/**
 * class Minify_Plugin
 */
class Minify_Plugin {
	/**
	 * Minify reject reason
	 *
	 * @var string
	 */
	var $minify_reject_reason = '';

	/**
	 * Error
	 *
	 * @var string
	 */
	var $error = '';

	/**
	 * Array of replaced styles
	 *
	 * @var array
	 */
	var $replaced_styles = array();

	/**
	 * Array of replaced scripts
	 *
	 * @var array
	 */
	var $replaced_scripts = array();

	/**
	 * Helper object to use
	 *
	 * @var _W3_MinifyHelpers
	 */
	private $minify_helpers;

	/**
	 * Config
	 */
	private $_config = null;

	function __construct() {
		$this->_config = Dispatcher::config();
	}

	/**
	 * Runs plugin
	 */
	function run() {
		add_action( 'init', array( $this, 'init' ) );
		add_filter( 'cron_schedules', array( $this, 'cron_schedules' ) );

		add_filter( 'w3tc_admin_bar_menu',
			array( $this, 'w3tc_admin_bar_menu' ) );

		if ( !$this->_config->get_boolean( 'minify.debug' ) )
			add_filter( 'w3tc_footer_comment', array(
					$this,
					'w3tc_footer_comment'
				) );

		if ( $this->_config->get_string( 'minify.engine' ) == 'file' ) {
			add_action( 'w3_minify_cleanup', array(
					$this,
					'cleanup'
				) );
		}

		// usage statistics handling
		add_action( 'w3tc_usage_statistics_of_request', array(
				$this, 'w3tc_usage_statistics_of_request' ), 10, 1 );
		add_filter( 'w3tc_usage_statistics_metrics', array(
				$this, 'w3tc_usage_statistics_metrics' ) );

		/**
		 * Start minify
		 */
		if ( $this->can_minify() ) {
			Util_Bus::add_ob_callback( 'minify', array( $this, 'ob_callback' ) );
		}
	}

	public function init() {
		$url = Util_Environment::filename_to_url( W3TC_CACHE_MINIFY_DIR );
		$parsed = parse_url( $url );
		$prefix = '/' . trim( $parsed['path'], '/' ) . '/';

		if ( substr( $_SERVER['REQUEST_URI'], 0, strlen( $prefix ) ) == $prefix ) {
			$w3_minify = Dispatcher::component( 'Minify_MinifiedFileRequestHandler' );
			$w3_minify->process( substr( $_SERVER['REQUEST_URI'], strlen( $prefix ) ) );
			exit();
		}

		if ( !empty( $_REQUEST['w3tc_minify'] ) ) {
			$w3_minify = Dispatcher::component( 'Minify_MinifiedFileRequestHandler' );
			$w3_minify->process( $_REQUEST['w3tc_minify'] );
			exit();
		}
	}

	/**
	 * Does disk cache cleanup
	 *
	 * @return void
	 */
	function cleanup() {
		$a = Dispatcher::component( 'Minify_Plugin_Admin' );
		$a->cleanup();
	}

	/**
	 * Cron schedules filter
	 *
	 * @param array   $schedules
	 * @return array
	 */
	function cron_schedules( $schedules ) {
		$gc = $this->_config->get_integer( 'minify.file.gc' );

		return array_merge( $schedules, array(
				'w3_minify_cleanup' => array(
					'interval' => $gc,
					'display' => sprintf( '[W3TC] Minify file GC (every %d seconds)', $gc )
				)
			) );
	}

	/**
	 * OB callback
	 *
	 * @param string  $buffer
	 * @return string
	 */
	function ob_callback( $buffer ) {
		if ( $buffer != '' && Util_Content::is_html( $buffer ) ) {
			if ( $this->can_minify2( $buffer ) ) {
				$this->minify_helpers = new _W3_MinifyHelpers( $this->_config );

				/**
				 * Replace script and style tags
				 */
				$js_enable = $this->_config->get_boolean( 'minify.js.enable' );
				$css_enable = $this->_config->get_boolean( 'minify.css.enable' );
				$html_enable = $this->_config->get_boolean( 'minify.html.enable' );

				if ( function_exists( 'is_feed' ) && is_feed() ) {
					$js_enable = false;
					$css_enable = false;
				}
				
				$js_enable = apply_filters( 'w3tc_minify_js_enable', $js_enable );
				$css_enable = apply_filters( 'w3tc_minify_css_enable', $css_enable );
				$html_enable = apply_filters( 'w3tc_minify_html_enable', $html_enable );

				$head_prepend = '';
				$body_prepend = '';
				$body_append = '';
				$embed_extsrcjs = false;
				$buffer = apply_filters( 'w3tc_minify_before', $buffer );

				

				if ( $this->_config->get_boolean( 'minify.auto' ) ) {
					if ( $js_enable ) {
						$minifier = new _W3_MinifyJsAuto( $this->_config,
							$buffer, $this->minify_helpers );
						$buffer = $minifier->execute();
						$this->replaced_scripts =
							$minifier->get_debug_minified_urls();
					}

					if ( $css_enable ) {
						$embed_to_html = $this->_config->get_boolean( 'minify.css.embed' );
						$ignore_css_files = $this->_config->get_array( 'minify.reject.files.css' );
						$files_to_minify = array();

						$embed_pos = strpos( $buffer, '<!-- W3TC-include-css -->' );


						$buffer = str_replace( '<!-- W3TC-include-css -->', '', $buffer );
						if ( $embed_pos === false ) {
							if ( preg_match( '~<head(\s+[^>]*)*>~Ui', $buffer, $match, PREG_OFFSET_CAPTURE ) )
								$embed_pos = strlen( $match[0][0] ) + $match[0][1];
							else
								$embed_pos = 0;
						}

						$ignore_css_files = array_map( array( '\W3TC\Util_Environment', 'normalize_file' ), $ignore_css_files );
						$handled_styles = array();
						$style_tags = Minify_Extract::extract_css( $buffer );
						$previous_file_was_ignored = false;
						foreach ( $style_tags as $style_tag_tuple ) {
							$style_tag = $style_tag_tuple[0];
							$style_len = strlen( $style_tag );
							$tag_pos = strpos( $buffer, $style_tag );
							$match = array();
							$url = $style_tag_tuple[1];
							if ( $this->_config->get_boolean( 'minify.debug' ) ) {
								Minify_Core::log( 'adding ' . $url );
							}

							$url = Util_Environment::url_relative_to_full( $url );
							$file = Util_Environment::url_to_docroot_filename( $url );

							$do_tag_minification =
								$this->minify_helpers->is_file_for_minification( $file ) &&
								!in_array( $file, $handled_styles );
							$do_tag_minification = apply_filters( 'w3tc_minify_css_do_tag_minification',
								$do_tag_minification, $style_tag, $file );

							if ( !$do_tag_minification )
								continue;

							$handled_styles[] = $file;
							$this->replaced_styles[] = $file;
							if ( in_array( $file, $ignore_css_files ) ) {
								if ( $tag_pos > $embed_pos ) {
									if ( $files_to_minify ) {
										$data = array(
											'files_to_minify' => $files_to_minify,
											'embed_pos' => $embed_pos,
											'embed_to_html' => $embed_to_html
										);

										$data = apply_filters(
											'w3tc_minify_css_step',
											$data );

										$style = $this->get_style_custom(
											$data['files_to_minify'],
											$data['embed_to_html'] );

										$buffer = substr_replace( $buffer, $style, $embed_pos, 0 );

										$files_to_minify = array();
										$style_len = $style_len +strlen( $style );
									}
									$embed_pos = $embed_pos + $style_len;
									$previous_file_was_ignored = true;
								}
							} else {
								$buffer = substr_replace( $buffer, '', $tag_pos, $style_len );
								if ( $embed_pos > $tag_pos )
									$embed_pos -= $style_len;
								elseif ( $previous_file_was_ignored )
									$embed_pos = $tag_pos;

								$files_to_minify[] = $file;
							}
						}

						$data = array(
							'files_to_minify' => $files_to_minify,
							'embed_pos' => $embed_pos,
							'embed_to_html' => $embed_to_html
						);

						$data = apply_filters( 'w3tc_minify_css_step',
							$data );

						$style = $this->get_style_custom(
							$data['files_to_minify'],
							$data['embed_to_html'] );
						$buffer = substr_replace( $buffer, $style,
							$data['embed_pos'], 0 );
					}

					$buffer = apply_filters( 'w3tc_minify_processed', $buffer );
				} else {
					if ( $css_enable ) {
						$style = $this->get_style_group( 'include' );

						if ( $style ) {
							if ( $this->_custom_location_does_not_exist( '/<!-- W3TC-include-css -->/', $buffer, $style ) )
								$head_prepend .= $style;

							$this->remove_styles_group( $buffer, 'include' );
						}
					}

					if ( $js_enable ) {
						$embed_type = $this->_config->get_string( 'minify.js.header.embed_type' );
						$script = $this->get_script_group( 'include', $embed_type );

						if ( $script ) {
							$embed_extsrcjs = $embed_type == 'extsrc' || $embed_type == 'asyncsrc'?true:$embed_extsrcjs;

							if ( $this->_custom_location_does_not_exist( '/<!-- W3TC-include-js-head -->/', $buffer, $script ) )
								$head_prepend .= $script;

							$this->remove_scripts_group( $buffer, 'include' );
						}

						$embed_type = $this->_config->get_string( 'minify.js.body.embed_type' );
						$script = $this->get_script_group( 'include-body', $embed_type );

						if ( $script ) {
							$embed_extsrcjs = $embed_type == 'extsrc' || $embed_type == 'asyncsrc'?true:$embed_extsrcjs;

							if ( $this->_custom_location_does_not_exist( '/<!-- W3TC-include-js-body-start -->/', $buffer, $script ) )
								$body_prepend .= $script;

							$this->remove_scripts_group( $buffer, 'include-body' );
						}

						$embed_type = $this->_config->get_string( 'minify.js.footer.embed_type' );
						$script = $this->get_script_group( 'include-footer', $embed_type );

						if ( $script ) {
							$embed_extsrcjs = $embed_type == 'extsrc' || $embed_type == 'asyncsrc'?true:$embed_extsrcjs;

							if ( $this->_custom_location_does_not_exist( '/<!-- W3TC-include-js-body-end -->/', $buffer, $script ) )
								$body_append .= $script;

							$this->remove_scripts_group( $buffer, 'include-footer' );
						}
					}
				}

				if ( $head_prepend != '' ) {
					$buffer = preg_replace( '~<head(\s+[^>]*)*>~Ui',
						'\\0' . $head_prepend, $buffer, 1 );
				}

				if ( $body_prepend != '' ) {
					$buffer = preg_replace( '~<body(\s+[^>]*)*>~Ui',
						'\\0' . $body_prepend, $buffer, 1 );
				}

				if ( $body_append != '' ) {
					$buffer = preg_replace( '~<\\/body>~',
						$body_append . '\\0', $buffer, 1 );
				}

				if ( $embed_extsrcjs ) {
					$script = "
<script type=\"text/javascript\">
" ."var extsrc=null;
".'(function(){function j(){if(b&&g){document.write=k;document.writeln=l;var f=document.createElement("span");f.innerHTML=b;g.appendChild(f);b=""}}function d(){j();for(var f=document.getElementsByTagName("script"),c=0;c<f.length;c++){var e=f[c],h=e.getAttribute("asyncsrc");if(h){e.setAttribute("asyncsrc","");var a=document.createElement("script");a.async=!0;a.src=h;document.getElementsByTagName("head")[0].appendChild(a)}if(h=e.getAttribute("extsrc")){e.setAttribute("extsrc","");g=document.createElement("span");e.parentNode.insertBefore(g,e);document.write=function(a){b+=a};document.writeln=function(a){b+=a;b+="\n"};a=document.createElement("script");a.async=!0;a.src=h;/msie/i.test(navigator.userAgent)&&!/opera/i.test(navigator.userAgent)?a.onreadystatechange=function(){("loaded"==this.readyState||"complete"==this.readyState)&&d()}:-1!=navigator.userAgent.indexOf("Firefox")||"onerror"in a?(a.onload=d,a.onerror=d):(a.onload=d,a.onreadystatechange=d);document.getElementsByTagName("head")[0].appendChild(a);return}}j();document.write=k;document.writeln=l;for(c=0;c<extsrc.complete.funcs.length;c++)extsrc.complete.funcs[c]()}function i(){arguments.callee.done||(arguments.callee.done=!0,d())}extsrc={complete:function(b){this.complete.funcs.push(b)}};extsrc.complete.funcs=[];var k=document.write,l=document.writeln,b="",g="";document.addEventListener&&document.addEventListener("DOMContentLoaded",i,!1);if(/WebKit/i.test(navigator.userAgent))var m=setInterval(function(){/loaded|complete/.test(document.readyState)&&(clearInterval(m),i())},10);window.onload=i})();' . "
</script>
";

					$buffer = preg_replace( '~<head(\s+[^>]*)*>~Ui',
						'\\0' . $script, $buffer, 1 );
				}

				/**
				 * Minify HTML/Feed
				 */
				if ( $html_enable ) {
					try {
						$buffer = $this->minify_html( $buffer );
					} catch ( \Exception $exception ) {
						$this->error = $exception->getMessage();
					}
				}
			}
		}

		return $buffer;
	}

	public function w3tc_admin_bar_menu( $menu_items ) {
		$menu_items['20210.minify'] = array(
			'id' => 'w3tc_flush_minify',
			'parent' => 'w3tc_flush',
			'title' => __( 'Minify', 'w3-total-cache' ),
			'href' => wp_nonce_url( network_admin_url(
					'admin.php?page=w3tc_dashboard&amp;w3tc_flush_minify' ),
				'w3tc' )
		);

		return $menu_items;
	}

	function w3tc_footer_comment( $strings ) {
		$strings[] = sprintf(
			__( 'Minified using %s%s', 'w3-total-cache' ),
			Cache::engine_name( $this->_config->get_string( 'minify.engine' ) ),
			( $this->minify_reject_reason != ''
				? sprintf( ' (%s)', $this->minify_reject_reason )
				: '' ) );

		if ( $this->_config->get_boolean( 'minify.debug' ) ) {
			$strings[] = "Minify debug info:";
			$strings[] = sprintf( "%s%s", str_pad( 'Engine: ', 20 ), Cache::engine_name( $this->_config->get_string( 'minify.engine' ) ) );
			$strings[] = sprintf( "%s%s", str_pad( 'Theme: ', 20 ), $this->get_theme() );
			$strings[] = sprintf( "%s%s", str_pad( 'Template: ', 20 ), $this->get_template() );

			if ( $this->minify_reject_reason ) {
				$strings[] = sprintf( "%s%s", str_pad( 'Reject reason: ', 20 ), $this->minify_reject_reason );
			}

			if ( $this->error ) {
				$strings[] = sprintf( "%s%s", str_pad( 'Errors: ', 20 ), $this->error );
			}

			if ( count( $this->replaced_styles ) ) {
				$strings[] = "Replaced CSS files:";

				foreach ( $this->replaced_styles as $index => $file ) {
					$strings[] = sprintf( "%d. %s", $index + 1, Util_Content::escape_comment( $file ) );
				}
			}

			if ( count( $this->replaced_scripts ) ) {
				$strings[] = "Replaced JavaScript files:";

				foreach ( $this->replaced_scripts as $index => $file ) {
					$strings[] = sprintf( "%d. %s\r\n", $index + 1, Util_Content::escape_comment( $file ) );
				}
			}
		}

		return $strings;
	}
	/**
	 * Checks to see if pattern exists in source if so replaces it with the provided script
	 * and returns false. If pattern does not exists returns true.
	 *
	 * @param unknown $pattern
	 * @param unknown $source
	 * @param unknown $script
	 * @return bool
	 */
	function _custom_location_does_not_exist( $pattern, &$source, $script ) {
		$count = 0;
		$source = preg_replace( $pattern, $script, $source, 1, $count );
		return $count==0;
	}

	/**
	 * Removes style tags from the source
	 *
	 * @param string  $content
	 * @param array   $files
	 * @return void
	 */
	function remove_styles( &$content, $files ) {
		$regexps = array();
		$home_url_regexp = Util_Environment::home_url_regexp();

		$path = '';
		if ( Util_Environment::is_wpmu() && !Util_Environment::is_wpmu_subdomain() )
			$path = ltrim( Util_Environment::home_url_uri(), '/' );

		foreach ( $files as $file ) {
			if ( $path && strpos( $file, $path ) === 0 )
				$file = substr( $file, strlen( $path ) );

			$this->replaced_styles[] = $file;

			if ( Util_Environment::is_url( $file ) && !preg_match( '~' . $home_url_regexp . '~i', $file ) ) {
				// external CSS files
				$regexps[] = Util_Environment::preg_quote( $file );
			} else {
				// local CSS files
				$file = ltrim( $file, '/' );
				if ( home_url() == site_url() && ltrim( Util_Environment::site_url_uri(), '/' ) && strpos( $file, ltrim( Util_Environment::site_url_uri(), '/' ) ) === 0 )
					$file = str_replace( ltrim( Util_Environment::site_url_uri(), '/' ), '', $file );
				$file = ltrim( preg_replace( '~' . $home_url_regexp . '~i', '', $file ), '/\\' );
				$regexps[] = '(' . $home_url_regexp . ')?/?' . Util_Environment::preg_quote( $file );
			}
		}

		foreach ( $regexps as $regexp ) {
			$content = preg_replace( '~<link\s+[^<>]*href=["\']?' . $regexp . '["\']?[^<>]*/?>(.*</link>)?~Uis', '', $content );
			$content = preg_replace( '~@import\s+(url\s*)?\(?["\']?\s*' . $regexp . '\s*["\']?\)?[^;]*;?~is', '', $content );
		}

		$content = preg_replace( '~<style[^<>]*>\s*</style>~', '', $content );
	}

	/**
	 * Remove script tags from the source
	 *
	 * @param string  $content
	 * @param array   $files
	 * @return void
	 */
	function remove_scripts( &$content, $files ) {
		$regexps = array();
		$home_url_regexp = Util_Environment::home_url_regexp();

		$path = '';
		if ( Util_Environment::is_wpmu() && !Util_Environment::is_wpmu_subdomain() )
			$path = ltrim( Util_Environment::home_url_uri(), '/' );

		foreach ( $files as $file ) {
			if ( $path && strpos( $file, $path ) === 0 )
				$file = substr( $file, strlen( $path ) );

			$this->replaced_scripts[] = $file;

			if ( Util_Environment::is_url( $file ) && !preg_match( '~' . $home_url_regexp . '~i', $file ) ) {
				// external JS files
				$regexps[] = Util_Environment::preg_quote( $file );
			} else {
				// local JS files
				$file = ltrim( $file, '/' );
				if ( home_url() == site_url() && ltrim( Util_Environment::site_url_uri(), '/' ) && strpos( $file, ltrim( Util_Environment::site_url_uri(), '/' ) ) === 0 )
					$file = str_replace( ltrim( Util_Environment::site_url_uri(), '/' ), '', $file );
				$file = ltrim( preg_replace( '~' . $home_url_regexp . '~i', '', $file ), '/\\' );
				$regexps[] = '(' . $home_url_regexp . ')?/?' . Util_Environment::preg_quote( $file );
			}
		}

		foreach ( $regexps as $regexp ) {
			$content = preg_replace( '~<script\s+[^<>]*src=["\']?' . $regexp . '["\']?[^<>]*>\s*</script>~Uis', '', $content );
		}
	}

	/**
	 * Removes style tag from the source for group
	 *
	 * @param string  $content
	 * @param string  $location
	 * @return void
	 */
	function remove_styles_group( &$content, $location ) {
		$theme = $this->get_theme();
		$template = $this->get_template();

		$files = array();
		$groups = $this->_config->get_array( 'minify.css.groups' );

		if ( isset( $groups[$theme]['default'][$location]['files'] ) ) {
			$files = (array) $groups[$theme]['default'][$location]['files'];
		}

		if ( $template != 'default' && isset( $groups[$theme][$template][$location]['files'] ) ) {
			$files = array_merge( $files, (array) $groups[$theme][$template][$location]['files'] );
		}

		$this->remove_styles( $content, $files );
	}

	/**
	 * Removes script tags from the source for group
	 *
	 * @param string  $content
	 * @param string  $location
	 * @return void
	 */
	function remove_scripts_group( &$content, $location ) {
		$theme = $this->get_theme();
		$template = $this->get_template();
		$files = array();
		$groups = $this->_config->get_array( 'minify.js.groups' );

		if ( isset( $groups[$theme]['default'][$location]['files'] ) ) {
			$files = (array) $groups[$theme]['default'][$location]['files'];
		}

		if ( $template != 'default' && isset( $groups[$theme][$template][$location]['files'] ) ) {
			$files = array_merge( $files, (array) $groups[$theme][$template][$location]['files'] );
		}

		$this->remove_scripts( $content, $files );
	}

	/**
	 * Minifies HTML
	 *
	 * @param string  $html
	 * @return string
	 */
	function minify_html( $html ) {
		$w3_minifier = Dispatcher::component( 'Minify_ContentMinifier' );

		$ignored_comments = $this->_config->get_array( 'minify.html.comments.ignore' );

		if ( count( $ignored_comments ) ) {
			$ignored_comments_preserver = new \Minify_IgnoredCommentPreserver();
			$ignored_comments_preserver->setIgnoredComments( $ignored_comments );

			$html = $ignored_comments_preserver->search( $html );
		}

		if ( $this->_config->get_boolean( 'minify.html.inline.js' ) ) {
			$js_engine = $this->_config->get_string( 'minify.js.engine' );

			if ( !$w3_minifier->exists( $js_engine ) || !$w3_minifier->available( $js_engine ) ) {
				$js_engine = 'js';
			}

			$js_minifier = $w3_minifier->get_minifier( $js_engine );
			$js_options = $w3_minifier->get_options( $js_engine );

			$w3_minifier->init( $js_engine );

			$html = \Minify_Inline_JavaScript::minify( $html, $js_minifier, $js_options );
		}

		if ( $this->_config->get_boolean( 'minify.html.inline.css' ) ) {
			$css_engine = $this->_config->get_string( 'minify.css.engine' );

			if ( !$w3_minifier->exists( $css_engine ) || !$w3_minifier->available( $css_engine ) ) {
				$css_engine = 'css';
			}

			$css_minifier = $w3_minifier->get_minifier( $css_engine );
			$css_options = $w3_minifier->get_options( $css_engine );

			$w3_minifier->init( $css_engine );

			$html = \Minify_Inline_CSS::minify( $html, $css_minifier, $css_options );
		}

		$engine = $this->_config->get_string( 'minify.html.engine' );

		if ( !$w3_minifier->exists( $engine ) || !$w3_minifier->available( $engine ) ) {
			$engine = 'html';
		}

		if ( function_exists( 'is_feed' ) && is_feed() ) {
			$engine .= 'xml';
		}

		$minifier = $w3_minifier->get_minifier( $engine );
		$options = $w3_minifier->get_options( $engine );

		$w3_minifier->init( $engine );

		$html = call_user_func( $minifier, $html, $options );

		if ( isset( $ignored_comments_preserver ) ) {
			$html = $ignored_comments_preserver->replace( $html );
		}

		return $html;
	}

	/**
	 * Returns current theme
	 *
	 * @return string
	 */
	function get_theme() {
		static $theme = null;

		if ( $theme === null ) {
			$theme = Util_Theme::get_theme_key( get_theme_root(), get_template(), get_stylesheet() );
		}

		return $theme;
	}

	/**
	 * Returns current template
	 *
	 * @return string
	 */
	function get_template() {
		static $template = null;

		if ( $template === null ) {
			$template_file = 'index.php';
			switch ( true ) {
			case ( is_404() && ( $template_file = get_404_template() ) ):
			case ( is_search() && ( $template_file = get_search_template() ) ):
			case ( is_tax() && ( $template_file = get_taxonomy_template() ) ):
			case ( is_front_page() && function_exists( 'get_front_page_template' ) && $template_file = get_front_page_template() ):
			case ( is_home() && ( $template_file = get_home_template() ) ):
			case ( is_attachment() && ( $template_file = get_attachment_template() ) ):
			case ( is_single() && ( $template_file = get_single_template() ) ):
			case ( is_page() && ( $template_file = get_page_template() ) ):
			case ( is_category() && ( $template_file = get_category_template() ) ):
			case ( is_tag() && ( $template_file = get_tag_template() ) ):
			case ( is_author() && ( $template_file = get_author_template() ) ):
			case ( is_date() && ( $template_file = get_date_template() ) ):
			case ( is_archive() && ( $template_file = get_archive_template() ) ):
			case ( is_comments_popup() && ( $template_file = get_comments_popup_template() ) ):
			case ( is_paged() && ( $template_file = get_paged_template() ) ):
				break;

			default:
				if ( function_exists( 'get_index_template' ) ) {
					$template_file = get_index_template();
				} else {
					$template_file = 'index.php';
				}
				break;
			}

			$template = basename( $template_file, '.php' );
		}

		return $template;
	}

	/**
	 * Returns style tag
	 *
	 * @param string  $url
	 * @param boolean $import
	 * @param boolean $use_style
	 * @return string
	 */
	function get_style( $url, $import = false, $use_style = true ) {
		if ( $import && $use_style ) {
			return "<style type=\"text/css\" media=\"all\">@import url(\"" . $url . "\");</style>\r\n";
		} elseif ( $import && !$use_style ) {
			return "@import url(\"" . $url . "\");\r\n";
		}else {
			return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" . str_replace( '&', '&amp;', $url ) . "\" media=\"all\" />\r\n";
		}
	}

	/**
	 * Returns style tag for style group
	 *
	 * @param string  $location
	 * @return array
	 */
	function get_style_group( $location ) {
		$style = false;
		$type = 'css';
		$groups = $this->_config->get_array( 'minify.css.groups' );
		$theme = $this->get_theme();
		$template = $this->get_template();

		if ( $template != 'default' && empty( $groups[$theme][$template][$location]['files'] ) ) {
			$template = 'default';
		}

		if ( !empty( $groups[$theme][$template][$location]['files'] ) ) {
			$url = $this->format_url_group( $theme, $template, $location, $type );

			if ( $url ) {
				$import = ( isset( $groups[$theme][$template][$location]['import'] ) ? (boolean) $groups[$theme][$template][$location]['import'] : false );

				$style = $this->get_style( $url, $import );
			}
		}

		return $style;
	}

	/**
	 * Returns script tag for script group
	 *
	 * @param string  $location
	 * @param string  $embed_type
	 * @return array
	 */
	function get_script_group( $location, $embed_type = 'blocking' ) {
		$script = false;
		$fileType = 'js';
		$theme = $this->get_theme();
		$template = $this->get_template();
		$groups = $this->_config->get_array( 'minify.js.groups' );

		if ( $template != 'default' && empty( $groups[$theme][$template][$location]['files'] ) ) {
			$template = 'default';
		}

		if ( !empty( $groups[$theme][$template][$location]['files'] ) ) {
			$url = $this->format_url_group( $theme, $template, $location, $fileType );

			if ( $url ) {
				$script = $this->minify_helpers->generate_script_tag( $url, $embed_type );
			}
		}

		return $script;
	}

	/**
	 * Returns style tag for custom files
	 *
	 * @return string
	 */
	function get_style_custom( $files, $embed_to_html = false ) {
		if ( count( $files ) ) {
			if ( $embed_to_html ) {
				return $this->minify_helpers->get_minified_content_for_files(
					$files, 'css' );
			} else {
				$url = $this->minify_helpers->get_minify_url_for_files( $files,
					'css' );
				if ( !is_null( $url ) ) {
					return $this->get_style( $url, false, false );
				}
			}
		}

		return '';
	}

	/**
	 * Formats URL
	 *
	 * @param string  $theme
	 * @param string  $template
	 * @param string  $location
	 * @param string  $type
	 * @return string
	 */
	function format_url_group( $theme, $template, $location, $type ) {
		$w3_minify = Dispatcher::component( 'Minify_MinifiedFileRequestHandler' );

		$url = false;
		$id = $w3_minify->get_id_group( $theme, $template, $location, $type );

		if ( $id ) {
			$minify_filename = $theme . '.' . $template . '.' . $location .
				'.'. $id . '.' . $type;
			$url = Minify_Core::minified_url( $minify_filename );
		}

		return $url;
	}

	/**
	 * Returns array of minify URLs
	 *
	 * @return array
	 */
	function get_urls() {
		$files = array();

		$js_groups = $this->_config->get_array( 'minify.js.groups' );
		$css_groups = $this->_config->get_array( 'minify.css.groups' );

		foreach ( $js_groups as $js_theme => $js_templates ) {
			foreach ( $js_templates as $js_template => $js_locations ) {
				foreach ( (array) $js_locations as $js_location => $js_config ) {
					if ( !empty( $js_config['files'] ) ) {
						$files[] = $this->format_url_group( $js_theme, $js_template, $js_location, 'js' );
					}
				}
			}
		}

		foreach ( $css_groups as $css_theme => $css_templates ) {
			foreach ( $css_templates as $css_template => $css_locations ) {
				foreach ( (array) $css_locations as $css_location => $css_config ) {
					if ( !empty( $css_config['files'] ) ) {
						$files[] = $this->format_url_group( $css_theme, $css_template, $css_location, 'css' );
					}
				}
			}
		}

		return $files;
	}

	/**
	 * Check if we can do minify logic
	 *
	 * @return boolean
	 */
	function can_minify() {
		/**
		 * Skip if doint AJAX
		 */
		if ( defined( 'DOING_AJAX' ) ) {
			$this->minify_reject_reason = 'Doing AJAX';

			return false;
		}

		/**
		 * Skip if doing cron
		 */
		if ( defined( 'DOING_CRON' ) ) {
			$this->minify_reject_reason = 'Doing cron';

			return false;
		}

		/**
		 * Skip if APP request
		 */
		if ( defined( 'APP_REQUEST' ) ) {
			$this->minify_reject_reason = 'Application request';

			return false;
		}

		/**
		 * Skip if XMLRPC request
		 */
		if ( defined( 'XMLRPC_REQUEST' ) ) {
			$this->minify_reject_reason = 'XMLRPC request';

			return false;
		}

		/**
		 * Skip if Admin
		 */
		if ( defined( 'WP_ADMIN' ) ) {
			$this->minify_reject_reason = 'wp-admin';

			return false;
		}

		/**
		 * Check for WPMU's and WP's 3.0 short init
		 */
		if ( defined( 'SHORTINIT' ) && SHORTINIT ) {
			$this->minify_reject_reason = 'Short init';

			return false;
		}

		/**
		 * Check User agent
		 */
		if ( !$this->check_ua() ) {
			$this->minify_reject_reason = 'User agent is rejected';

			return false;
		}

		/**
		 * Check request URI
		 */
		if ( !$this->check_request_uri() ) {
			$this->minify_reject_reason = 'Request URI is rejected';

			return false;
		}

		/**
		 * Skip if user is logged in
		 */
		if ( $this->_config->get_boolean( 'minify.reject.logged' ) && !$this->check_logged_in() ) {
			$this->minify_reject_reason = 'User is logged in';

			return false;
		}

		return true;
	}

	/**
	 * Returns true if we can minify
	 *
	 * @param string  $buffer
	 * @return string
	 */
	function can_minify2( $buffer ) {
		/**
		 * Check for database error
		 */
		if ( Util_Content::is_database_error( $buffer ) ) {
			$this->minify_reject_reason = 'Database Error occurred';

			return false;
		}

		/**
		 * Check for DONOTMINIFY constant
		 */
		if ( defined( 'DONOTMINIFY' ) && DONOTMINIFY ) {
			$this->minify_reject_reason = 'DONOTMINIFY constant is defined';

			return false;
		}

		/**
		 * Check feed minify
		 */
		if ( $this->_config->get_boolean( 'minify.html.reject.feed' ) && function_exists( 'is_feed' ) && is_feed() ) {
			$this->minify_reject_reason = 'Feed is rejected';

			return false;
		}

		return true;
	}

	/**
	 * Checks User Agent
	 *
	 * @return boolean
	 */
	function check_ua() {
		$uas = array_merge( $this->_config->get_array( 'minify.reject.ua' ), array(
				W3TC_POWERED_BY
			) );

		foreach ( $uas as $ua ) {
			if ( !empty( $ua ) ) {
				if ( isset( $_SERVER['HTTP_USER_AGENT'] ) && stristr( $_SERVER['HTTP_USER_AGENT'], $ua ) !== false ) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Check if user is logged in
	 *
	 * @return boolean
	 */
	function check_logged_in() {
		foreach ( array_keys( $_COOKIE ) as $cookie_name ) {
			if ( strpos( $cookie_name, 'wordpress_logged_in' ) === 0 )
				return false;
		}

		return true;
	}

	/**
	 * Checks request URI
	 *
	 * @return boolean
	 */
	function check_request_uri() {
		$auto_reject_uri = array(
			'wp-login',
			'wp-register'
		);

		foreach ( $auto_reject_uri as $uri ) {
			if ( strstr( $_SERVER['REQUEST_URI'], $uri ) !== false ) {
				return false;
			}
		}

		$reject_uri = $this->_config->get_array( 'minify.reject.uri' );
		$reject_uri = array_map( array( '\W3TC\Util_Environment', 'parse_path' ), $reject_uri );

		foreach ( $reject_uri as $expr ) {
			$expr = trim( $expr );
			if ( $expr != '' && preg_match( '~' . $expr . '~i', $_SERVER['REQUEST_URI'] ) ) {
				return false;
			}
		}


		if ( Util_Request::get_string( 'wp_customize' ) )
			return false;

		return true;
	}


	public function w3tc_usage_statistics_of_request( $storage ) {
		$o = Dispatcher::component( 'Minify_MinifiedFileRequestHandler' );
		$o->w3tc_usage_statistics_of_request( $storage );
	}

	public function w3tc_usage_statistics_metrics( $metrics ) {
		return array_merge( $metrics, array(
				'minify_requests_total',
				'minify_original_length_css', 'minify_output_length_css',
				'minify_original_length_js', 'minify_output_length_js', ) );
	}
}



class _W3_MinifyHelpers {
	/**
	 * Config
	 */
	private $config;
	private $debug = false;

	/**
	 * Constructor
	 *
	 * @param W3_COnfig $config
	 */
	function __construct( $config ) {
		$this->config = $config;
		$this->debug = $config->get_boolean( 'minify.debug' );
	}

	/**
	 * Formats custom URL
	 *
	 * @param array   $files
	 * @param string  $type
	 * @return array
	 */
	function get_minify_url_for_files( $files, $type ) {
		$minify_filename =
			Minify_Core::urls_for_minification_to_minify_filename(
			$files, $type );
		if ( is_null( $minify_filename ) )
			return null;

		$url = Minify_Core::minified_url( $minify_filename );
		$url = Util_Environment::url_to_maybe_https( $url );

		return $url;
	}

	/**
	 * Returns minified content
	 *
	 * @param array   $files
	 * @param string  $type
	 * @return array
	 */
	function get_minified_content_for_files( $files, $type ) {
		$minify_filename =
			Minify_Core::urls_for_minification_to_minify_filename(
			$files, $type );
		if ( is_null( $minify_filename ) )
			return null;
		$minify = Dispatcher::component( 'Minify_MinifiedFileRequestHandler' );

		$m = $minify->process( $minify_filename, true );
		if ( isset( $m['content']['content'] ) )
			$style = $m['content']['content'];
		else
			$style = '';

		return "<style type=\"text/css\" media=\"all\">$style</style>\r\n";
	}

	/**
	 * Prints script tag
	 *
	 * @param string  $url
	 * @param string  $embed_type
	 * @return string
	 */
	function generate_script_tag( $url, $embed_type = 'blocking' ) {
		static $non_blocking_function = false;

		if ( $embed_type == 'blocking' ) {
			$script = '<script type="text/javascript" src="' .
				str_replace( '&', '&amp;', $url ) . '"></script>';
		} else {
			$script = '';

			if ( $embed_type == 'nb-js' ) {
				if ( !$non_blocking_function ) {
					$non_blocking_function = true;
					$script = "<script type=\"text/javascript\">function w3tc_load_js(u){var d=document,p=d.getElementsByTagName('HEAD')[0],c=d.createElement('script');c.type='text/javascript';c.src=u;p.appendChild(c);}</script>";
				}

				$script .= "<script type=\"text/javascript\">w3tc_load_js('" .
					$url . "');</script>";

			} else if ( $embed_type == 'nb-async' ) {
					$script = '<script async type="text/javascript" src="' .
						str_replace( '&', '&amp;', $url ) . '"></script>';
				} else if ( $embed_type == 'nb-defer' ) {
					$script = '<script defer type="text/javascript" src="' .
						str_replace( '&', '&amp;', $url ) . '"></script>';
				} else if ( $embed_type == 'extsrc' ) {
					$script = '<script type="text/javascript" extsrc="' .
						str_replace( '&', '&amp;', $url ) . '"></script>';
				} else if ( $embed_type == 'asyncsrc' ) {
					$script = '<script type="text/javascript" asyncsrc="' .
						str_replace( '&', '&amp;', $url ) . '"></script>';
				}
		}

		return $script . "\r\n";
	}

	/**
	 * URL file filter
	 *
	 * @param string  $file
	 * @return bool
	 */
	public function is_file_for_minification( $file ) {
		static $external;
		if ( !isset( $external ) )
			$external = $this->config->get_array( 'minify.cache.files' );

		foreach ( $external as $ext ) {
			if ( preg_match( '#'.Util_Environment::get_url_regexp( $ext ).'#', $file ) ) {
				if ( $this->debug ) {
					Minify_Core::log(
						'is_file_for_minification: whilelisted ' . $file );
				}

				return true;
			}
		}


		$file_normalized = Util_Environment::remove_query_all( $file );
		$ext = strrchr( $file_normalized, '.' );

		if ( $ext != '.js' && $ext != '.css' ) {
			if ( $this->debug ) {
				Minify_Core::log(
					'is_file_for_minification: unknown extension ' . $ext .
					' for ' . $file );
			}

			return false;
		}

		if ( Util_Environment::is_url( $file_normalized ) ) {
			if ( $this->debug ) {
				Minify_Core::log(
					'is_file_for_minification: its url ' . $file );
			}

			return false;
		}

		$path = Util_Environment::document_root() . '/' . $file;

		if ( !file_exists( $path ) ) {
			if ( $this->debug ) {
				Minify_Core::log(
					'is_file_for_minification: file doesnt exists ' . $path );
			}

			return false;
		}

		if ( $this->debug ) {
			Minify_Core::log(
				'is_file_for_minification: true for file ' . $file .
				' path ' . $path );
		}

		return true;
	}
}

/**
 * Class _W3_MinifyJsAuto
 */
class _W3_MinifyJsAuto {
	/**
	 * Config
	 */
	private $config;

	/**
	 * Processed buffer
	 *
	 * @var string
	 */
	private $buffer;

	/**
	 * JS files to ignore
	 *
	 * @var array
	 */
	private $ignore_js_files;

	/**
	 * Embed type
	 *
	 * @var string
	 */
	private $embed_type;

	/**
	 * Helper object to use
	 *
	 * @var _W3_MinifyHelpers
	 */
	private $minify_helpers;

	/**
	 * Array of processed scripts
	 *
	 * @var array
	 */
	private $debug_minified_urls = array();

	/**
	 * Current position to embed minified script
	 *
	 * @var integer
	 */
	private $embed_pos;

	/**
	 * Current list of files to minify
	 *
	 * @var array
	 */
	private $files_to_minify;

	/**
	 * Current group type
	 *
	 * @var string
	 */
	private $group_type = 'head';

	/**
	 * Current number of minification group
	 *
	 * @var integer
	 */
	private $minify_group_number = 0;
	private $debug = false;

	/**
	 * Constructor
	 *
	 * @param unknown $config
	 * @param unknown $buffer
	 * @param unknown $minify_helpers
	 */
	function __construct( $config, $buffer, $minify_helpers ) {
		$this->config = $config;
		$this->debug = $config->get_boolean( 'minify.debug' );
		$this->buffer = $buffer;
		$this->minify_helpers = $minify_helpers;

		// ignored files
		$this->ignore_js_files = $this->config->get_array( 'minify.reject.files.js' );
		$this->ignore_js_files = array_map( array( '\W3TC\Util_Environment', 'normalize_file' ), $this->ignore_js_files );

		// define embed type
		$this->embed_type = array(
			'head' => $this->config->get_string( 'minify.js.header.embed_type' ),
			'body' => $this->config->get_string( 'minify.js.body.embed_type' )
		);
	}

	/**
	 * Does auto-minification
	 *
	 * @return string buffer of minified content
	 */
	public function execute() {
		// find all script tags
		$buffer_nocomments = preg_replace( '~<!--.*?-->\s*~s', '', $this->buffer );
		$matches = null;

		// end of <head> means another group of scripts, cannt be combined
		if ( !preg_match_all( '~(<script\s*[^>]*>.*?</script>|</head>)~is',
				$buffer_nocomments, $matches ) ) {
			$matches = null;
		}

		if ( is_null( $matches ) ) {
			return $this->buffer;
		}

		$script_tags = $matches[1];
		$script_tags = apply_filters( 'w3tc_minify_js_script_tags',
			$script_tags );

		// pass scripts
		$this->embed_pos = null;
		$this->files_to_minify = array();

		for ( $n = 0; $n < count( $script_tags ); $n++ ) {
			$this->process_script_tag( $script_tags[$n], $n );
		}

		$this->flush_collected( '' );

		return $this->buffer;
	}

	/**
	 * Returns list of minified scripts
	 *
	 * @return array
	 */
	public function get_debug_minified_urls() {
		return $this->debug_minified_urls;
	}

	/**
	 * Processes script tag
	 *
	 * @param unknown $script_tag
	 * @return void
	 */
	private function process_script_tag( $script_tag, $script_tag_number ) {
		if ( $this->debug ) {
			Minify_Core::log( 'processing tag ' . substr( $script_tag, 0, 150 ) );
		}

		$tag_pos = strpos( $this->buffer, $script_tag );
		if ( $tag_pos === false ) {
			// script is external but not found, skip processing it
			error_log( 'script not found:' . $script_tag );
			Minify_Core::log( 'script not found:' . $script_tag );
			return;
		}

		$match = null;
		if ( !preg_match( '~<script\s+[^<>]*src=["\']?([^"\'> ]+)["\'> ]~is',
				$script_tag, $match ) ) {
			$match = null;
		}
		if ( is_null( $match ) ) {
			$data = array(
				'script_tag_original' => $script_tag,
				'script_tag_new' => $script_tag,
				'script_tag_number' => $script_tag_number,
				'script_tag_pos' => $tag_pos,
				'should_replace' => false,
				'buffer' => $this->buffer
			);

			$data = apply_filters( 'w3tc_minify_js_do_local_script_minification',
				$data );
			$this->buffer = $data['buffer'];

			if ( $data['should_replace'] ) {
				$this->buffer = substr_replace( $this->buffer,
					$data['script_tag_new'], $tag_pos,
					strlen( $script_tag ) );
			}

			// it's not external script, have to flush what we have before it
			if ( $this->debug ) {
				Minify_Core::log( 'its not src=, flushing' );
			}

			$this->flush_collected( $script_tag );

			if ( preg_match( '~</head>~is', $script_tag, $match ) )
				$this->group_type = 'body';

			return;
		}

		$script_src = $match[1];
		$script_src = Util_Environment::url_relative_to_full( $script_src );
		$file = Util_Environment::url_to_docroot_filename( $script_src );

		$step1 = $this->minify_helpers->is_file_for_minification( $file );
		$step2 = !in_array( $file, $this->ignore_js_files );

		$do_tag_minification = $step1 && $step2;
		$do_tag_minification = apply_filters( 'w3tc_minify_js_do_tag_minification',
			$do_tag_minification, $script_tag, $file );

		if ( !$do_tag_minification ) {
			if ( $this->debug ) {
				Minify_Core::log( 'file ' . $file .
					' didnt pass minification check:' .
					' file_for_min: ' . ( $step1 ? 'true' : 'false' ) .
					' ignore_js_files: ' . ( $step2 ? 'true' : 'false' ) );
			}

			$data = array(
				'script_tag_original' => $script_tag,
				'script_tag_new' => $script_tag,
				'script_tag_number' => $script_tag_number,
				'script_tag_pos' => $tag_pos,
				'script_src' => $script_src,
				'should_replace' => false,
				'buffer' => $this->buffer
			);

			$data = apply_filters( 'w3tc_minify_js_do_excluded_tag_script_minification',
				$data );
			$this->buffer = $data['buffer'];

			if ( $data['should_replace'] ) {
				$this->buffer = substr_replace( $this->buffer,
					$data['script_tag_new'], $tag_pos,
					strlen( $script_tag ) );
			}

			$this->flush_collected( $script_tag );
			return;
		}

		$this->debug_minified_urls[] = $file;
		$this->buffer = substr_replace( $this->buffer, '',
			$tag_pos, strlen( $script_tag ) );

		// for head group - put minified file at the place of first script
		// for body - put at the place of last script, to make as more DOM
		// objects available as possible
		if ( count( $this->files_to_minify ) <= 0 || $this->group_type == 'body' )
			$this->embed_pos = $tag_pos;
		$this->files_to_minify[] = $file;
	}

	/**
	 * Minifies collected scripts
	 */
	private function flush_collected( $last_script_tag ) {
		if ( count( $this->files_to_minify ) <= 0 )
			return;
		$do_flush_collected = apply_filters( 'w3tc_minify_js_do_flush_collected',
			true, $last_script_tag, $this );
		if ( !$do_flush_collected )
			return;

		// find embed position
		$embed_pos = $this->embed_pos;

		if ( $this->minify_group_number <= 0 ) {
			// try forced embed position
			$forced_embed_pos = strpos( $this->buffer,
				'<!-- W3TC-include-js-head -->' );

			if ( $forced_embed_pos !== false ) {
				$this->buffer = str_replace( '<!-- W3TC-include-js-head -->', '',
					$this->buffer );
				$embed_pos = $forced_embed_pos;
			}
		}

		// build minified script tag
		$data = array(
			'files_to_minify' => $this->files_to_minify,
			'embed_pos' => $embed_pos,
			'embed_type' => $this->embed_type[$this->group_type],
			'buffer' => $this->buffer
		);

		$data = apply_filters( 'w3tc_minify_js_step', $data );
		$this->buffer = $data['buffer'];

		if ( !empty( $data['files_to_minify'] ) ) {
			$url = $this->minify_helpers->get_minify_url_for_files(
				$data['files_to_minify'], 'js' );

			$script = '';
			if ( !is_null( $url ) ) {
				$script .= $this->minify_helpers->generate_script_tag( $url,
					$data['embed_type'] );
			}

			$data['script_to_embed_url'] = $url;
			$data['script_to_embed_body'] = $script;
			$data = apply_filters( 'w3tc_minify_js_step_script_to_embed',
				$data );
			$this->buffer = $data['buffer'];

			// replace
			$this->buffer = substr_replace( $this->buffer,
				$data['script_to_embed_body'], $data['embed_pos'], 0 );
		}

		$this->files_to_minify = array();
		$this->minify_group_number++;
	}
}
