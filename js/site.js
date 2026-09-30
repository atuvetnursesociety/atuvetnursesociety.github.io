/* ============================================================
   site.js — shared behaviour loaded on every page:
   mobile nav, footer year, identity links from config.js,
   and gentle scroll-reveal animation (skipped entirely for
   visitors who have "reduce motion" turned on).
   ============================================================ */

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.setAttribute('data-open', String(open));
  };

  // Mobile starts closed; desktop CSS always shows the nav regardless of data-open.
  setOpen(false);

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' && window.innerWidth < 760) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}

function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = String(new Date().getFullYear());
}

function injectIdentityLinks() {
  if (!window.SITE_CONFIG) return;
  const config = window.SITE_CONFIG;

  document.querySelectorAll('[data-identity="su-join"]').forEach((el) => {
    el.href = config.suJoinUrl;
  });
  document.querySelectorAll('[data-identity="email"]').forEach((el) => {
    el.href = `mailto:${config.email}`;
    if (el.dataset.identityText !== 'off') el.textContent = config.email;
  });
  document.querySelectorAll('[data-identity="instagram"]').forEach((el) => {
    el.href = config.instagramUrl;
    if (el.dataset.identityText !== 'off') el.textContent = config.instagramHandle;
  });
  document.querySelectorAll('[data-identity="tagline"]').forEach((el) => {
    el.textContent = config.tagline;
  });
  document.querySelectorAll('[data-identity="society-short-name"]').forEach((el) => {
    el.textContent = config.societyShortName;
  });
  document.querySelectorAll('[data-identity="society-name"]').forEach((el) => {
    el.textContent = config.societyName;
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.fade-in-up');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFooterYear();
  injectIdentityLinks();
  initScrollReveal();
});
