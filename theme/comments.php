<?php

/**
 * The template for displaying comments
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package avtoplakat
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if (post_password_required()) {
	return;
}
?>

<div id="comments" class="comments-area">

	<?php if (have_comments()) : ?>
		<h2 class="comments-title"><?php echo esc_html('Комменатрии'); ?> <sup><?php echo get_comments_number(); ?></sup></h2>
		<ul class="comment-list">
			<?php wp_list_comments(
				array(
					'walker'            => null,
					'max_depth'         => '',
					'style'             => 'li',
					'callback'          => null,
					'end-callback'      => null,
					'type'              => 'all',
					'reply_text'        => 'Ответить',
					'page'              => '',
					'per_page'          => '',
					'avatar_size'       => 40,
					'reverse_top_level' => null,
					'reverse_children'  => '',
					'format'            => 'html5',
					'short_ping'        => true,
					'echo'              => true,
				)
			); ?>
		</ul>

		<?php the_comments_navigation(); ?>

	<?php endif; ?>

	<?php comment_form(); ?>

</div>