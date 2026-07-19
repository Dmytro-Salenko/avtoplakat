<?php

/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package avtoplakat
 */

get_header(); ?>

<main id="primary" class="site-main">

	<?php
	// Template Part: Page Header
	get_template_part('template-parts/content-header'); ?>

	<?php
	// Template Part: Page Content
	get_template_part('template-parts/content-page'); ?>

	<?php // Section: 
	get_template_part('template-sections/section-'); ?>

</main>

<?php get_footer(); ?>