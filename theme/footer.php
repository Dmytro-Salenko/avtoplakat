<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package avtoplakat
 */

?>

<footer id="colophon" class="site-footer">
	<div class="container">
		<div class="row">

			<div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
				<div class="brandcard">

					<div class="brandcard-wrapper">

						<?php if (!empty($site_branding = get_field('site_branding', 'options'))) : ?>
							<a href="<?php echo esc_url(home_url('/')); ?>" class="site-branding" rel="home">
								<img src="<?php echo $site_branding['site_logo']; ?>" alt="" class="site-logo">
							</a>
						<?php endif; ?>

						<div class="contact-media">
							<?php if (function_exists('avtoplakat_socials')) {
								echo avtoplakat_socials();
							} ?>
						</div>
					</div>

					<div class="brandcard-wrapper">
						<div class="contact-list">
							<?php if (function_exists('avtoplakat_address')) {
								echo avtoplakat_address();
							} ?>
						</div>
						<div class="contact-list">
							<?php if (function_exists('avtoplakat_phones')) {
								echo avtoplakat_phones();
							} ?>
							<?php if (function_exists('avtoplakat_emails')) {
								echo avtoplakat_emails();
							} ?>
						</div>

					</div>

				</div>
			</div>

		</div>
	</div>
</footer>

</div><!-- #page -->

<!------------------------------------------------------------------------->
<div class="modal" id="cart">

	<div class="heading">
		<span class="heading-title">Кошик</span>
		<div class="buttons">
			<a class="button-xl clear-cart">Очистити</a>
		</div>
	</div>

	<div class="cart-body">
		<table class="cart">
			<?php /* Cart */ ?>
		</table>
		<div class="cart-result">Загальна вартість: <span class="total-cart"></span> грн.</div>
	</div>

	<div class="cart-foot">
		<form id="cart-form">

			<input id="client-name" type="text" name="name" placeholder="Ваше ім'я">

			<input id="client-email" type="email" name="email" placeholder="Ваш Email">

			<input id="client-phone" type="tel" name="tel" placeholder="Ваш номер телефону">

			<div class="buttons">
				<button id="cart-button" class="button-xl" type="button" name="button"><?php _e("Оформити замовлення"); ?></button>
			</div>

			<div id="cart-error"></div>

		</form>
	</div>
</div>
<!------------------------------------------------------------------------->

<?php wp_footer(); ?>

</body>

</html>