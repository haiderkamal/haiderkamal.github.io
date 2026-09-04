/* ============================================================
   Haider Kamal — portfolio behaviour
   Renders every section from assets/js/data.js, then wires
   nav, filters, modal, reveal-on-scroll and pointer effects.
   ============================================================ */

(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- icons ---------- */
  const I = {
    arrow:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
    ext:    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
    down:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    mail:   '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    pin:    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    play:   '<polygon points="6 3 20 12 6 21 6 3"/>',
    film:   '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 9h5M2 15h5M17 9h5M17 15h5"/>',
    close:  '<path d="M18 6 6 18M6 6l12 12"/>',
    info:   '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    li:     '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    be:     '<path d="M2 6h6.5a3 3 0 0 1 0 6H2zM2 12h7a3 3 0 0 1 0 6H2zM15 13h7a3.5 3.5 0 1 0-7 0v1a3.5 3.5 0 0 0 6 2"/><path d="M16 7h5"/>',
    sk:     '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    gplay:  '<path d="M3 2.5v19a1 1 0 0 0 1.5.87l14-9.5a1 1 0 0 0 0-1.74l-14-9.5A1 1 0 0 0 3 2.5Z"/>',
    eye:    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    chat:   '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    cube:   '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    gamepad:'<path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/><rect x="2" y="6" width="20" height="12" rx="6"/>',
    server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
    link:   '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
  };
  const svg = (n, w) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) +
    '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || '') + '</svg>';
  const svgFill = (n) => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + (I[n] || '') + '</svg>';

  /* ---------- media slot ---------- */
  function media(video, poster, hint) {
    if (video && video.type === 'youtube') {
      return '<iframe src="https://www.youtube-nocookie.com/embed/' + video.id +
        '?rel=0&modestbranding=1" title="Demo video" loading="lazy" allowfullscreen ' +
        'allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"></iframe>';
    }
    if (video && video.type === 'file') {
      return '<video src="' + video.src + '"' + (poster ? ' poster="' + poster + '"' : '') +
        ' controls playsinline preload="metadata"></video>';
    }
    if (poster) return '<img src="' + poster + '" alt="" loading="lazy" decoding="async">';
    return '<div class="slot">' + svg('film', 1.4) +
      '<div>Demo video slot</div>' + (hint ? '<code>' + hint + '</code>' : '') + '</div>';
  }

  /* ---------- marquee ---------- */
  function buildMarquee() {
    const row = MARQUEE.map(t => '<span>' + t + '</span>').join('');
    $('#marquee').innerHTML = row + row;
  }

  /* ---------- project cards ---------- */
  function cardHTML(p, i) {
    return '' +
      '<button class="card rv" style="--c:' + p.accent + ';transition-delay:' + (i % 3) * 70 + 'ms" ' +
        'data-slug="' + p.slug + '" data-groups="' + p.groups.join(' ') + '" aria-haspopup="dialog">' +
        '<div class="card-media">' +
          '<span class="tag-cat">' + p.category + '</span>' +
          (p.video ? '<span class="has-demo">' + svgFill('play') + 'Demo</span>' : '') +
          '<img src="' + p.img + '" alt="' + p.name + ' — ' + p.tagline + '" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="card-body">' +
          '<h3>' + p.name + '</h3>' +
          '<div class="card-tag">' + p.tagline + '</div>' +
          '<p>' + p.blurb + '</p>' +
          '<div class="pills">' + p.stack.slice(0, 3).map(s => '<span class="pill">' + s + '</span>').join('') +
            (p.stack.length > 3 ? '<span class="pill">+' + (p.stack.length - 3) + '</span>' : '') + '</div>' +
          '<span class="card-more">Case study ' + svg('arrow', 2) + '</span>' +
        '</div>' +
      '</button>';
  }

  function buildProjects() {
    $('#project-grid').innerHTML = AI_PROJECTS.map(cardHTML).join('');

    const groups = [
      { id: 'all',   label: 'All work' },
      { id: 'cv',    label: 'Computer Vision' },
      { id: 'twin',  label: 'Digital Twins & 3D' },
      { id: 'xr',    label: 'AR / VR' },
      { id: 'genai', label: 'Conversational AI' }
    ];
    $('#filters').innerHTML = groups.map(g => {
      const n = g.id === 'all' ? AI_PROJECTS.length
        : AI_PROJECTS.filter(p => p.groups.indexOf(g.id) > -1).length;
      return '<button class="chip' + (g.id === 'all' ? ' on' : '') + '" data-g="' + g.id + '">' +
        g.label + '<span class="n">' + n + '</span></button>';
    }).join('');

    $('#filters').addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      $$('.chip', $('#filters')).forEach(c => c.classList.toggle('on', c === chip));
      const g = chip.dataset.g;
      $$('#project-grid .card').forEach(c => {
        const show = g === 'all' || c.dataset.groups.split(' ').indexOf(g) > -1;
        c.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---------- games ---------- */
  function buildGames() {
    const f = GAMES_FEATURED;
    $('#featured').innerHTML = '' +
      '<div class="featured-body">' +
        '<span class="ribbon">' + svgFill('play') + 'Latest release · Live on Google Play</span>' +
        '<h3>' + f.name + '</h3>' +
        '<p>' + f.blurb + '</p>' +
        '<div class="pills">' + f.stack.map(s => '<span class="pill">' + s + '</span>').join('') + '</div>' +
        '<a class="gplay" href="' + f.store + '" target="_blank" rel="noopener">' + svgFill('gplay') +
          '<span><small>GET IT ON</small>Google Play</span></a>' +
      '</div>' +
      '<div class="feat-media">' + media(f.video, null, 'assets/video/brawldinos.mp4') + '</div>';

    $('#games-grid').innerHTML = GAMES.map((g, i) =>
      '<article class="card rv" style="--c:' + g.accent + ';cursor:default;transition-delay:' + (i % 3) * 70 + 'ms">' +
        '<div class="card-media">' +
          '<span class="tag-cat">' + g.where + '</span>' +
          media(g.video, null, 'assets/video/' + g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.mp4') +
        '</div>' +
        '<div class="card-body">' +
          '<h3>' + g.name + '</h3>' +
          '<div class="card-tag">' + g.tagline + '</div>' +
          '<p>' + g.blurb + '</p>' +
          '<div class="pills">' + g.stack.map(s => '<span class="pill">' + s + '</span>').join('') + '</div>' +
        '</div>' +
      '</article>').join('');

    $('#also').innerHTML = ALSO_SHIPPED.map(n => '<span class="pill">' + n + '</span>').join('');
  }

  /* ---------- skills + timeline ---------- */
  function buildSkills() {
    $('#skills-grid').innerHTML = SKILLS.map((s, i) =>
      '<div class="skill rv" style="--c:' + s.accent + ';transition-delay:' + (i % 3) * 70 + 'ms">' +
        '<div class="skill-ico">' + svg(s.icon) + '</div>' +
        '<h3>' + s.title + '</h3>' +
        '<ul>' + s.items.map(x => '<li>' + x + '</li>').join('') + '</ul>' +
      '</div>').join('');
  }

  function buildTimeline() {
    $('#timeline').innerHTML = TIMELINE.map(t =>
      '<div class="tl-item rv">' +
        '<div class="tl-when">' + t.when + '</div>' +
        '<h3>' + t.role + '</h3>' +
        '<div class="tl-where">' + t.where + '</div>' +
        '<p>' + t.blurb + '</p>' +
        '<div class="tl-tags">' + t.tags.map(x => '<span>' + x + '</span>').join('') + '</div>' +
      '</div>').join('');
  }

  /* ---------- modal ---------- */
  const modal = $('#modal');
  const panel = $('#modal-panel');
  let lastFocus = null;

  function openModal(slug) {
    const p = AI_PROJECTS.find(x => x.slug === slug);
    if (!p) return;
    lastFocus = document.activeElement;

    let html = '<button class="modal-close" aria-label="Close">' + svg('close', 2) + '</button>' +
      '<div class="m-hero' + (p.video ? ' is-video' : '') + '">' + media(p.video, p.img, 'assets/video/' + p.slug + '.mp4') + '</div>' +
      '<div class="m-body" style="--c:' + p.accent + '">' +
        '<h3 id="modal-title">' + p.name + '</h3>' +
        '<div class="m-tag">' + p.tagline + '</div>' +
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
        '<span>Built at Ideofuzion as part of a product team. Screens shown are from the product deck; ' +
        'deployment details available on request.</span></div>' +
      '</div>';

    panel.innerHTML = html;
    panel.scrollTop = 0;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    $('.modal-close', panel).focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { panel.innerHTML = ''; }, 340);
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', e => {
    const card = e.target.closest('#project-grid .card');
    if (card) { openModal(card.dataset.slug); return; }
    if (e.target.closest('.modal-close') || e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  /* ---------- nav ---------- */
  function initNav() {
    const nav = $('#nav');
    const links = $$('.nav-links a[href^="#"]');
    const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const bar = $('#progress');

    function onScroll() {
      nav.classList.toggle('stuck', window.scrollY > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
      let cur = sections[0];
      for (const s of sections) if (s.getBoundingClientRect().top <= 120) cur = s;
      links.forEach(a => a.classList.toggle('active', cur && a.getAttribute('href') === '#' + cur.id));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    $('#burger').addEventListener('click', () => nav.classList.toggle('open'));
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- role rotator ---------- */
  function initRotator() {
    const el = $('#rotator');
    el.innerHTML = ROLES.map((r, i) => '<span class="' + (i === 0 ? 'in' : '') + '">' + r + '</span>').join('');
    const items = $$('span', el);
    let i = 0;
    setInterval(() => {
      items[i].classList.replace('in', 'out');
      const prev = i;
      i = (i + 1) % items.length;
      items[i].classList.remove('out');
      items[i].classList.add('in');
      setTimeout(() => items[prev].classList.remove('out'), 520);
    }, 3000);
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.rv').forEach(el => el.classList.add('on'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    $$('.rv').forEach(el => io.observe(el));
  }

  /* ---------- pointer spotlight on cards ---------- */
  function initSpotlight() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.addEventListener('pointermove', e => {
      const c = e.target.closest('.card');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
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
  initSpotlight();
  $('#year').textContent = new Date().getFullYear();
})();
