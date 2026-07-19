<?php

/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package avtoplakat
 */

get_header(); ?>

<main id="primary" class="site-main">

	<?php
	// Template Part: Page Header
	get_template_part('template-parts/content-header'); ?>

	<?php if (have_posts()) : ?>

		<?php // Template Part: Content Archive
		get_template_part('template-parts/content-archive'); ?>

	<?php else :

		// Template Part: Content None
		get_template_part('template-parts/content-none'); ?>

	<?php endif; ?>

</main>

<?php get_footer(); ?>