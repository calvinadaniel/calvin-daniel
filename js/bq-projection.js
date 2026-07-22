// Boston Qualifier Projection chart — vanilla port of the Claude Design prototype.
(() => {
  const canvas = document.getElementById('bq-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const replayBtn = document.getElementById('bq-replay');
  const slider = document.getElementById('bq-intensity');
  const intensityLabel = document.getElementById('bq-intensity-label');
  const modal = document.getElementById('bq-modal');
  const modalCard = document.getElementById('bq-modal-card');
  const modalClose = document.getElementById('bq-modal-close');
  const modalRace = document.getElementById('bq-modal-race');
  const modalDate = document.getElementById('bq-modal-date');
  const modalDist = document.getElementById('bq-modal-dist');
  const modalFinish = document.getElementById('bq-modal-finish');
  const modalPace = document.getElementById('bq-modal-pace');

  const actual = [
    { mo: 0, pace: 9.917, race: 'Fall Half Marathon', dist: 'Half Marathon', finish: '2:10:12' },
    { mo: 1, pace: 9.85, race: 'Harvest 10K', dist: '10K', finish: '1:01:04' },
    { mo: 2, pace: 9.8, race: 'Turkey Trot 5K', dist: '5K', finish: '30:28' },
    { mo: 3, pace: 9.75, race: 'Jingle Bell Run', dist: '10K', finish: '1:00:27' },
    { mo: 4, pace: 9.7, race: 'Resolution Run', dist: '10K', finish: '1:00:07' },
    { mo: 5, pace: 9.667, race: 'Valentine 5K', dist: '5K', finish: '30:02' },
    { mo: 6, pace: 9.633, race: 'Spring Forward 10K', dist: '10K', finish: '59:44' },
    { mo: 8, pace: 9.567, race: 'May Day Half', dist: 'Half Marathon', finish: '2:05:23' },
    { mo: 9, pace: 9.533, race: 'Summer Solstice 5K', dist: '5K', finish: '29:37' },
    { mo: 10, pace: 9.5, race: 'Firecracker 10K', dist: '10K', finish: '58:54' },
    { mo: 12, pace: 9.45, race: 'Labor Day Half', dist: 'Half Marathon', finish: '2:03:39' },
    { mo: 13, pace: 9.4, race: 'Fall Classic Marathon', dist: 'Marathon', finish: '4:06:14' },
    { mo: 15, pace: 9.35, race: 'Winter Solstice 10K', dist: '10K', finish: '57:58' },
    { mo: 16, pace: 9.3, race: 'New Year Half', dist: 'Half Marathon', finish: '2:01:42' },
    { mo: 18, pace: 9.233, race: 'Spring Marathon', dist: 'Marathon', finish: '4:02:01' },
  ];

  const themes = {
    light: {
      gridLine: '#E0DBD5', gridText: '#9A9088',
      actual: '#E8734A', target: '#E8734A',
      currentTraj: '#1B2838', consistent: '#2E5EAA', peak: '#1A9E78',
      tooltipBg: '#1B2838', tooltipText: '#FEFCF9', pointStroke: '#FEFCF9',
    },
    dark: {
      gridLine: '#1E2630', gridText: '#3A4858',
      actual: '#F09060', target: '#F09060',
      currentTraj: '#7A8A9A', consistent: '#5B8FD9', peak: '#3DD9A8',
      tooltipBg: '#E6DFD6', tooltipText: '#141A22', pointStroke: '#141A22',
    },
  };

  const PAD = { top: 28, right: 56, bottom: 48, left: 60 };
  const MIN_PACE = 6.8, MAX_PACE = 10.2, MIN_MO = -1, MAX_MO = 56;

  const state = { intensity: 1.0, animT: 0, tooltip: null };
  let hitZones = [];
  let animId = null;
  let animStart = null;
  let W = 0, H = 0, DPR = 1;

  const isDark = () => document.documentElement.classList.contains('dark');
  const theme = () => (isDark() ? themes.dark : themes.light);
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const font = (wt, sz) => `${wt} ${sz}px "DM Sans", "Space Mono", sans-serif`;
  const monoFont = (wt, sz) => `${wt} ${sz}px "Space Mono", monospace`;

  const monthToLabel = (mo) => {
    const ms = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ms[(8 + mo) % 12] + ' ' + (2024 + Math.floor((8 + mo) / 12));
  };
  const monthToShort = (mo) => (2024 + Math.floor((8 + mo) / 12)) + '-' + String(((8 + mo) % 12) + 1).padStart(2, '0');
  const paceToStr = (p) => {
    const mins = Math.floor(p);
    return mins + ':' + String(Math.round((p - mins) * 60)).padStart(2, '0');
  };
  const moToX = (mo) => PAD.left + (mo - MIN_MO) / (MAX_MO - MIN_MO) * (W - PAD.left - PAD.right);
  const paceToY = (pace) => PAD.top + (pace - MIN_PACE) / (MAX_PACE - MIN_PACE) * (H - PAD.top - PAD.bottom);
  const projPace = (rate, elapsed, totalMonths, intensity) => {
    const last = actual[actual.length - 1].pace;
    return last - rate * intensity * elapsed * (1 - 0.25 * (elapsed / totalMonths));
  };

  const setupCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    DPR = window.devicePixelRatio || 1;
    W = rect.width;
    H = Math.max(Math.min(W * 0.5, 500), 280);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.height = H + 'px';
  };

  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  };

  const drawTooltip = (tx, ty, data, th) => {
    const t1 = paceToStr(data.pace) + '/mi';
    const t2 = monthToLabel(data.mo);
    const t3 = data.race || '';
    ctx.font = font('700', 13);
    const w1 = ctx.measureText(t1).width;
    ctx.font = monoFont('400', 11);
    const w2 = ctx.measureText(t2).width;
    const w3 = t3 ? ctx.measureText(t3).width : 0;
    const bw = Math.max(w1, w2, w3) + 28;
    const bh = t3 ? 58 : 44;
    let bx = clamp(tx - bw / 2, PAD.left, W - PAD.right - bw);
    let by = ty - bh - 14;
    if (by < PAD.top) by = ty + 14;
    ctx.globalAlpha = 0.12; ctx.fillStyle = '#000';
    roundRect(bx + 1, by + 2, bw, bh, 8); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = th.tooltipBg;
    roundRect(bx, by, bw, bh, 8); ctx.fill();
    ctx.fillStyle = th.tooltipText; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.font = font('700', 13); ctx.fillText(t1, bx + 14, by + 9);
    ctx.font = monoFont('400', 11); ctx.globalAlpha = 0.65;
    ctx.fillText(t2, bx + 14, by + 27);
    if (t3) ctx.fillText(t3, bx + 14, by + 41);
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(tx, ty, 8, 0, Math.PI * 2);
    ctx.strokeStyle = th.actual; ctx.lineWidth = 2.5; ctx.stroke();
  };

  const drawChart = () => {
    const t = state.animT;
    const th = theme();
    ctx.save(); ctx.scale(DPR, DPR); ctx.clearRect(0, 0, W, H);
    const gridA = Math.min(t / 0.12, 1);
    const targetP = clamp((t - 0.10) / 0.12, 0, 1);
    const pointsP = clamp((t - 0.18) / 0.47, 0, 1);
    const projP = clamp((t - 0.62) / 0.38, 0, 1);

    // Grid
    ctx.globalAlpha = gridA;
    const paceLines = [7, 7.333, 7.667, 8, 8.333, 8.667, 9, 9.333, 9.667, 10];
    const paceLabels = ['7:00', '7:20', '7:40', '8:00', '8:20', '8:40', '9:00', '9:20', '9:40', '10:00'];
    ctx.strokeStyle = th.gridLine; ctx.lineWidth = 1;
    for (let i = 0; i < paceLines.length; i++) {
      const y = paceToY(paceLines[i]);
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
      ctx.fillStyle = th.gridText; ctx.font = monoFont('500', 10);
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(paceLabels[i], PAD.left - 10, y);
    }
    const moLines = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54];
    for (let i = 0; i < moLines.length; i++) {
      const x = moToX(moLines[i]);
      ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, H - PAD.bottom); ctx.stroke();
      ctx.fillStyle = th.gridText; ctx.font = monoFont('500', W < 700 ? 9 : 10);
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const labelStep = W >= 700 ? 1 : W >= 420 ? 2 : 4;
      if (i % labelStep === 0) ctx.fillText(monthToShort(moLines[i]), x, H - PAD.bottom + 10);
    }

    // BQ target line
    if (targetP > 0) {
      ctx.globalAlpha = gridA * 0.8;
      ctx.setLineDash([8, 5]); ctx.strokeStyle = th.target; ctx.lineWidth = 2;
      const tY = paceToY(7.05);
      const endX = PAD.left + (W - PAD.left - PAD.right) * easeOut(targetP);
      ctx.beginPath(); ctx.moveTo(PAD.left, tY); ctx.lineTo(endX, tY); ctx.stroke();
      ctx.setLineDash([]);
      if (targetP > 0.8) {
        ctx.globalAlpha = gridA * clamp((targetP - 0.8) / 0.2, 0, 1);
        ctx.fillStyle = th.target; ctx.font = monoFont('600', 10);
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('BQ 7:03/mi', PAD.left + 4, tY - 6);
      }
    }

    // Actual data
    hitZones = [];
    if (pointsP > 0) {
      const n = actual.length;
      const vis = Math.ceil(pointsP * n);
      ctx.globalAlpha = 1; ctx.strokeStyle = th.actual; ctx.lineWidth = 2; ctx.setLineDash([]);
      ctx.beginPath();
      for (let i = 0; i < vis && i < n; i++) {
        const d = actual[i];
        const x = moToX(d.mo), y = paceToY(d.pace);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      for (let i = 0; i < vis && i < n; i++) {
        const d = actual[i];
        const x = moToX(d.mo), y = paceToY(d.pace);
        const pt = clamp((pointsP * n - i) / 0.8, 0, 1);
        const sc = easeOutBack(pt);
        ctx.globalAlpha = pt;
        ctx.beginPath(); ctx.arc(x, y, 5 * sc, 0, Math.PI * 2);
        ctx.fillStyle = th.actual; ctx.fill();
        ctx.strokeStyle = th.pointStroke; ctx.lineWidth = 2; ctx.stroke();
        if (pt > 0.3) hitZones.push({ x, y, r: 10, data: d });
      }
    }

    // Projections
    if (projP > 0) {
      const lastMo = actual[actual.length - 1].mo;
      const totalMo = MAX_MO - lastMo;
      const projs = [
        { rate: 0.008, color: th.currentTraj },
        { rate: 0.020, color: th.consistent },
        { rate: 0.038, color: th.peak },
      ];
      const drawLen = easeOut(projP);
      for (const p of projs) {
        ctx.globalAlpha = Math.min(projP * 2, 1);
        ctx.strokeStyle = p.color; ctx.lineWidth = 2.5; ctx.setLineDash([]);
        ctx.beginPath();
        const steps = 80;
        let lastX = 0, lastY = 0;
        for (let s = 0; s <= steps * drawLen; s++) {
          const mo = lastMo + (s / steps) * totalMo;
          const pace = projPace(p.rate, mo - lastMo, totalMo, state.intensity);
          const x = moToX(mo), y = paceToY(Math.max(pace, MIN_PACE));
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          lastX = x; lastY = y;
        }
        ctx.stroke();
        if (projP > 0.85) {
          const endMo = lastMo + drawLen * totalMo;
          const endPace = projPace(p.rate, endMo - lastMo, totalMo, state.intensity);
          ctx.globalAlpha = clamp((projP - 0.85) / 0.15, 0, 1);
          ctx.fillStyle = p.color; ctx.font = monoFont('600', 10);
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(paceToStr(Math.max(endPace, MIN_PACE)), lastX + 6, lastY);
        }
      }
    }

    if (state.tooltip && state.animT >= 1) {
      drawTooltip(state.tooltip.x, state.tooltip.y, state.tooltip.data, th);
    }
    ctx.restore();
  };

  const startAnimation = () => {
    animStart = performance.now();
    if (animId) cancelAnimationFrame(animId);
    const tick = (now) => {
      state.animT = Math.min((now - animStart) / 4500, 1);
      drawChart();
      if (state.animT < 1) animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
  };

  const hitAt = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let hit = null, best = Infinity;
    for (const z of hitZones) {
      const d = Math.hypot(mx - z.x, my - z.y);
      if (d < z.r * 2.5 && d < best) { hit = z; best = d; }
    }
    return hit;
  };

  canvas.addEventListener('mousemove', (e) => {
    if (state.animT < 1) return;
    const hit = hitAt(e);
    canvas.style.cursor = hit ? 'pointer' : 'crosshair';
    state.tooltip = hit ? { x: hit.x, y: hit.y, data: hit.data } : null;
    drawChart();
  });
  canvas.addEventListener('mouseleave', () => { state.tooltip = null; drawChart(); });
  canvas.addEventListener('click', (e) => {
    if (state.animT < 1) return;
    const hit = hitAt(e);
    if (!hit) return;
    modalRace.textContent = hit.data.race;
    modalDate.textContent = monthToLabel(hit.data.mo);
    modalDist.textContent = hit.data.dist;
    modalFinish.textContent = hit.data.finish;
    modalPace.textContent = paceToStr(hit.data.pace) + '/mi';
    modal.classList.add('bq-modal--open');
  });

  const closeModal = () => modal.classList.remove('bq-modal--open');
  modal.addEventListener('click', closeModal);
  modalCard.addEventListener('click', (e) => e.stopPropagation());
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  replayBtn.addEventListener('click', startAnimation);
  slider.addEventListener('input', () => {
    state.intensity = parseFloat(slider.value);
    intensityLabel.textContent = state.intensity.toFixed(1) + '×';
    drawChart();
  });

  new ResizeObserver(() => { setupCanvas(); drawChart(); }).observe(canvas.parentElement);
  new MutationObserver(drawChart).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  setupCanvas();
  // Start the intro animation when the chart scrolls into view
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { startAnimation(); io.disconnect(); }
  }, { threshold: 0.25 });
  io.observe(canvas);
})();
