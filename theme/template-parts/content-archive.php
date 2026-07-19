<?php

/**
 * Template part for displaying archive content
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package avtoplakat
 */

?>

<section>
  <div class="container">

    <div class="row">
      <?php while (have_posts()) : the_post(); ?>

        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <div class="anounce-<?php echo get_post_type() ?>">
            <?php get_template_part('template-parts/content-anounce', get_post_type()); ?>
          </div>
        </div>

      <?php endwhile; ?>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <?php the_posts_pagination(array(
          'show_all'     => false,
          'end_size'     => 1,
          'mid_size'     => 1,
          'prev_text'    => __(''),
          'next_text'    => __(''),
          'screen_reader_text' => __(' ')
        )); ?>
      </div>
    </div>

  </div>
</section>