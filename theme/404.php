<?php

/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package avtoplakat
 */

get_header(); ?>

<main id="primary" class="site-main">

	<section class="content-404">
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

					<p class="label"><?php echo esc_html('404'); ?></p>
					<p class="message"><?php echo esc_html('Запрошенная страница не существует. Мы уже знаем об этом и работаем над устранением проблемы.'); ?></p>
					<ul class="buttons center">
						<li><a href="<?php echo esc_url(home_url('/')); ?>" class="button-xl" rel="home"><?php echo esc_html('Главная страница'); ?></a></li>
					</ul>

				</div>
			</div>
		</div>
	</section>

</main>

<?php get_footer(); ?>