<?php

/**
 * Template part for displaying page header
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package avtoplakat
 */

?>

<section class="page-header">
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

        <h1 class="page-title"><?php avtoplakat_page_title(); ?></h1>
        
        <div class="page-breadcrumbs">
          <?php if (function_exists('rank_math_the_breadcrumbs')) rank_math_the_breadcrumbs(); ?>
        </div>

      </div>
    </div>
  </div>
</section>