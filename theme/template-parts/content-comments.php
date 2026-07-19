<?php

/**
 * Template part for displaying comments
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
        <?php if (comments_open() || get_comments_number()) :
          comments_template();
        endif; ?>
      </div>
    </div>
  </div>
</section>