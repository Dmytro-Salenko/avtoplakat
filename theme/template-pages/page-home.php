<?php

/**
 * Template name: Головна
 * 
 * The template for display: page-home.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package avtoplakat
 */

get_header(); ?>

<main id="primary" class="site-main">

  <?php if (!empty($section = get_field('hero'))) : ?>
    <section id="hero" class="boxed">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">

            <?php if (!empty($heading = $section['heading'])) : ?>
              <div class="heading column">
                <p class="heading-title"><?php echo $heading['heading_title']; ?></p>
                <p class="heading-text"><?php echo $heading['heading_text']; ?></p>
              </div>
            <?php endif; ?>

            <div class="buttons">
              <a href="#products" class="button-xl white">Продукція</a>
              <a href="#colophon" class="button-xl white">Контакти</a>
            </div>

          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <img src="/wp-content/themes/avtoplakat/assets/media/hero-image.png" alt="Hero Image" class="hero-image">
          </div>

        </div>
      </div>
    </section>
  <?php endif; ?>

  <section id="products">
    <div class="container">

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div class="heading">
            <p class="heading-title">Продукція</p>
          </div>
        </div>
      </div>

      <div class="row">

        <?php
        $post = get_posts();
        $args = array(
          'numberposts'        => -1,
          'orderby'            => 'date',
          'order'              => 'DESC',
          'post_type'          => 'product',
        );
        $posts = get_posts($args);
        foreach ($posts as $post) : setup_postdata($post); ?>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <?php if ($product = get_field('product')) : ?>

              <div class="product-box">

                <a class="product-thumbnail" href="<?php echo get_the_post_thumbnail_url(); ?>" data-fancybox data-caption="<?php echo get_the_title(); ?>">
                  <img src="<?php echo get_the_post_thumbnail_url(); ?>" alt="<?php echo get_the_title(); ?>">
                </a>

                <p class="product-name"><?php echo get_the_title(); ?></p>

                <div class="product-meta">
                  <div class="product-price">
                    <span>ціна</span>
                    <span><?php echo $product['product_price']; ?> ₴</span>
                  </div>
                  <div class="buttons">
                    <a class="button-fw add-to-cart" href="#" data-name="<?php echo get_the_title(); ?> (<?php echo $product['product_SKU']; ?>)" data-price="<?php echo $product['product_price']; ?>">
                      <span class="iconify" data-icon="bxs:cart-add"></span>
                      <span>Додати у кошик</span>
                    </a>
                  </div>
                </div>


              </div>

            <?php endif; ?>
          </div>

        <?php endforeach;
        wp_reset_postdata(); ?>

      </div>

    </div>
  </section>

</main>

<?php get_footer(); ?>