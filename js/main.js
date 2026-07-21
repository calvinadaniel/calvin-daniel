// Dark mode init — runs before DOMContentLoaded to prevent flash
(function () {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ── Theme toggle ──────────────────────────────────────── */
  var toggle = document.getElementById('theme-toggle');
  var mToggle = document.getElementById('mobile-theme-toggle');
  var mLabel = document.getElementById('mobile-toggle-label');

  function syncToggleLabel() {
    var dark = document.documentElement.classList.contains('dark');
    if (mLabel) mLabel.textContent = dark ? 'Light' : 'Dark';
    if (toggle) toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncToggleLabel();

  function applyTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    syncToggleLabel();
    document.dispatchEvent(new CustomEvent('themechange', { detail: { dark: dark } }));
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(!document.documentElement.classList.contains('dark'));
    });
  }
  if (mToggle) {
    mToggle.addEventListener('click', function () {
      applyTheme(!document.documentElement.classList.contains('dark'));
    });
  }

  /* ── Scroll progress bar ───────────────────────────────── */
  var bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = 'position:fixed;top:0;left:0;width:3px;height:0%;' +
    'background:linear-gradient(to bottom,#F4B41A,rgba(244,180,26,0.35));' +
    'z-index:9999;border-radius:0 0 2px 0;pointer-events:none;transition:height 0.06s linear;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function () {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.height = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });

  /* ── Header scroll shrink ──────────────────────────────── */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Scroll reveals ────────────────────────────────────── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.querySelectorAll('.skill-bar-fill[data-width]').forEach(function (b) {
          b.style.width = b.dataset.width + '%';
        });
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObs.observe(el);
  });

  /* ── Mobile menu ───────────────────────────────────────── */
  var btnOpen    = document.getElementById('menu-open');
  var btnClose   = document.getElementById('menu-close');
  var offCanvas  = document.getElementById('off-canvas-nav');
  var overlay    = document.getElementById('menu-overlay');

  function openMenu() {
    if (!offCanvas) return;
    offCanvas.classList.remove('translate-x-full');
    offCanvas.classList.add('translate-x-0');
    overlay && overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay && overlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
    btnOpen && btnOpen.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!offCanvas) return;
    offCanvas.classList.add('translate-x-full');
    offCanvas.classList.remove('translate-x-0');
    overlay && overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay && overlay.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = '';
    btnOpen && btnOpen.setAttribute('aria-expanded', 'false');
  }

  btnOpen  && btnOpen.addEventListener('click', openMenu);
  btnClose && btnClose.addEventListener('click', closeMenu);
  overlay  && overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  offCanvas && offCanvas.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
});
