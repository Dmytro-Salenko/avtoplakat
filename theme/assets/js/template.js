/**
 *
 * Template Scripts
 *
 * Version: 1.0.0
 * Author: webdeveloper.com.ua
 * Author URI: https://t.me/webdeveloper_com_ua
 *
 */

/* ---------------------------------------------------------------------------------
 *  
 *  Functions
 * 
------------------------------------------------------------------------------------ */
const arrFromHTMLCollection = (HTMLCollection) => {
  return [].map.call(HTMLCollection, (elem) => elem);
};

/* ---------------------------------------------------------------------------------
 *  
 *  100vh / min-height: calc(var(--vh, 1vh) * 100 - 100px);
 * 
------------------------------------------------------------------------------------ */
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

/* ---------------------------------------------------------------------------------
 *  
 *  Onscroll Body Class
 * 
------------------------------------------------------------------------------------ */
let sticky = document.querySelector(".body").offsetTop;

function toggleFixedHeader() {
  let siteHeader = document.querySelector(".body");
  if (window.scrollY > sticky) {
    siteHeader.classList.add("onscroll");
  } else {
    siteHeader.classList.remove("onscroll");
  }
}

window.addEventListener("scroll", toggleFixedHeader);
