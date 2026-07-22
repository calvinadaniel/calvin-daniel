document.addEventListener('DOMContentLoaded', function () {

  /* ── Hero headline slide-up ────────────────────────────── */
  setTimeout(function () {
    var h = document.querySelector('.hero-headline');
    if (h) h.classList.add('animated');
  }, 180);

  /* ── Typewriter eyebrow ────────────────────────────────── */
  var eyebrowEl = document.getElementById('eyebrow-text');
  var cursorEl  = document.getElementById('eyebrow-cursor');
  var TEXT      = 'AI Workflow Architect';
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

  /* ── Hero diagram canvas: messy data → structured workflow ── */
  function initCanvas() {
    var hero   = document.getElementById('hero');
    var canvas = document.getElementById('hero-canvas');
    if (!hero || !canvas) return;
    var box = canvas.parentElement;

    if (canvas._raf)      { cancelAnimationFrame(canvas._raf); canvas._raf = null; }
    if (canvas._resObs)   { canvas._resObs.disconnect(); }
    if (canvas._visObs)   { canvas._visObs.disconnect(); }

    var ctx        = canvas.getContext('2d');
    var isDark     = document.documentElement.classList.contains('dark');
    var MESSY_COLOR = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(13,27,62,0.4)';
    var GRID_COLOR  = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(13,27,62,0.55)';
    var LINE_CC     = isDark ? '255,255,255' : '13,27,62';
    var FLOW_COLOR  = '#FF5910';
    var DIST        = 90;
    var GRID_COLS   = 4;
    var GRID_ROWS   = 5;
    var messy = [];
    var grid  = [];
    var flows = [];
    var raf   = null;

    function rand(a, b) { return Math.random() * (b - a) + a; }

    function resize() {
      canvas.width  = box.offsetWidth;
      canvas.height = box.offsetHeight;
    }

    function spawnFlow() {
      var from = messy[Math.floor(rand(0, messy.length))];
      var to   = grid[Math.floor(rand(0, grid.length))];
      return { from: from, to: to, p: rand(0, 1), speed: rand(0.004, 0.008) };
    }

    function spawn() {
      var w = canvas.width, h = canvas.height;
      var leftMax = w * 0.4;
      var rightX  = w * 0.62;
      var rightW  = w - rightX;

      messy = Array.from({ length: 16 }, function () {
        return {
          x: rand(w * 0.05, leftMax), y: rand(h * 0.08, h * 0.92),
          vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15),
          r: rand(1.6, 3)
        };
      });

      grid = [];
      for (var col = 0; col < GRID_COLS; col++) {
        for (var row = 0; row < GRID_ROWS; row++) {
          grid.push({
            x: rightX + (col + 0.5) * (rightW / GRID_COLS) + rand(-3, 3),
            y: h * 0.08 + (row + 0.5) * (h * 0.84 / GRID_ROWS) + rand(-3, 3),
            r: 2.4
          });
        }
      }

      flows = Array.from({ length: 6 }, spawnFlow);
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* messy web — chaotic, loosely connected */
      for (var i = 0; i < messy.length; i++) {
        for (var j = i + 1; j < messy.length; j++) {
          var d = Math.hypot(messy[i].x - messy[j].x, messy[i].y - messy[j].y);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(messy[i].x, messy[i].y);
            ctx.lineTo(messy[j].x, messy[j].y);
            ctx.strokeStyle = 'rgba(' + LINE_CC + ',' + ((1 - d / DIST) * 0.18) + ')';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      var leftMax = canvas.width * 0.4;
      messy.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = leftMax;
        if (p.x > leftMax) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = MESSY_COLOR;
        ctx.fill();
      });

      /* clean grid mesh — fixed, structured */
      grid.forEach(function (p, idx) {
        var right = grid[idx + GRID_ROWS];
        var down  = ((idx % GRID_ROWS) < GRID_ROWS - 1) ? grid[idx + 1] : null;
        [right, down].forEach(function (n) {
          if (!n) return;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = 'rgba(' + LINE_CC + ',0.14)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = GRID_COLOR;
        ctx.fill();
      });

      /* flowing particles — data moving from messy into the workflow */
      flows.forEach(function (f, idx) {
        f.p += f.speed;
        if (f.p >= 1) { flows[idx] = spawnFlow(); return; }
        var x = f.from.x + (f.to.x - f.from.x) * f.p;
        var y = f.from.y + (f.to.y - f.from.y) * f.p;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = FLOW_COLOR;
        ctx.fill();
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
    resObs.observe(box);
    canvas._resObs = resObs;

    resize(); spawn(); tick();
    requestAnimationFrame(function () { canvas.style.opacity = '1'; });
  }

  initCanvas();
  document.addEventListener('themechange', initCanvas);
});
