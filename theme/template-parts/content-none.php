<?php

/**
 * Template part for displaying a message that posts cannot be found
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package avtoplakat
 */

?>

<section>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

        <?php if (is_search()) : ?>
          <p><?php echo esc_html('Ничего не найдено'); ?></p>
        <?php else : ?>
          <p><?php echo esc_html('Записей нет'); ?></p>
        <?php endif; ?>

      </div>
    </div>
  </div>
</section>