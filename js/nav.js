// js/nav.js
// ES module — active-link via Intersection Observer + hamburger toggle
// Matches section IDs: hero, projects, about, timeline, contact

const NAV_HEIGHT = 64; // matches --nav-height token (64px)

const navLinks = document.querySelectorAll('nav a[href^="#"]');
const hamburger = document.querySelector('.nav__hamburger');
const nav = document.querySelector('nav');

// --- Intersection Observer: active nav link ---
// rootMargin: subtract nav height from top so section fires below nav;
// -66% bottom means section must be in the top 34% of visible area to count as active.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => link.classList.remove('nav-link--active'));
      const activeLink = document.querySelector(`nav a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('nav-link--active');
    });
  },
  {
    rootMargin: `-${NAV_HEIGHT}px 0px -66% 0px`,
    threshold: 0,
  }
);

document.querySelectorAll('main section[id]').forEach((section) => {
  sectionObserver.observe(section);
});

// --- Hamburger toggle ---
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
    const isOpen = nav.classList.contains('nav--open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

// --- Close mobile menu when a nav link is clicked ---
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  });
});
