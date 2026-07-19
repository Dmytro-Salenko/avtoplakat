<?php

/**
 * avtoplakat functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package avtoplakat
 */

if (!defined('_S_VERSION')) {
	// Replace the version number of the theme on each release.
	define('_S_VERSION', '1.0.0');
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function avtoplakat_setup()
{
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on avtoplakat, use a find and replace
		* to change 'avtoplakat' to the name of your theme in all the template files.
		*/
	load_theme_textdomain('avtoplakat', get_template_directory() . '/languages');

	// Add default posts and comments RSS feed links to head.
	add_theme_support('automatic-feed-links');

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support('title-tag');

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support('post-thumbnails');

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__('Headbar Menu', 'avtoplakat'),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'avtoplakat_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support('customize-selective-refresh-widgets');
}
add_action('after_setup_theme', 'avtoplakat_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function avtoplakat_content_width()
{
	$GLOBALS['content_width'] = apply_filters('avtoplakat_content_width', 640);
}
add_action('after_setup_theme', 'avtoplakat_content_width', 0);

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function avtoplakat_widgets_init()
{
	register_sidebar(
		array(
			'name'          => esc_html__('Sidebar', 'avtoplakat'),
			'id'            => 'sidebar-1',
			'description'   => esc_html__('Add widgets here.', 'avtoplakat'),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<p class="widget-title">',
			'after_title'   => '</p>',
		)
	);
}
add_action('widgets_init', 'avtoplakat_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function avtoplakat_scripts()
{
	// Style
	wp_enqueue_style('avtoplakat-style', get_theme_file_uri('/style.css'), array(), '1.0.0');
	wp_enqueue_style('avtoplakat-normalize', get_theme_file_uri('/assets/css/normalize.css'), array(), '8.0.1');

	// jQuery
	wp_enqueue_script('avtoplakat-jquery', get_theme_file_uri('/assets/js/jquery.min.js'), array(), '3.6.0');

	// Cart
	wp_enqueue_script('avtoplakat-cart', get_theme_file_uri('/assets/js/cart.js'), array(), '1.0.0', true);

	// JavaScript
	wp_enqueue_script('avtoplakat-template', get_theme_file_uri('/assets/js/template.js'), array(), '1.0.0', true);
	wp_enqueue_script('avtoplakat-navigation', get_theme_file_uri('/assets/js/navigation.js'), array(), '1.0.0', true);

	// Swiper
	// wp_enqueue_style('avtoplakat-swiper', get_theme_file_uri('/assets/css/swiper.min.css'), array(), '6.5.0');
	// wp_enqueue_script('avtoplakat-swiper', get_theme_file_uri('/assets/js/swiper.min.js'), array(), '6.5.0');

	// Fancy Box
	wp_enqueue_style('avtoplakat-fancybox', get_theme_file_uri('/assets/css/fancybox.min.css'), array(), '3.5.7');
	wp_enqueue_script('avtoplakat-fancybox', get_theme_file_uri('/assets/js/fancybox.min.js'), array(), '3.5.7');

	// Iconify
	wp_enqueue_script('avtoplakat-iconify', 'https://code.iconify.design/1/1.0.7/iconify.min.js', array(), '1.0.7', true);

	// AOS
	// wp_enqueue_style('avtoplakat-aos', get_theme_file_uri('/assets/css/aos.min.css'), array(), '2.3.1');
	// wp_enqueue_script('avtoplakat-aos', get_theme_file_uri('/assets/js/aos.min.js'), array(), '2.3.1');

	// Google Fonts
	wp_enqueue_style('avtoplakat-sans-serif', 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap', array(), wp_get_theme()->get('Version'));

	// Comments
	if (is_singular() && comments_open() && get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
}
add_action('wp_enqueue_scripts', 'avtoplakat_scripts');

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if (defined('JETPACK__VERSION')) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * ACF Option Page
 */
if (function_exists('acf_add_options_page')) {
	acf_add_options_page(array(
		'page_title'  => 'Основная информация и настройки',
		'menu_title'  => 'Avtoplakat',
		'menu_slug'   => 'theme-general-settings',
		'capability'  => 'edit_posts',
		'redirect'    => false
	));
}

/**
 * Filter Archive Titles.
 */
add_filter('get_the_archive_title', function ($title) {
	return preg_replace('~^[^:]+: ~', '', $title);
});

/**
 * Page Title.
 */
function avtoplakat_page_title()
{
	if (is_page() || is_single()) $page_title = get_the_title();
	elseif (is_search()) $page_title = 'Результаты поиска';
	elseif (is_category() || is_archive() || is_tag()) $page_title = get_the_archive_title();
	echo $page_title;
}

/**
 * Page Thumbnail.
 */
function avtoplakat_page_thumbnail()
{
	if (is_page() || is_single()) $page_thumbnail = get_the_post_thumbnail_url();
	elseif (is_category() || is_archive() || is_tag()) $page_thumbnail = '/wp-content/themes/avtoplakat/media/page-header-bg.jpg';
	echo $page_thumbnail;
}

/**
 * Contact: Emails.
 */
function avtoplakat_emails()
{
	if (!empty($contacts = get_field('contacts', 'options'))) :
		foreach ((array) $contacts['emails'] as $email) : ?>
			<a href="mailto:<?php echo $email['email_address']; ?>" rel="noopener noreferrer"><?php echo $email['email_address']; ?></a>
		<?php endforeach;
	endif;
}

/**
 * Contact: Phone Numbers.
 */
function avtoplakat_phones()
{
	if (!empty($contacts = get_field('contacts', 'options'))) :
		foreach ((array) $contacts['phones'] as $phone) : ?>
			<a href="tel:<?php echo $phone['phone_number']; ?>" rel="noopener noreferrer"><?php echo $phone['phone_number']; ?></a>
		<?php endforeach;
	endif;
}

/**
 * Contact: Social Networks.
 */
function avtoplakat_socials()
{
	if (!empty($contacts = get_field('contacts', 'options'))) :
		foreach ((array) $contacts['socials'] as $social) : ?>
			<a class="social" href="<?php echo $social['social_link']; ?>" target="_blank" rel="noopener noreferrer"><?php echo $social['social_icon']; ?></a>
		<?php endforeach;
	endif;
}

/**
 * Contacts: Adress.
 */
function avtoplakat_address()
{
	if (!empty($contacts = get_field('contacts', 'options'))) : $address = $contacts['address']; ?>
		<div class="contact-address">
			<a href="https://maps.google.com/?q=<?php echo $address['address_link']; ?>" target="_blank"><?php echo $address['address_location']; ?></a>
		</div>
<?php endif;
}
