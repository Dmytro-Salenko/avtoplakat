<?php

/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
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

	<?php
	// Template Part: Page Comments
	get_template_part('template-parts/content-comments'); ?>

</main>

<?php get_footer(); ?>