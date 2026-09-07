/* ============================================================
   Scroll-driven point cloud.

   One fixed canvas behind the whole page. The cloud morphs through
   five states as you scroll, each tied to a section, and the camera
   travels with it:

     scanned wave  ->  volumetric sphere  ->  pitch grid
                   ->  constellation      ->  convergence

   Deliberately on-message rather than decorative: a lidar-style sweep,
   detection brackets that lock onto clusters, and a pitch of 22 tracked
   points that nods to the stadium AR work.

   Canvas 2D, no dependencies. Points are drawn as batched rects grouped
   into alpha buckets — one fill() per bucket instead of one per point,
   which is what makes ~3,200 points affordable at 60fps.
   ============================================================ */

(function () {
  'use strict';

  const cv = document.getElementById('cloud');
  if (!cv) return;
  const ctx = cv.getContext('2d', { alpha: true });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small  = window.matchMedia('(max-width: 820px)').matches;

  const N = small ? 1500 : 3200;
  const SHAPES = 5;

  /* deterministic RNG so the cloud looks identical on every load */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20260907);

  /* ---------- shape targets ---------- */
  const P = new Float32Array(SHAPES * N * 3);   // [shape][point][xyz]
  const U = new Float32Array(N);                // grid u, drives the wave + scan
  const V = new Float32Array(N);                // grid v
  const hot = new Uint8Array(N);                // accent points
  const player = new Uint8Array(N);             // the 22 "tracked" points

  const cols = Math.round(Math.sqrt(N * 2.2));
  const rows = Math.ceil(N / cols);
  const set = (s, i, x, y, z) => {
    const o = (s * N + i) * 3; P[o] = x; P[o + 1] = y; P[o + 2] = z;
  };

  const GR = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const u = (i % cols) / (cols - 1) * 2 - 1;
    const v = Math.floor(i / cols) / (rows - 1) * 2 - 1;
    U[i] = u; V[i] = v;
    hot[i] = rnd() < 0.055 ? 1 : 0;

    // 0 — scanned wave surface (hero)
    set(0, i, u * 640, 0, v * 490);

    // 1 — volumetric sphere shell (a reconstructed object)
    const py = 1 - (i / (N - 1)) * 2;
    const pr = Math.sqrt(Math.max(0, 1 - py * py));
    const th = GR * i;
    const R = 350 + rnd() * 34;
    set(1, i, Math.cos(th) * pr * R, py * R, Math.sin(th) * pr * R);

    // 2 — pitch grid, 105 x 68 proportion (the stadium AR nod)
    set(2, i, u * 660, (rnd() - 0.5) * 8, v * 428);

    // 3 — dispersed constellation
    const a1 = rnd() * 6.2832, a2 = Math.acos(rnd() * 2 - 1);
    const rr = 340 + Math.pow(rnd(), 0.6) * 470;
    set(3, i, Math.sin(a2) * Math.cos(a1) * rr, Math.cos(a2) * rr * 0.62, Math.sin(a2) * Math.sin(a1) * rr);

    // 4 — convergence to a single dense cluster
    const b1 = rnd() * 6.2832, b2 = Math.acos(rnd() * 2 - 1);
    const bR = Math.pow(rnd(), 0.45) * 74;
    set(4, i, Math.sin(b2) * Math.cos(b1) * bR, Math.cos(b2) * bR, Math.sin(b2) * Math.sin(b1) * bR);
  }
  for (let k = 0; k < 22; k++) player[(k * 97 + 13) % N] = 1;

  /* ---------- camera keyframes, one per shape ---------- */
  const CAM = [
    { rx: -0.74, ry:  0.00, dist:  900 },
    { rx: -0.26, ry:  0.65, dist: 1080 },
    { rx: -1.05, ry:  0.18, dist: 1120 },
    { rx: -0.34, ry: -0.50, dist: 1320 },
    { rx: -0.08, ry:  1.05, dist:  760 }
  ];
  // scroll position at which each shape is fully resolved
  const ANCHOR = [0.00, 0.30, 0.545, 0.775, 1.00];

  const smooth = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const lerp = (a, b, f) => a + (b - a) * f;

  /* ---------- sizing ---------- */
  let W = 0, H = 0, cx = 0, cy = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.max(1, (W * dpr) | 0);
    cv.height = Math.max(1, (H * dpr) | 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W > 1000 ? W * 0.66 : W * 0.5;
    cy = H * 0.54;
  }
  resize();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 140); }, { passive: true });

  /* ---------- scroll + pointer ---------- */
  let sTarget = 0, s = 0, pmx = 0, pmy = 0, mx = 0, my = 0;
  function readScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    sTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }
  readScroll();
  s = sTarget;
  window.addEventListener('scroll', () => {
    readScroll();
    // with animation off, redraw on scroll so the cloud still steps back behind copy
    if (reduce && !pending) { pending = true; requestAnimationFrame(ts => { pending = false; frame(ts); }); }
  }, { passive: true });
  let pending = false;
  if (!reduce && !small) {
    window.addEventListener('pointermove', e => {
      pmx = (e.clientX / window.innerWidth - 0.5) * 2;
      pmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- detection trackers ---------- */
  const LABELS = ['OBJECT', 'SURFACE', 'CLUSTER', 'REGION', 'FEATURE', 'PLAYER'];
  const trackers = [];
  for (let k = 0; k < 3; k++) trackers.push({
    idx: (rnd() * N) | 0, x: 0, y: 0, w: 130, h: 92,
    life: 0, hold: 200 + k * 90, conf: 0.9, label: LABELS[k], id: k + 1
  });
  function retarget(t) {
    t.idx = (rnd() * N) | 0;
    t.hold = 260 + rnd() * 220; t.life = 0;
    t.conf = 0.88 + rnd() * 0.11;
    t.label = LABELS[(rnd() * LABELS.length) | 0];
    t.w = 110 + rnd() * 70; t.h = 78 + rnd() * 46;
    t.id++;
  }

  /* ---------- render ---------- */
  const FOCAL = 980;
  const BUCKETS = 10;
  const sx = new Float32Array(N), sy = new Float32Array(N), sk = new Float32Array(N);
  const bx = [], by = [], br = [];
  for (let i = 0; i < BUCKETS * 2; i++) { bx.push([]); by.push([]); br.push([]); }

  function frame(ms) {
    const t = ms * 0.001;
    s += reduce ? (sTarget - s) : (sTarget - s) * 0.09;   // easing the scroll makes the morph fluid
    mx += (pmx - mx) * 0.04;
    my += (pmy - my) * 0.04;

    // which pair of shapes, and how far between them
    let k = 0;
    while (k < SHAPES - 2 && s > ANCHOR[k + 1]) k++;
    const span = ANCHOR[k + 1] - ANCHOR[k];
    const localT = span > 0 ? (s - ANCHOR[k]) / span : 0;
    // hold each shape near its anchor; morph across the middle of the span
    const f = smooth((Math.min(1, Math.max(0, localT)) - 0.16) / 0.68);

    const camA = CAM[k], camB = CAM[k + 1];
    const rx = lerp(camA.rx, camB.rx, f) + my * 0.06;
    const ry = lerp(camA.ry, camB.ry, f) + Math.sin(t * 0.12) * 0.22 + mx * 0.14;
    const dist = lerp(camA.dist, camB.dist, f);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosX = Math.cos(rx), sinX = Math.sin(rx);

    const waveW  = k === 0 ? 1 - f : 0;                 // wave animates only while shape 0 is present
    const pitchW = k === 1 ? f : k === 2 ? 1 - f : 0;   // player highlights only on the pitch
    const scan = Math.sin(t * 0.42) * 1.05;

    // full strength over the hero, then steps back hard behind body copy
    const vis = lerp(1, small ? 0.15 : 0.23, smooth((s - 0.02) / 0.1)) + smooth((s - 0.9) / 0.1) * 0.14;

    const oA = k * N * 3, oB = (k + 1) * N * 3;
    for (let i = 0; i < BUCKETS * 2; i++) { bx[i].length = 0; by[i].length = 0; br[i].length = 0; }
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < N; i++) {
      const j = i * 3;
      const x = lerp(P[oA + j],     P[oB + j],     f);
      let   y = lerp(P[oA + j + 1], P[oB + j + 1], f);
      const z = lerp(P[oA + j + 2], P[oB + j + 2], f);

      if (waveW > 0) {
        y += waveW * ((Math.sin(U[i] * 2.6 + t * 0.5) * Math.cos(V[i] * 2.1 - t * 0.36) * 74)
                    + Math.sin((U[i] + V[i]) * 4.1 + t * 0.8) * 16);
      }
      y += Math.sin(t * 0.6 + i * 0.013) * 2.4;   // never completely still

      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const p = FOCAL / (FOCAL + z2 + dist);
      sx[i] = cx + x1 * p; sy[i] = cy + y1 * p; sk[i] = p;

      const depth = Math.max(0, Math.min(1, (p - 0.34) / 0.42));
      let a = 0.13 + depth * 0.55;
      let r = 0.5 + depth * 1.55;

      const near = waveW > 0 ? (1 - Math.min(1, Math.abs(V[i] - scan) / 0.13)) * waveW : 0;
      if (near > 0) { a += near * 0.5; r += near * 1.3; }
      if (player[i] && pitchW > 0) { a += pitchW * 0.45; r += pitchW * 1.6; }

      a *= vis;
      if (a < 0.012) continue;

      const acid = hot[i] || near > 0.45 || (player[i] && pitchW > 0.5);
      let bkt = (a * BUCKETS) | 0; if (bkt > BUCKETS - 1) bkt = BUCKETS - 1;
      const bi = acid ? BUCKETS + bkt : bkt;
      bx[bi].push(sx[i]); by[bi].push(sy[i]); br[bi].push(r);
    }

    // one fill() per alpha bucket rather than one per point
    for (let b = 0; b < BUCKETS * 2; b++) {
      const xs = bx[b]; if (!xs.length) continue;
      const a = ((b % BUCKETS) + 0.5) / BUCKETS;
      ctx.fillStyle = b >= BUCKETS ? 'rgba(215,255,62,' + a.toFixed(3) + ')'
                                   : 'rgba(240,239,236,' + a.toFixed(3) + ')';
      ctx.beginPath();
      const ys = by[b], rs = br[b];
      for (let n = 0; n < xs.length; n++) {
        ctx.moveTo(xs[n] + rs[n], ys[n]);
        ctx.arc(xs[n], ys[n], rs[n], 0, 6.2832);
      }
      ctx.fill();
    }

    /* detection brackets — live over the hero scan and again over the pitch */
    const boxVis = Math.max(1 - smooth((s - 0.015) / 0.085), pitchW * vis * 1.25);
    if (boxVis > 0.02) {
      ctx.lineWidth = 1;
      ctx.font = '500 9px "JetBrains Mono",ui-monospace,monospace';
      for (let n = 0; n < trackers.length; n++) {
        const tr = trackers[n];
        tr.life++;
        if (tr.life > tr.hold) retarget(tr);
        const fade = Math.min(1, tr.life / 26) * Math.min(1, (tr.hold - tr.life) / 26) * boxVis;
        if (fade <= 0.02) continue;

        const px = sx[tr.idx], py = sy[tr.idx], pk = sk[tr.idx];
        tr.x += (px - tr.x) * (tr.life < 3 ? 1 : 0.09);
        tr.y += (py - tr.y) * (tr.life < 3 ? 1 : 0.09);

        const w = tr.w * pk, h = tr.h * pk;
        const x = tr.x - w / 2, y = tr.y - h / 2;
        const arm = Math.min(w, h) * 0.26;

        ctx.strokeStyle = 'rgba(215,255,62,' + (fade * 0.85).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(x, y + arm);          ctx.lineTo(x, y);         ctx.lineTo(x + arm, y);
        ctx.moveTo(x + w - arm, y);      ctx.lineTo(x + w, y);     ctx.lineTo(x + w, y + arm);
        ctx.moveTo(x + w, y + h - arm);  ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - arm, y + h);
        ctx.moveTo(x + arm, y + h);      ctx.lineTo(x, y + h);     ctx.lineTo(x, y + h - arm);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(215,255,62,' + (fade * 0.4).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(tr.x - 4, tr.y); ctx.lineTo(tr.x + 4, tr.y);
        ctx.moveTo(tr.x, tr.y - 4); ctx.lineTo(tr.x, tr.y + 4);
        ctx.stroke();

        ctx.fillStyle = 'rgba(215,255,62,' + (fade * 0.72).toFixed(3) + ')';
        ctx.fillText(tr.label + ' ' + String(tr.id).padStart(2, '0') + '  ' + tr.conf.toFixed(2), x, y - 7);
      }
    }

    if (!reduce) raf = requestAnimationFrame(frame);
  }

  let raf = requestAnimationFrame(frame);

  // never animate against a hidden tab
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && !reduce) raf = requestAnimationFrame(frame);
  });
})();
