/* ============================================================
   Haider Kamal — portfolio behaviour
   Renders every section from assets/js/data.js, then wires
   nav, filters, modal, split-text reveals and pointer effects.
   ============================================================ */

(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const pad = n => String(n).padStart(2, '0');

  /* ---------- icons ---------- */
  const I = {
    arrow:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
    down:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    mail:   '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    pin:    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    film:   '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 9h5M2 15h5M17 9h5M17 15h5"/>',
    close:  '<path d="M18 6 6 18M6 6l12 12"/>',
    info:   '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    li:     '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    play:   '<polygon points="6 3 20 12 6 21 6 3"/>',
    gplay:  '<path d="M3 2.5v19a1 1 0 0 0 1.5.87l14-9.5a1 1 0 0 0 0-1.74l-14-9.5A1 1 0 0 0 3 2.5Z"/>'
  };
  const svg = (n, w) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.7) +
    '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || '') + '</svg>';
  const svgFill = n => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + (I[n] || '') + '</svg>';

  /* ---------- video embeds ----------
     Nothing is requested from YouTube until someone presses play: a facade
     shows a local poster, and the real player replaces it on click. */
  function embed(v, autoplay) {
    if (!v) return '';
    if (v.type === 'youtube') {
      return '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id +
        '?rel=0&modestbranding=1&playsinline=1' + (autoplay ? '&autoplay=1' : '') +
        '" title="' + (v.label || 'Demo video') + '" loading="lazy" allowfullscreen ' +
        'allow="autoplay; accelerometer; clipboard-write; encrypted-media; picture-in-picture; fullscreen"></iframe>';
    }
    return '<video src="' + v.src + '" controls playsinline preload="metadata"' +
      (autoplay ? ' autoplay' : '') + '></video>';
  }

  // `key` addresses the clip for the click handler: "<listName>:<index>"
  function facade(v, key, poster) {
    const img = poster || v.poster;
    return '<button class="yt" data-play="' + key + '" aria-label="Play ' + (v.label || 'demo video') + '">' +
      (img ? '<img src="' + img + '" alt="" loading="lazy" decoding="async">' : '') +
      '<span class="yt-btn">' + svgFill('play') + '</span>' +
      '<span class="yt-cap">' + (v.label || 'Play demo') + '</span>' +
    '</button>';
  }

  function clipFor(key) {
    const [list, i] = key.split(':');
    if (list === 'featured') return GAMES_FEATURED.videos[+i];
    const p = AI_PROJECTS.find(x => x.slug === list);
    return p && p.videos[+i];
  }

  function slot(hint) {
    return '<div class="slot">' + svg('film', 1.3) + '<em>Demo slot</em>' +
      (hint ? '<code>' + hint + '</code>' : '') + '</div>';
  }

  /* ---------- split-text reveal ---------- */
  function split(el) {
    if (!el || el.dataset.split) return;
    el.dataset.split = '1';
    const frag = document.createDocumentFragment();
    let n = 0;
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(tok => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const i = document.createElement('i');
          i.textContent = tok;
          i.style.setProperty('--d', (n++ * 45) + 'ms');
          w.appendChild(i);
          frag.appendChild(w);
        });
      } else {
        const w = document.createElement('span');
        w.className = 'w';
        const i = document.createElement('i');
        i.style.setProperty('--d', (n++ * 45) + 'ms');
        i.appendChild(node.cloneNode(true));
        w.appendChild(i);
        frag.appendChild(w);
      }
    });
    el.innerHTML = '';
    el.appendChild(frag);
  }

  /* ---------- marquee ---------- */
  function buildMarquee() {
    const row = MARQUEE.map(t => '<span>' + t + '</span>').join('');
    $('#marquee').innerHTML = row + row;
  }

  /* ---------- work grid ---------- */
  const WIDE = [0, 1, 5, 6];

  function buildProjects() {
    $('#project-grid').innerHTML = AI_PROJECTS.map((p, i) =>
      '<button class="card' + (WIDE.indexOf(i) > -1 ? ' wide' : '') + ' rv" ' +
        'style="--c:' + p.accent + '" data-slug="' + p.slug + '" ' +
        'data-groups="' + p.groups.join(' ') + '" aria-haspopup="dialog">' +
        '<span class="card-idx">' + pad(i + 1) + ' / ' + pad(AI_PROJECTS.length) + '</span>' +
        '<div class="card-media">' +
          '<img src="' + p.img + '" alt="' + p.name + ' — ' + p.tagline + '" loading="lazy" decoding="async">' +
          '<span class="card-cat">' + p.category + '</span>' +
          (p.videos.length ? '<span class="card-demo">' + svgFill('play') +
            (p.videos.length > 1 ? p.videos.length + ' demos' : 'Demo') + '</span>' : '') +
        '</div>' +
        '<h3>' + p.name + '</h3>' +
        '<div class="card-tag">' + p.tagline + '</div>' +
        '<p>' + p.blurb + '</p>' +
        '<div class="pills">' + p.stack.slice(0, 3).map(s => '<span class="pill">' + s + '</span>').join('') +
          (p.stack.length > 3 ? '<span class="pill">+' + (p.stack.length - 3) + '</span>' : '') + '</div>' +
        '<span class="card-more">Case study ' + svg('arrow', 1.9) + '</span>' +
      '</button>').join('');

    const groups = [
      { id: 'all',   label: 'All' },
      { id: 'cv',    label: 'Computer Vision' },
      { id: 'twin',  label: 'Digital Twins & 3D' },
      { id: 'xr',    label: 'AR / VR' },
      { id: 'genai', label: 'Conversational AI' }
    ];
    $('#filters').innerHTML = groups.map(g => {
      const n = g.id === 'all' ? AI_PROJECTS.length
        : AI_PROJECTS.filter(p => p.groups.indexOf(g.id) > -1).length;
      return '<button class="chip' + (g.id === 'all' ? ' on' : '') + '" data-g="' + g.id + '">' +
        g.label + '<sup>' + n + '</sup></button>';
    }).join('');

    $('#filters').addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      $$('.chip', $('#filters')).forEach(c => c.classList.toggle('on', c === chip));
      const g = chip.dataset.g;
      $$('#project-grid .card').forEach(c => {
        c.classList.toggle('hide', !(g === 'all' || c.dataset.groups.split(' ').indexOf(g) > -1));
      });
    });
  }

  /* ---------- games ---------- */
  function buildGames() {
    const f = GAMES_FEATURED;
    const fv = f.videos || [];
    // vertical Shorts get phone-shaped frames rather than being pillarboxed into 16:9
    const featMedia = fv.length && fv[0].portrait
      ? '<div class="shorts">' + fv.map((v, i) =>
          '<figure class="short"><div class="short-frame">' + facade(v, 'featured:' + i) + '</div>' +
          '<figcaption>' + v.label + '</figcaption></figure>').join('') + '</div>'
      : '<div class="feat-media">' + (fv.length ? facade(fv[0], 'featured:0') : slot('assets/video/brawldinos.mp4')) + '</div>';

    $('#featured').innerHTML =
      '<div>' +
        '<span class="ribbon">' + svgFill('play') + 'Latest release · live on Google Play</span>' +
        '<h3>' + f.name + '</h3>' +
        '<p>' + f.blurb + '</p>' +
        '<div class="pills">' + f.stack.map(s => '<span class="pill">' + s + '</span>').join('') + '</div>' +
        '<a class="gplay" href="' + f.store + '" target="_blank" rel="noopener">' + svgFill('gplay') +
          '<span><small>Get it on</small><b>Google Play</b></span></a>' +
      '</div>' + featMedia;

    $('#games-grid').innerHTML = GAMES.map((g, i) =>
      '<article class="card' + (i < 2 ? ' wide' : '') + ' rv" style="--c:' + g.accent + ';cursor:default">' +
        '<span class="card-idx">' + g.where + '</span>' +
        (g.videos.length ? '<div class="card-media">' + embed(g.videos[0]) + '</div>' : '') +
        '<h3>' + g.name + '</h3>' +
        '<div class="card-tag">' + g.tagline + '</div>' +
        '<p>' + g.blurb + '</p>' +
        '<div class="pills">' + g.stack.map(s => '<span class="pill">' + s + '</span>').join('') + '</div>' +
      '</article>').join('');

    $('#also').innerHTML = ALSO_SHIPPED.map(n => '<span class="pill">' + n + '</span>').join('');
  }

  /* ---------- capabilities + trajectory ---------- */
  function buildSkills() {
    $('#skills-grid').innerHTML = SKILLS.map((s, i) =>
      '<div class="skill rv" style="--c:' + s.accent + '">' +
        '<span class="skill-n">' + pad(i + 1) + '</span>' +
        '<h3>' + s.title + '</h3>' +
        '<ul>' + s.items.map(x => '<li>' + x + '</li>').join('') + '</ul>' +
      '</div>').join('');
  }

  function buildTimeline() {
    $('#timeline').innerHTML = TIMELINE.map(t =>
      '<div class="tl-item rv">' +
        '<div><div class="tl-when">' + t.when + '</div>' +
          '<div class="tl-where">' + t.where.replace(' · ', '<br>') + '</div></div>' +
        '<div class="tl-body">' +
          '<h3>' + t.role + '</h3>' +
          '<p>' + t.blurb + '</p>' +
          '<div class="pills">' + t.tags.map(x => '<span class="pill">' + x + '</span>').join('') + '</div>' +
        '</div>' +
      '</div>').join('');
  }

  /* ---------- modal ---------- */
  const modal = $('#modal');
  const panel = $('#modal-panel');
  let lastFocus = null;
  let openProject = null;

  function openModal(slug) {
    const p = AI_PROJECTS.find(x => x.slug === slug);
    if (!p) return;
    lastFocus = document.activeElement;
    openProject = p;
    const vs = p.videos || [];

    let html = '<button class="modal-close" aria-label="Close">' + svg('close', 1.9) + '</button>' +
      '<div class="m-hero' + (vs.length ? ' is-video' : '') + '" id="m-stage">' +
        (vs.length ? facade(vs[0], p.slug + ':0', p.img)
                   : '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" decoding="async">') +
      '</div>' +
      (vs.length > 1
        ? '<div class="m-switch" style="--c:' + p.accent + '">' + vs.map((v, i) =>
            '<button class="' + (i === 0 ? 'on' : '') + '" data-i="' + i + '">' +
            pad(i + 1) + ' · ' + v.label + '</button>').join('') + '</div>'
        : '') +
      '<div class="m-body" style="--c:' + p.accent + '">' +
        '<h3 id="modal-title">' + p.name + '</h3>' +
        '<div class="m-tag">' + p.tagline + ' — ' + p.category + '</div>' +
        '<p class="m-lede">' + p.lede + '</p>';

    if (p.metrics) {
      html += '<div class="m-metrics">' + p.metrics.map(m =>
        '<div class="m-metric"><b>' + m.v + (m.u ? '<i>' + m.u + '</i>' : '') + '</b><span>' + m.label + '</span></div>'
      ).join('') + '</div>';
    }
    if (p.capabilities) {
      html += '<div class="m-h">Capabilities</div><div class="m-list">' + p.capabilities.map(c =>
        '<div><b>' + c.title + '</b><p>' + c.blurb + '</p></div>').join('') + '</div>';
    }
    if (p.steps) {
      html += '<div class="m-h">How it works</div><div class="m-steps">' + p.steps.map(s =>
        '<div class="m-step"><i>' + s.n + '</i><b>' + s.title + '</b><p>' + s.blurb + '</p></div>').join('') + '</div>';
    }
    if (p.impact) {
      html += '<div class="m-h">' + (p.metrics ? 'The platform' : 'Business impact') + '</div><div class="m-list">' +
        p.impact.map(c => '<div><b>' + c.title + '</b><p>' + c.blurb + '</p></div>').join('') + '</div>';
    }

    html += '<div class="m-h">Stack &amp; techniques</div>' +
      '<div class="m-pills">' + p.stack.map(s => '<span class="pill">' + s + '</span>').join('') + '</div>' +
      (p.scale ? '<div class="m-note">' + svg('info') + '<span>' + p.scale + '</span></div>' : '') +
      '<div class="m-note">' + svg('info') +
        '<span>Built at Ideofuzion as part of a product team. Deployment details available on request.</span>' +
      '</div></div>';

    panel.innerHTML = html;
    panel.scrollTop = 0;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    $('.modal-close', panel).focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    // kill the embed immediately, or it keeps playing audio through the fade-out
    const stage = $('#m-stage', panel);
    if (stage) stage.innerHTML = '';
    openProject = null;
    setTimeout(() => { panel.innerHTML = ''; }, 520);
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', e => {
    // facade -> real player
    const play = e.target.closest('.yt');
    if (play) {
      const clip = clipFor(play.dataset.play);
      if (clip) play.parentNode.innerHTML = embed(clip, true);
      return;
    }
    // switching clips implies intent, so go straight to the player
    const swap = e.target.closest('.m-switch button');
    if (swap && openProject) {
      $$('.m-switch button', panel).forEach(b => b.classList.toggle('on', b === swap));
      $('#m-stage', panel).innerHTML = embed(openProject.videos[+swap.dataset.i], true);
      return;
    }
    const card = e.target.closest('#project-grid .card');
    if (card) { openModal(card.dataset.slug); return; }
    if (e.target.closest('.modal-close') || e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  /* ---------- nav + progress ---------- */
  function initNav() {
    const nav = $('#nav'), bar = $('#progress');
    const links = $$('.nav-links a[href^="#"]');
    const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
    let tick = false;

    function onScroll() {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        nav.classList.toggle('stuck', window.scrollY > 24);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
        let cur = null;
        for (const s of sections) if (s.getBoundingClientRect().top <= 140) cur = s;
        links.forEach(a => a.classList.toggle('active', !!cur && a.getAttribute('href') === '#' + cur.id));
        tick = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    $('#burger').addEventListener('click', () => nav.classList.toggle('open'));
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- rotator ---------- */
  function initRotator() {
    const el = $('#rotator');
    el.innerHTML = ROLES.map((r, i) => '<span class="' + (i === 0 ? 'in' : '') + '">' + r + '</span>').join('');
    const items = $$('span', el);
    let i = 0;
    setInterval(() => {
      const prev = i;
      items[prev].classList.remove('in');
      items[prev].classList.add('out');
      i = (i + 1) % items.length;
      items[i].classList.remove('out');
      items[i].classList.add('in');
      setTimeout(() => items[prev].classList.remove('out'), 600);
    }, 3200);
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    $$('.split').forEach(split);
    if (!('IntersectionObserver' in window)) {
      $$('.rv,.split').forEach(el => el.classList.add('on'));
      return;
    }
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('on');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    $$('.rv,.split').forEach(el => io.observe(el));
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    $$('.btn,.gplay,.socials a').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / r.width;
        const dy = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = 'translate(' + (dx * 9).toFixed(2) + 'px,' + (dy * 6).toFixed(2) + 'px)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- boot ---------- */
  buildMarquee();
  buildProjects();
  buildGames();
  buildSkills();
  buildTimeline();
  initNav();
  initRotator();
  initReveal();
  initMagnetic();
  $('#year').textContent = new Date().getFullYear();
})();
