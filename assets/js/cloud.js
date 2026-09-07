/* ============================================================
   Hero canvas — a scanned point cloud with live detection boxes.
   Deliberately on-message: this is what the CV work looks like.
   Plain canvas 2D, no library, ~1900 points at 60fps.
   ============================================================ */

(function () {
  'use strict';

  const cv = document.getElementById('cloud');
  if (!cv) return;
  const ctx = cv.getContext('2d', { alpha: true });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- point cloud: a wave surface, sampled on a grid ---------- */
  const COLS = 74, ROWS = 40;
  const SPAN_X = 1280, SPAN_Z = 980;
  const pts = [];
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      const u = i / (COLS - 1) * 2 - 1;
      const v = j / (ROWS - 1) * 2 - 1;
      pts.push({
        u: u, v: v,
        x: u * SPAN_X / 2,
        z: v * SPAN_Z / 2,
        y: 0, sx: 0, sy: 0, d: 0, s: 0,
        hot: Math.random() < 0.055           // a few accent points
      });
    }
  }

  /* ---------- detection trackers ---------- */
  const LABELS = ['OBJECT', 'SURFACE', 'CLUSTER', 'REGION', 'FEATURE'];
  const trackers = [];
  for (let k = 0; k < 3; k++) {
    trackers.push({
      idx: (Math.random() * pts.length) | 0,
      x: 0, y: 0, w: 130, h: 92, life: 0, hold: 140 + k * 90,
      conf: 0.9 + Math.random() * 0.09,
      label: LABELS[(Math.random() * LABELS.length) | 0],
      id: k + 1, born: 0
    });
  }
  function retarget(t) {
    t.idx = (Math.random() * pts.length) | 0;
    t.hold = 260 + Math.random() * 220;
    t.life = 0;
    t.conf = 0.88 + Math.random() * 0.11;
    t.label = LABELS[(Math.random() * LABELS.length) | 0];
    t.w = 110 + Math.random() * 70;
    t.h = 78 + Math.random() * 46;
    t.id++;
  }

  /* ---------- sizing ---------- */
  let W = 0, H = 0, cx = 0, cy = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = Math.max(1, (W * dpr) | 0);
    cv.height = Math.max(1, (H * dpr) | 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // push the cloud right of centre on wide screens, so the type sits clear of it
    cx = W > 1000 ? W * 0.66 : W * 0.5;
    cy = H * 0.54;
  }
  resize();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });

  /* ---------- pointer parallax ---------- */
  let pmx = 0, pmy = 0, mx = 0, my = 0;
  if (!reduce) {
    window.addEventListener('pointermove', e => {
      pmx = (e.clientX / window.innerWidth - 0.5) * 2;
      pmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- render ---------- */
  const FOCAL = 980, DIST = 900;
  const TILT = -0.74;

  function frame(ms) {
    const t = ms * 0.001;
    mx += (pmx - mx) * 0.04;
    my += (pmy - my) * 0.04;

    const ry = Math.sin(t * 0.12) * 0.22 + mx * 0.14;
    const rx = TILT + my * 0.07;
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosX = Math.cos(rx), sinX = Math.sin(rx);

    // lidar-style scan sweeping through the cloud
    const scan = Math.sin(t * 0.42) * 1.05;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      // wave surface
      p.y = (Math.sin(p.u * 2.6 + t * 0.5) * Math.cos(p.v * 2.1 - t * 0.36) * 74)
          + Math.sin((p.u + p.v) * 4.1 + t * 0.8) * 16;

      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const s = FOCAL / (FOCAL + z2 + DIST);
      p.sx = cx + x1 * s;
      p.sy = cy + y1 * s;
      p.d = z2; p.s = s;

      const near = 1 - Math.min(1, Math.abs(p.v - scan) / 0.13);
      const depth = Math.max(0, Math.min(1, (s - 0.42) / 0.30));
      let a = 0.13 + depth * 0.55;
      let r = 0.5 + depth * 1.55;

      if (near > 0) { a += near * 0.5; r += near * 1.3; }

      if (p.hot || near > 0.45) {
        ctx.fillStyle = 'rgba(215,255,62,' + Math.min(0.92, a + 0.12).toFixed(3) + ')';
      } else {
        ctx.fillStyle = 'rgba(240,239,236,' + a.toFixed(3) + ')';
      }
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, 6.2832);
      ctx.fill();
    }

    // detection boxes
    ctx.lineWidth = 1;
    ctx.font = '500 9px "JetBrains Mono",ui-monospace,monospace';
    ctx.textBaseline = 'alphabetic';

    for (let k = 0; k < trackers.length; k++) {
      const tr = trackers[k];
      const p = pts[tr.idx];
      tr.life++;
      if (tr.life > tr.hold) retarget(tr);

      // ease in / out at the edges of the tracker's life
      const fade = Math.min(1, tr.life / 26) * Math.min(1, (tr.hold - tr.life) / 26);
      if (fade <= 0.01) continue;

      const tx = p.sx, ty = p.sy;
      tr.x += (tx - tr.x) * (tr.life < 3 ? 1 : 0.09);
      tr.y += (ty - tr.y) * (tr.life < 3 ? 1 : 0.09);

      const w = tr.w * p.s, h = tr.h * p.s;
      const x = tr.x - w / 2, y = tr.y - h / 2;
      const c = 'rgba(215,255,62,' + (fade * 0.85).toFixed(3) + ')';
      const arm = Math.min(w, h) * 0.26;

      ctx.strokeStyle = c;
      ctx.beginPath();
      // corner brackets, not a full rectangle — reads as an instrument, not a border
      ctx.moveTo(x, y + arm);           ctx.lineTo(x, y);        ctx.lineTo(x + arm, y);
      ctx.moveTo(x + w - arm, y);       ctx.lineTo(x + w, y);    ctx.lineTo(x + w, y + arm);
      ctx.moveTo(x + w, y + h - arm);   ctx.lineTo(x + w, y + h);ctx.lineTo(x + w - arm, y + h);
      ctx.moveTo(x + arm, y + h);       ctx.lineTo(x, y + h);    ctx.lineTo(x, y + h - arm);
      ctx.stroke();

      // crosshair at the locked point
      ctx.strokeStyle = 'rgba(215,255,62,' + (fade * 0.4).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(tr.x - 4, tr.y); ctx.lineTo(tr.x + 4, tr.y);
      ctx.moveTo(tr.x, tr.y - 4); ctx.lineTo(tr.x, tr.y + 4);
      ctx.stroke();

      const tag = tr.label + ' ' + String(tr.id).padStart(2, '0') + '  ' + tr.conf.toFixed(2);
      ctx.fillStyle = 'rgba(215,255,62,' + (fade * 0.72).toFixed(3) + ')';
      ctx.fillText(tag, x, y - 7);
    }

    if (!reduce) raf = requestAnimationFrame(frame);
  }

  let raf = requestAnimationFrame(frame);

  // don't burn cycles while the tab is hidden or the hero is scrolled away
  let visible = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else if (visible && !reduce) { raf = requestAnimationFrame(frame); }
  });

  if ('IntersectionObserver' in window && !reduce) {
    new IntersectionObserver(es => {
      es.forEach(e => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      });
    }, { threshold: 0 }).observe(cv);
  }
})();
