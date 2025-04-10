const NAV_VISIBLE = "visible";
const toggleNavBtn = document.querySelector("button.navToggle");
const nav = document.querySelector("nav");
const navOverlay = document.querySelector(".navOverlay");

const closeNav = () => {
  nav.classList.remove(NAV_VISIBLE);
  navOverlay.classList.remove(NAV_VISIBLE);
};

const openNav = () => {
  nav.classList.add(NAV_VISIBLE);
  navOverlay.classList.add(NAV_VISIBLE);
};

const toggleNav = () => {
  if (nav.classList.contains(NAV_VISIBLE)) {
    closeNav();
  } else {
    openNav();
  }
};

toggleNavBtn.addEventListener("click", toggleNav);
navOverlay.addEventListener("click", closeNav);
