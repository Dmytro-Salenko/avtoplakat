<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package avtoplakat
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class('body'); ?>>
	<?php wp_body_open(); ?>
	<div id="page" class="site">

		<header id="site-header" class="mastbar">

			<!------------------------------------------------------------------------->

			<div class="headbar">
				<div class="container">
					<div class="row">
						<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

							<?php if (!empty($site_branding = get_field('site_branding', 'options'))) : ?>
								<a href="<?php echo esc_url(home_url('/')); ?>" class="site-branding" rel="home">
									<img src="<?php echo $site_branding['site_logo']; ?>" alt="" class="site-logo">
								</a>
							<?php endif; ?>

							<nav id="headbar-navigation" class="headbar-navigation">
								<?php wp_nav_menu(array('container' => '', 'menu_class' => 'menu', 'theme_location' => 'menu-1', 'menu_id' => 'headbar-menu')); ?>
							</nav>

							<div class="headbar-widgets">
								<div class="buttons">
									<a class="button-cart" data-fancybox data-src="#cart" href="javascript:;">
										<span class="iconify" data-icon="bxs:cart"></span>
										<span class="text">Кошик</span>
										<sup class="total-count"></sup>
									</a>
								</div>

								<div class="menu-toggle">
									<span></span>
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>

			<!------------------------------------------------------------------------->

			<div id="sidebar" class="sidebar">

				<div class="sidebar-head">

				</div>

				<div class="sidebar-body">
					<nav id="sidebar-navigation" class="sidebar-navigation">
						<?php wp_nav_menu(array('container' => '', 'menu_class' => 'menu', 'theme_location' => 'menu-1', 'menu_id' => 'sidebar-menu')); ?>
					</nav>
				</div>

				<div class="sidebar-footer">

				</div>

			</div>

			<!------------------------------------------------------------------------->

		</header>