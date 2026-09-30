/* ── Hero town map ─────────────────────────────────────────
   Streets draw outward from "Your business"; visitor pins drop around the
   neighborhood, route along the streets to it and turn orange as "Booked".
   WAAPI only. The SVG is rebuilt when the hero width changes. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const hero = document.getElementById('hero');
  const svg = document.getElementById('hero-town');
  const spot = document.getElementById('hero-town-spot');
  if (!hero || !svg || !spot) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers = [];
  let loop = null;
  let state = null;
  let lastW = 0;
  let heroVisible = true;

  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.appendChild(n);
    return n;
  };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  const draw = (node, len, opts) => {
    node.style.strokeDasharray = len;
    return node.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { fill: 'backwards', ...opts });
  };

  const tag = (parent, x, y, text, cls) => {
    const g = el('g', { class: cls }, parent);
    const w = text.length * 7.6 + 16;
    el('rect', { x: x - w / 2, y: y - 30, width: w, height: 22, rx: 2 }, g);
    const t = el('text', { x, y: y - 15, 'text-anchor': 'middle' }, g);
    t.textContent = text;
    return g;
  };

  const visitor = () => {
    const { B, G, routes, pins, tags, spots, used } = state;
    const taken = [...pins.children].map(p => [+p.getAttribute('cx'), +p.getAttribute('cy')]);
    const free = spots.filter(sp => taken.every(([x, y]) => Math.abs(x - sp.x) + Math.abs(y - sp.y) > G * 1.5));
    const s = pick(free.length ? free : spots);
    if (!s) return;
    const pin = el('circle', { class: 'hero-town__pin', cx: s.x, cy: s.y, r: 7 }, pins);
    pin.animate([{ transform: 'translateY(-26px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.34,1.56,.64,1)' });

    const len = Math.abs(B.x - s.x) + Math.abs(B.y - s.y);
    const route = el('path', { class: 'hero-town__route', d: `M ${s.x} ${s.y} H ${B.x} V ${B.y}` }, routes);
    const dur = 500 + len * 1.6;
    draw(route, len, { duration: dur, delay: 380, easing: 'cubic-bezier(.4,0,.2,1)' });

    later(380 + dur, () => {
      state.ring.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 380 });
      pin.classList.add('hero-town__pin--booked');
      pin.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 380 });
      const t = tag(tags, s.x, s.y, 'Booked', 'hero-town__tag');
      t.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, fill: 'backwards' });
      route.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 500, fill: 'forwards' }).onfinish = () => route.remove();
      t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 1500, fill: 'forwards' }).onfinish = () => t.remove();
      used.push(pin);
      if (used.length > 9) {
        const old = used.shift();
        old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }).onfinish = () => old.remove();
      }
    });
  };

  const build = () => {
    timers.forEach(clearTimeout);
    timers = [];
    clearInterval(loop);
    svg.replaceChildren();

    const W = hero.clientWidth;
    const H = hero.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const mobile = W < 768;
    const G = mobile ? 54 : 74;
    const snap = v => Math.round(v / G) * G;
    let B;
    if (mobile) {
      /* backdrop behind the copy: the pin sits in the open space right of the stacked stats */
      B = { x: snap(W * .74), y: snap(H * .74) };
    } else {
      const hr = hero.getBoundingClientRect();
      const sr = spot.getBoundingClientRect();
      B = { x: snap(sr.left - hr.left + sr.width * .5), y: snap(sr.top - hr.top + sr.height * .5) };
    }

    const xs = [];
    const ys = [];
    for (let x = B.x % G; x <= W; x += G) xs.push(x);
    for (let y = B.y % G; y <= H; y += G) ys.push(y);
    const majorX = i => Math.round((xs[i] - B.x) / G) % 3 === 0;
    const majorY = j => Math.round((ys[j] - B.y) / G) % 3 === 0;

    const under = el('g', {}, svg);
    const park = el('rect', { class: 'hero-town__park', x: B.x + G * 2, y: B.y - G * 4, width: G * 2, height: G * 2 }, under);
    const river = el('path', { class: 'hero-town__river', d: `M ${W * .5} -40 C ${W * .62} ${H * .3}, ${W * .44} ${H * .55}, ${W * .56} ${H + 40}` }, under);

    const lines = [];
    const addLine = (x1, y1, x2, y2, cls) => {
      const n = el('line', { class: cls, x1, y1, x2, y2 }, under);
      lines.push({ n, len: Math.hypot(x2 - x1, y2 - y1), mid: Math.hypot((x1 + x2) / 2 - B.x, (y1 + y2) / 2 - B.y) });
    };
    /* cross streets always run the full width; some side streets dead-end, like a real town */
    xs.forEach((x, i) => {
      const major = majorX(i) || x === B.x;
      if (major || Math.random() < .5) return addLine(x, 0, x, H, 'hero-town__street' + (major ? ' hero-town__street--major' : ''));
      const a = Math.floor(rand(0, ys.length - 3));
      const b = Math.min(ys.length - 1, a + 2 + Math.floor(rand(0, 5)));
      addLine(x, ys[a], x, ys[b], 'hero-town__street');
    });
    ys.forEach((y, j) => addLine(0, y, W, y, 'hero-town__street' + (majorY(j) ? ' hero-town__street--major' : '')));
    const aveLen = Math.hypot(W, H);
    const ave = el('line', { class: 'hero-town__avenue', x1: B.x - aveLen, y1: B.y + aveLen * .58, x2: B.x + aveLen, y2: B.y - aveLen * .58 }, under);

    const routes = el('g', {}, svg);
    const pins = el('g', {}, svg);
    const tags = el('g', {}, svg);
    const homeG = el('g', {}, svg);
    const ring = el('circle', { class: 'hero-town__ring', cx: B.x, cy: B.y, r: 13 }, homeG);
    el('circle', { class: 'hero-town__home', cx: B.x, cy: B.y, r: 11 }, homeG);
    tag(homeG, B.x, B.y - 10, 'Your business', 'hero-town__tag hero-town__tag--home');

    const spots = [];
    xs.forEach(x => ys.forEach(y => {
      const far = Math.abs(x - B.x) + Math.abs(y - B.y);
      const inView = mobile
        ? (x > 20 && x < W - 20 && y > 100 && y < H - 20)
        : (x > W * .5 && x < W - 30 && y > 140 && y < H - 30);
      if (inView && far > G * 1.5 && far < G * 9) spots.push({ x, y });
    }));

    state = { B, G, routes, pins, tags, ring, spots, used: [] };

    if (reduce) {
      for (let i = 0; i < 5 && spots.length; i++) {
        const s = pick(spots);
        el('circle', { class: 'hero-town__pin hero-town__pin--booked', cx: s.x, cy: s.y, r: 7 }, pins);
      }
      return;
    }

    /* opening: the town draws itself outward from your business */
    const maxMid = Math.max(...lines.map(l => l.mid));
    lines.forEach(l => draw(l.n, l.len, { duration: 900, delay: 150 + (l.mid / maxMid) * 1300, easing: 'cubic-bezier(.3,.6,.2,1)' }));
    draw(ave, aveLen * 2, { duration: 1600, delay: 250, easing: 'cubic-bezier(.3,.6,.2,1)' });
    river.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200, delay: 500, fill: 'backwards' });
    park.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 900, fill: 'backwards' });
    homeG.animate([{ transform: 'translate(0,-40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 100, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
    ring.animate([{ transform: 'scale(1)', opacity: .9 }, { transform: 'scale(3.2)', opacity: 0 }], { duration: 2200, iterations: Infinity, delay: 900 });

    [1500, 1750, 2000, 2300].forEach(ms => later(ms, visitor));
    later(3600, () => {
      loop = setInterval(() => {
        if (heroVisible && document.visibilityState === 'visible') visitor();
      }, 1900);
    });
  };

  const start = () => {
    build();
    lastW = hero.clientWidth;
    new ResizeObserver(() => {
      if (Math.abs(hero.clientWidth - lastW) < 40) return;
      lastW = hero.clientWidth;
      clearTimeout(build._t);
      build._t = setTimeout(build, 250);
    }).observe(hero);
    new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; }).observe(hero);
  };

  /* the business pin is placed from the text column's height, so wait for the webfonts (briefly) */
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 700))]).then(start);
})();
