<?php

/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package avtoplakat
 */

?>

<?php while (have_posts()) : the_post(); ?>

  <section>
    <div class="container">

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="editor">
            <?php the_content(); ?>
          </div>
        </div>
      </div>


      <?php if (is_single()) : ?>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <?php the_post_navigation(array(
              'show_all'     => false,
              'end_size'     => 1,
              'mid_size'     => 1,
              'prev_text'    => __('<span>%title</span>'),
              'next_text'    => __('<span>%title</span>'),
              'screen_reader_text' => __(' ')
            )); ?>
          </div>
        </div>
      <?php endif; ?>

    </div>
  </section>

<?php endwhile; ?>