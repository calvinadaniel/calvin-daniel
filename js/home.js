document.addEventListener('DOMContentLoaded', function () {

  /* ── Hero headline slide-up ────────────────────────────── */
  setTimeout(function () {
    var h = document.querySelector('.hero-headline');
    if (h) h.classList.add('animated');
  }, 180);

  /* ── Typewriter eyebrow ────────────────────────────────── */
  var eyebrowEl = document.getElementById('eyebrow-text');
  var cursorEl  = document.getElementById('eyebrow-cursor');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (eyebrowEl && reduceMotion && cursorEl) cursorEl.style.display = 'none';
  if (eyebrowEl && !reduceMotion) {
    var TEXT = eyebrowEl.textContent;
    eyebrowEl.textContent = '';
    var i = 0;
    setTimeout(function () {
      var iv = setInterval(function () {
        if (i < TEXT.length) {
          eyebrowEl.textContent = TEXT.slice(0, ++i);
        } else {
          clearInterval(iv);
          setTimeout(function () { if (cursorEl) cursorEl.style.display = 'none'; }, 1400);
        }
      }, 46);
    }, 200);
  }

  /* ── Count-up ──────────────────────────────────────────── */
  function animateCount(el) {
    if (el._counted) return;
    el._counted = true;
    var target   = parseInt(el.dataset.target, 10);
    var duration = parseInt(el.dataset.duration, 10) || 1200;
    var pad      = parseInt(el.dataset.pad, 10) || 0;
    var start    = performance.now();
    function tick(now) {
      var p   = Math.min((now - start) / duration, 1);
      var val = Math.round((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = pad ? String(val).padStart(pad, '0') : val;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObs.unobserve(entry.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px 15% 0px' });

  document.querySelectorAll('[data-countup]').forEach(function (el) {
    // Hero stat counters sit just below the fold on short viewports, so the
    // observer never fires on load and they appear stuck at 0. Fire immediately
    // for anything at or near the initial viewport; observe the rest.
    if (el.getBoundingClientRect().top < window.innerHeight * 1.25) {
      animateCount(el);
    } else {
      countObs.observe(el);
    }
  });

  /* ── Contact form (Formspree, no page reload) ──────────── */
  var cForm = document.getElementById('contact-form');
  if (cForm) {
    var cMsg    = document.getElementById('cf-message');
    var cCount  = document.getElementById('cf-count');
    var cStatus = document.getElementById('cf-status');
    var cSubmit = document.getElementById('cf-submit');

    if (cMsg && cCount) {
      var syncCount = function () { cCount.textContent = cMsg.value.length; };
      cMsg.addEventListener('input', syncCount);
      syncCount();
    }

    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      cStatus.textContent = '';
      cStatus.className = 'contact-form__status';

      if (!cForm.checkValidity()) {
        cForm.reportValidity();
        return;
      }

      cSubmit.disabled = true;
      cSubmit.textContent = 'Sending…';

      fetch(cForm.action, {
        method: 'POST',
        body: new FormData(cForm),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          cForm.reset();
          if (cCount) cCount.textContent = '0';
          cStatus.textContent = "Thanks — your message is on its way. I'll be in touch soon.";
          cStatus.className = 'contact-form__status contact-form__status--ok';
        } else {
          return res.json().then(function (data) {
            var msg = (data && data.errors)
              ? data.errors.map(function (x) { return x.message; }).join(', ')
              : 'Something went wrong. Please email me directly.';
            throw new Error(msg);
          });
        }
      }).catch(function (err) {
        cStatus.textContent = err.message || 'Network error — please try again or email me directly.';
        cStatus.className = 'contact-form__status contact-form__status--error';
      }).finally(function () {
        cSubmit.disabled = false;
        cSubmit.textContent = 'Send Message';
      });
    });
  }
});
