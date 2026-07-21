document.addEventListener('DOMContentLoaded', function () {

  /* ── Hero headline slide-up ────────────────────────────── */
  setTimeout(function () {
    var h = document.querySelector('.hero-headline');
    if (h) h.classList.add('animated');
  }, 180);

  /* ── Typewriter eyebrow ────────────────────────────────── */
  var eyebrowEl = document.getElementById('eyebrow-text');
  var cursorEl  = document.getElementById('eyebrow-cursor');
  var TEXT      = 'Based in Delaware | Available for freelance work';
  if (eyebrowEl) {
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

  /* ── Pricing tier → prefill contact form ──────────────── */
  if (cForm) {
    var planBudget = { Starter: 'Under $1K', Pro: '$1K–$3K', Custom: "Let's Talk" };
    var cPlan   = document.getElementById('cf-plan');
    var cBudget = document.getElementById('cf-budget');
    document.querySelectorAll('[data-plan]').forEach(function (link) {
      link.addEventListener('click', function () {
        var plan = link.dataset.plan;
        if (cPlan) cPlan.value = plan;
        if (cBudget && planBudget[plan]) cBudget.value = planBudget[plan];
        if (cMsg && !cMsg.value.trim()) {
          cMsg.value = "I'm interested in the " + plan + " plan. ";
          if (cCount) cCount.textContent = cMsg.value.length;
        }
      });
    });
  }

  /* ── Particle canvas ───────────────────────────────────── */
  function initCanvas() {
    var hero   = document.getElementById('hero');
    var canvas = document.getElementById('hero-canvas');
    if (!hero || !canvas) return;

    if (canvas._raf)      { cancelAnimationFrame(canvas._raf); canvas._raf = null; }
    if (canvas._resObs)   { canvas._resObs.disconnect(); }
    if (canvas._visObs)   { canvas._visObs.disconnect(); }

    var ctx    = canvas.getContext('2d');
    var isDark = document.documentElement.classList.contains('dark');
    var COLORS = isDark
      ? ['rgba(255,255,255,0.6)', 'rgba(255,89,16,0.55)', 'rgba(246,196,74,0.5)']
      : ['rgba(0,26,77,0.45)',   'rgba(255,89,16,0.45)', 'rgba(0,63,165,0.35)'];
    var CC     = isDark ? '255,255,255' : '0,26,77';
    var DIST   = 120;
    var COUNT  = 55;
    var pts    = [];
    var raf    = null;

    function rand(a, b) { return Math.random() * (b - a) + a; }

    function resize() {
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function spawn() {
      pts = Array.from({ length: COUNT }, function () {
        return {
          x: rand(0, canvas.width), y: rand(0, canvas.height),
          vx: rand(-0.18, 0.18),   vy: rand(-0.18, 0.18),
          r: rand(1.2, 2.5),
          color: COLORS[Math.floor(rand(0, COLORS.length))],
          alpha: rand(0.4, 0.9)
        };
      });
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = 'rgba(' + CC + ',' + ((1 - d / DIST) * 0.15) + ')';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10)               p.x = canvas.width  + 10;
        if (p.x > canvas.width  + 10) p.x = -10;
        if (p.y < -10)               p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(tick);
      canvas._raf = raf;
    }

    var visObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { if (!raf) tick(); }
      else { cancelAnimationFrame(raf); raf = null; canvas._raf = null; }
    }, { threshold: 0 });
    visObs.observe(hero);
    canvas._visObs = visObs;

    var resObs = new ResizeObserver(function () { resize(); spawn(); });
    resObs.observe(hero);
    canvas._resObs = resObs;

    resize(); spawn(); tick();
    requestAnimationFrame(function () { canvas.style.opacity = '1'; });
  }

  initCanvas();
  document.addEventListener('themechange', initCanvas);
});
