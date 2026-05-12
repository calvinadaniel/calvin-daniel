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
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el       = entry.target;
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
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-countup]').forEach(function (el) {
    countObs.observe(el);
  });

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
      ? ['rgba(255,255,255,0.6)', 'rgba(255,89,16,0.55)', 'rgba(100,160,255,0.5)']
      : ['rgba(13,27,62,0.45)',   'rgba(255,89,16,0.45)', 'rgba(0,45,114,0.35)'];
    var CC     = isDark ? '255,255,255' : '13,27,62';
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
