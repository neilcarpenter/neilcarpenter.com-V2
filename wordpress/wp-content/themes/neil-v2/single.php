<?
/**
 * The Template for displaying all single posts
 *
 * @package     WordPress
 * @subpackage  Resonate 2015
 */
?>
<? get_template_part( 'parts/shared/html-header' ); ?>
    
    <? get_template_part( 'parts/shared/header' ); ?>

        <?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>

        <?
        $types                = get_field('resonate_type', get_the_ID());
        $resonate_type_string = gettype($types) == "array" ? implode(" ", $types) : $types;
        ?>

        <div class="page page-artist" data-template="page-artist" data-artist-name="<?= $post->post_name; ?>" data-resonate-type="<?= $resonate_type_string ?>">
            <div class="header-image" data-carousel-el data-page-transition>
                <div class="header-container">
                    <?
                    if( have_rows('person_images') ):
                        $html = '';
                        while ( have_rows('person_images') ) : the_row();
                            $src = wp_get_attachment_image_src( get_sub_field('image'), 'large' );
                            $html .= "<div data-carousel-el><span class=\"carousel-image\" style=\"background-image:url('$src[0]');\"></span></div>";
                        endwhile;
                        echo $html;
                    endif;
                    ?>
                </div>
                <div class="artist-name-container" data-page-transition>
                    <div class="artist-tag"><span class="tag-long red"></span></div>
                    <h2><?= get_the_title( get_the_ID() ); ?></h2>
                    <?
                        $cats = _get_categories(get_the_ID(), true);
                    ?>
                    <h4><?= $cats['catsStr'] ?></h4>
                </div>

                <div class="navigation">
                    <div class="nav-left"><img src="<? bloginfo('template_directory');?>/static/img/arrow.svg"></div>
                    <div class="nav-right"><img src="<? bloginfo('template_directory');?>/static/img/arrow.svg"></div>
                    <div class="nav-down"><img src="<? bloginfo('template_directory');?>/static/img/arrow.svg"></div>
                </div>
            </div>
            <div class="hr-container"><hr class="event-type" data-type="<?= $resonate_type_string ?>"/></div>

            <div class="body-content" data-artist-body data-page-transition>
                <? the_field('person_bio'); ?>
                <?
                if( have_rows('person_links') ):
                    $links = '';
                    while ( have_rows('person_links') ) : the_row();
                        $url = get_sub_field('url');
                        $text = get_sub_field('text') != '' ? get_sub_field('text') : $url;
                        $links .= "<a href=\"$url\" target=\"_blank\">$text</a>";
                    endwhile;
                    echo $links;
                endif;
                ?>

            </div>

            <nav class="artist-nav-wrapper cf">
                <div class="artist-nav artist-nav-prev">
                    <?
                    $prev_post = get_previous_post();
                    if (!empty( $prev_post )): ?>
                      <a class="artist-nav-link artist-nav-link-prev" data-artist-nav="prev" href="<?= home_url().'/artists/'.$prev_post->post_name ?>"><span class="artist-nav-arrow-prev"><img src="<? bloginfo('template_directory');?>/static/img/arrow-black.svg"></span>Prev</a>
                    <? endif; ?>
                </div>

                <div class="artist-nav artist-nav-next">
                    <?
                    $next_post = get_next_post();
                    if (!empty( $next_post )): ?>
                      <a class="artist-nav-link artist-nav-link-next" data-artist-nav="next" href="<?= home_url().'/artists/'.$next_post->post_name ?>">Next<span class="artist-nav-arrow-next"><img src="<? bloginfo('template_directory');?>/static/img/arrow-black.svg"></span></a>
                    <? endif; ?>
                </div>
            </nav>
            
        </div>

        <?php endwhile; ?>

    <? get_template_part( 'parts/shared/footer' ); ?>
    
<? get_template_part( 'parts/shared/html-footer' ); ?>
