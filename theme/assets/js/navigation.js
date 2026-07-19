/**
 *
 * Site Navigation
 *
 * Version: 1.0.0
 * Author: webdeveloper.com.ua
 * Author URI: https://t.me/webdeveloper_com_ua
 *
 */

function mobileMenu(x) {
  x.classList.toggle("change");
  var x = document.getElementById("sidebar");
  if (x.className === "sidebar") {
    x.className += " open";
  } else {
    x.className = "sidebar";
  }
}

document
  .querySelector(".menu-toggle")
  .addEventListener("click", (e) => mobileMenu(e.currentTarget));

// Sub menu support.
const menuItems = [
  ...document.querySelectorAll(
    "#sidebar-menu > .menu-item.menu-item-has-children"
  ),
];
const subMenusItems = [
  ...document.querySelectorAll("#sidebar-menu > .menu-item .sub-menu"),
];

menuItems.forEach((mi, idx) =>
  mi.addEventListener("click", (_) => {
    subMenusItems[idx].classList.toggle("open");
    mi.classList.toggle("active");
  })
);
