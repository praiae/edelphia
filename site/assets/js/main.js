/* =========================================================
   EDELPHIA — interactions & motion
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => innerWidth <= 900;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'expo.out', duration: 1.2 });

  /* ---------- text splitting ---------- */
  function splitChars(el) {
    const text = el.textContent.trim();
    el.innerHTML = [...text].map(c => `<span class="chw"><span class="ch">${c === ' ' ? '&nbsp;' : c}</span></span>`).join('');
    return $$('.ch', el);
  }
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    return $$('.w', el);
  }
  function splitLines(el) {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(p => `<span class="ln"><span>${p.trim()}</span></span>`).join('');
    return $$('.ln > span', el);
  }

  /* ---------- language (PT / EN) ---------- */
  const I18N = window.EDELPHIA_I18N;
  const LANG_KEY = 'edelphia-lang';
  let lang = (() => {
    let saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* storage blocked */ }
    if (saved === 'pt' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  })();
  const t = key => I18N[lang][key] ?? I18N.pt[key] ?? '';
  const locale = () => (lang === 'pt' ? 'pt-PT' : 'en-GB');

  function applyCopy() {
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.desc'));
    $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('[data-i18n-cursor]').forEach(el => el.setAttribute('data-cursor', t(el.dataset.i18nCursor)));
    $$('[data-scramble]').forEach(el => { el.dataset.label = el.textContent; });
  }
  applyCopy();

  const heroChars = splitChars($('.hero__title .split-chars'));

  // split-text animations are rebuilt whenever the language changes
  let manifestoTween = null;
  let lineTweens = [];
  const killTween = tw => { if (tw) { if (tw.scrollTrigger) tw.scrollTrigger.kill(); tw.kill(); } };

  function buildManifesto() {
    killTween(manifestoTween);
    manifestoTween = gsap.to(splitWords($('.manifesto__text')), {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: '.manifesto__text', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 },
    });
  }
  function buildLines() {
    lineTweens.forEach(killTween);
    lineTweens = $$('.split-lines').map(el => gsap.from(splitLines(el), {
      yPercent: 110, rotate: 3, duration: 1.6, stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    }));
  }

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.8, easing: t => 1 - Math.pow(1 - t, 4) });
    else (typeof target === 'string' ? $(target) : target)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  /* ---------- particle field ---------- */
  let field = null;
  try {
    field = new window.EdelphiaField($('.field'), { count: isMobile() ? 11000 : 22000 });
  } catch (err) {
    console.warn('WebGL indisponível — a continuar sem o campo de partículas.', err);
  }

  /* ---------- scenes (scroll → shape + framing) ----------
     A section's data-stage picks a scene by name. shape: 0 Φ · 1 galaxy · 2 sphere · 3 wave · 4 Φ.
     Text-heavy scenes push the cloud back and dim it so copy stays readable. */
  const SCENES = {
    hero:      { shape: 0, pos: [0, 0.78, 0],   scale: 0.7,  mpos: [0, 0.7, 0],  mscale: 0.66, dim: 1 },
    manifesto: { shape: 1, pos: [1.6, 0, -1],   scale: 1,    mpos: [0, 0, -1.5], mscale: 0.9,  dim: 1 },
    vision:    { shape: 1, pos: [-2.4, 0, -3],  scale: 1,    mpos: [0, 0, -3],   mscale: 0.9,  dim: 0.5 },
    mission:   { shape: 2, pos: [2.2, 0, -2.5], scale: 1,    mpos: [0, 0, -2.5], mscale: 0.8,  dim: 0.45 },
    pillars:   { shape: 2, pos: [0, 0, -0.5],   scale: 1,    mpos: [0, 0, -0.5], mscale: 0.8,  dim: 0.85 },
    solutions: { shape: 3, pos: [0, -0.4, 0],   scale: 1,    mpos: [0, 0, 0],    mscale: 1,    dim: 0.75 },
    method:    { shape: 2, pos: [0, 0, -0.5],   scale: 1,    mpos: [0, 0, -0.5], mscale: 0.8,  dim: 0.85 },
    equation:  { shape: 3, pos: [0, 0, 0],      scale: 1,    mpos: [0, 0, 0],    mscale: 1,    dim: 1 },
    contact:   { shape: 4, pos: [0, 0, -1],     scale: 1.35, mpos: [0, 0, -1],   mscale: 1,    dim: 0.38 },
  };
  let currentStage = 'hero';
  const stageNum = $('[data-stage-num]');
  const stageName = $('[data-stage-name]');

  function setStage(name, instant) {
    if (name === currentStage && !instant) return;
    currentStage = name;
    const s = SCENES[name];
    stageNum.textContent = String(s.shape + 1).padStart(2, '0');
    scrambleTo(stageName, t('stages')[s.shape].toUpperCase());
    if (!field) return;
    const m = isMobile();
    const p = m ? s.mpos : s.pos;
    const sc = m ? s.mscale : s.scale;
    const d = instant ? 0 : 2.4;
    gsap.to(field.progress, { value: s.shape, duration: d, ease: 'power2.inOut', overwrite: true });
    gsap.to(field.offset, { x: p[0], y: p[1], z: p[2], duration: d, ease: 'power3.inOut', overwrite: true });
    gsap.to(field.group.scale, { x: sc, y: sc, z: sc, duration: d, ease: 'power3.inOut', overwrite: true });
    gsap.to(field.dim, { value: s.dim, duration: d, ease: 'power2.inOut', overwrite: true });
  }

  /* ---------- text scramble ---------- */
  const GLYPHS = 'ΦΣΔΩλ∂∫01<>/#*+=';
  function scrambleTo(el, finalText) {
    if (reduced) { el.textContent = finalText; return; }
    const from = el.textContent;
    const len = Math.max(from.length, finalText.length);
    const queue = [];
    for (let i = 0; i < len; i++) {
      const start = Math.floor(Math.random() * 12);
      queue.push({ from: from[i] || '', to: finalText[i] || '', start, end: start + 8 + Math.floor(Math.random() * 14) });
    }
    cancelAnimationFrame(el._raf);
    let frame = 0;
    const update = () => {
      let out = '', done = 0;
      for (const q of queue) {
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else out += q.from;
      }
      el.textContent = out;
      if (done < queue.length) { frame++; el._raf = requestAnimationFrame(update); }
    };
    update();
  }
  $$('[data-scramble]').forEach(el => {
    el.addEventListener('mouseenter', () => scrambleTo(el, el.dataset.label));
  });

  /* ---------- cursor ---------- */
  if (finePointer && !reduced) {
    const cursor = $('.cursor');
    const ring = $('.cursor__ring');
    const dot = $('.cursor__dot');
    const label = $('.cursor__label');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    addEventListener('pointermove', e => { pos.x = e.clientX; pos.y = e.clientY; }, { passive: true });
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('a, button, [data-tilt], [data-cursor]');
      if (!t) return;
      const text = t.getAttribute('data-cursor');
      cursor.classList.toggle('is-label', !!text);
      cursor.classList.toggle('is-hover', !text);
      label.textContent = text || '';
    });
    document.addEventListener('pointerout', e => {
      const t = e.target.closest('a, button, [data-tilt], [data-cursor]');
      if (t && !t.contains(e.relatedTarget)) cursor.classList.remove('is-hover', 'is-label');
    });
    document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
  }

  /* ---------- magnetic elements ---------- */
  if (finePointer && !reduced) {
    $$('[data-magnetic]').forEach(el => {
      const strength = el.classList.contains('btn--big') ? 0.35 : 0.25;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * strength);
        yTo((e.clientY - r.top - r.height / 2) * strength);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- tilt cards ---------- */
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach(card => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        rx((0.5 - py) * 12);
        ry((px - 0.5) * 14);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- nav ---------- */
  const nav = $('.nav');
  const burger = $('.nav__burger');
  const menu = $('.menu');
  let lastY = 0;
  function onScroll(y) {
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !menu.classList.contains('is-open'));
    lastY = y;
  }
  if (lenis) lenis.on('scroll', e => onScroll(e.scroll));
  else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  function toggleMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('is-open')));

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (menu.classList.contains('is-open')) toggleMenu(false);
    scrollTo(target);
  }));

  /* ---------- section-driven triggers (nav state, stages, progress) ---------- */
  function buildSectionTriggers() {
    $$('.nav__links a').forEach(a => {
      const sec = $(a.getAttribute('href'));
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 50%', end: 'bottom 50%',
        onToggle: self => a.classList.toggle('is-active', self.isActive),
      });
    });

    $$('[data-stage]').forEach(sec => {
      const n = sec.dataset.stage;
      ScrollTrigger.create({
        trigger: sec, start: 'top 60%', end: 'bottom 40%',
        onEnter: () => setStage(n), onEnterBack: () => setStage(n),
      });
    });

    gsap.to('.progress span', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }

  /* ---------- HUD: Φ(t) accumulates with time and attention ---------- */
  const phiEl = $('[data-phi]');
  let phiValue = 0;
  gsap.ticker.add((time, delta) => {
    const v = lenis ? Math.abs(lenis.velocity) : 0;
    phiValue += (delta / 1000) * (0.0137 + v * 0.0009);
    phiEl.textContent = phiValue.toFixed(5);
  });

  /* ---------- scroll reveals ---------- */
  const counters = [];
  const renderCounter = c => {
    c.el.textContent = c.v.toLocaleString(locale(), { minimumFractionDigits: c.dec, maximumFractionDigits: c.dec });
  };

  function buildReveals() {
    // generic fade-up (hero ones are handled by the intro)
    $$('.reveal-up').filter(el => !el.closest('.hero')).forEach(el => {
      gsap.from(el, { y: 50, opacity: 0, duration: 1.4, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    $$('.section-tag').forEach(el => {
      gsap.from(el, { x: -30, opacity: 0, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    buildLines();
    buildManifesto();   // words light up as you read

    // vision: the big Φ drifts slowly against the scroll
    gsap.to('.vision__phi', { yPercent: -30, rotate: -8, ease: 'none', scrollTrigger: { trigger: '.vision', start: 'top bottom', end: 'bottom top', scrub: true } });

    // objectives: each row draws its rule and rises in
    $$('.obj').forEach(o => {
      gsap.from(o.children, { y: 40, opacity: 0, stagger: 0.08, duration: 1.3, scrollTrigger: { trigger: o, start: 'top 85%' } });
      ScrollTrigger.create({ trigger: o, start: 'top 70%', onEnter: () => o.classList.add('is-in') });
    });

    gsap.from('.caps__list', { y: 40, opacity: 0, duration: 1.4, scrollTrigger: { trigger: '.caps', start: 'top 85%' } });
    gsap.from('.social', { scale: 0, rotate: -90, opacity: 0, stagger: 0.08, duration: 1.4, scrollTrigger: { trigger: '.socials', start: 'top 92%' } });

    // pillars cards
    gsap.from('.card', {
      y: 120, opacity: 0, rotationX: -18, duration: 1.6, stagger: 0.14,
      scrollTrigger: { trigger: '.pillars__grid', start: 'top 85%' },
    });

    // equation glyphs
    gsap.from('.eq', {
      yPercent: 60, opacity: 0, filter: 'blur(12px)', duration: 1.6, stagger: 0.09,
      scrollTrigger: { trigger: '.equation__formula', start: 'top 85%' },
    });

    // stats
    $$('[data-counter]').forEach(el => {
      const target = parseFloat(el.dataset.counter);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const c = { el, dec, v: 0 };
      counters.push(c);
      gsap.to(c, {
        v: target, duration: 2.6, ease: 'power3.out',
        onUpdate: () => renderCounter(c),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
    gsap.from('.stat', { y: 40, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: '.numbers__grid', start: 'top 88%' } });

    // footer wordmark draws itself
    const ftl = gsap.timeline({ scrollTrigger: { trigger: '.footer', start: 'top 80%' } });
    ftl.to('.footer__word path', { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' })
       .to('.footer__word path', { fill: '#F2F5F9', strokeOpacity: 0, duration: 1.2, ease: 'power2.out' }, '-=0.6')
       .to('.footer__dot', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.8');
  }

  /* ---------- horizontal method ---------- */
  function buildHorizontal() {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const track = $('.method__track');
      const getDist = () => Math.max(0, $('.method__intro').offsetWidth + track.scrollWidth - innerWidth);
      const tween = gsap.to(['.method__intro', track], {
        x: () => -getDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.method', pin: '.method__pin', start: 'top top',
          end: () => '+=' + getDist(), scrub: 0.8, invalidateOnRefresh: true,
        },
      });
      // each step lifts in as it crosses the viewport
      $$('.step').forEach(step => {
        gsap.from(step, {
          y: 80, opacity: 0.2, rotate: 2, ease: 'power2.out',
          scrollTrigger: { trigger: step, containerAnimation: tween, start: 'left 95%', end: 'left 55%', scrub: true },
        });
      });
      return () => gsap.set(['.method__intro', track], { x: 0 });
    });
    mm.add('(max-width: 900px)', () => {
      $$('.step').forEach(step => gsap.from(step, { y: 60, opacity: 0, scrollTrigger: { trigger: step, start: 'top 90%' } }));
    });
  }

  /* ---------- end-to-end pipeline: the rail fills, nodes light up in order ---------- */
  function buildPipeline() {
    const nodes = $$('.node');
    const fill = $('.pipeline__fill');
    const mm = gsap.matchMedia();
    mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, ctx => {
      const { desk } = ctx.conditions;
      ScrollTrigger.create({
        trigger: '.pipeline', start: desk ? 'top 78%' : 'top 70%', end: desk ? 'top 30%' : 'bottom 55%',
        onUpdate: self => {
          const p = self.progress;
          gsap.to(fill, desk ? { scaleX: p, scaleY: 1, duration: 0.4, overwrite: true } : { scaleY: p, scaleX: 1, duration: 0.4, overwrite: true });
          nodes.forEach((n, i) => n.classList.toggle('is-on', p > 0 && p >= i / (nodes.length - 1) - 0.001));
        },
      });
    });
    gsap.from(nodes, { y: 40, opacity: 0, stagger: 0.08, duration: 1.2, scrollTrigger: { trigger: '.pipeline', start: 'top 88%' } });
  }

  /* ---------- language switch (no reload: copy swaps, split-text rebuilds) ---------- */
  function setLang(next) {
    if (next === lang) return;
    lang = next;
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage blocked */ }
    document.body.classList.add('is-switching');
    setTimeout(() => {
      applyCopy();
      buildManifesto();
      buildLines();
      counters.forEach(renderCounter);
      stageName.textContent = t('stages')[SCENES[currentStage].shape].toUpperCase();
      ScrollTrigger.refresh();
      requestAnimationFrame(() => document.body.classList.remove('is-switching'));
    }, 340);
  }
  $('[data-lang-toggle]').addEventListener('click', () => setLang(lang === 'pt' ? 'en' : 'pt'));

  /* ---------- the integral chart ---------- */
  function buildChart() {
    const W = 1000, H = 360, PAD = 20, N = 240;
    const k = t => 0.18 + 0.5 * t + 0.1 * Math.sin(t * 9.5) + 0.05 * Math.sin(t * 23 + 1) + 0.12 * t * t;
    const pts = [], cum = [0];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      pts.push([t * W, H - PAD - Math.min(k(t), 1.05) * (H - PAD * 2)]);
      if (i) cum.push(cum[i - 1] + k(t) / N);
    }
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    $('.chart__line').setAttribute('d', d);
    $('.chart__ghost').setAttribute('d', d);
    $('.chart__area').setAttribute('d', d + ` L${W} ${H} L0 ${H} Z`);

    const grid = $('.chart__grid');
    let g = '';
    for (let i = 1; i < 10; i++) g += `<line x1="${i * 100}" x2="${i * 100}" y1="0" y2="${H}"/>`;
    for (let i = 1; i < 4; i++) g += `<line x1="0" x2="${W}" y1="${i * 90}" y2="${i * 90}"/>`;
    grid.innerHTML = g;

    const clip = $('.chart__clip');
    const cursorLine = $('.chart__cursor');
    const dot = $('.chart__dot');
    const tOut = $('[data-chart-t]');
    const phiOut = $('[data-chart-phi]');
    const svg = $('.chart__svg');

    const render = p => {
      const i = Math.round(p * N);
      const x = p * W;
      clip.setAttribute('width', x);
      cursorLine.setAttribute('x1', x); cursorLine.setAttribute('x2', x);
      dot.style.left = (p * 100) + '%';
      dot.style.top = (pts[i][1] / H * svg.getBoundingClientRect().height) + 'px';
      tOut.textContent = (p * 10).toFixed(2);
      phiOut.textContent = cum[i].toFixed(3);
    };
    render(0);
    ScrollTrigger.create({
      trigger: '.chart', start: 'top 80%', end: 'bottom 35%', scrub: 0.6,
      onUpdate: self => render(self.progress),
    });
  }

  /* ---------- marquee reacts to scroll velocity ---------- */
  function buildMarquee() {
    const tweens = $$('.marquee__row').map(row => {
      const dir = +row.dataset.dir;
      const inner = $('.marquee__inner', row);
      gsap.set(inner, { xPercent: dir > 0 ? 0 : -50 });
      return gsap.to(inner, { xPercent: dir > 0 ? -50 : 0, duration: 38, ease: 'none', repeat: -1 });
    });
    if (reduced) { tweens.forEach(t => t.pause()); return; }
    let boost = 1, sign = 1;
    gsap.ticker.add(() => {
      const v = lenis ? lenis.velocity : 0;
      if (Math.abs(v) > 0.5) sign = Math.sign(v);
      boost += ((1 + Math.min(Math.abs(v) * 0.25, 10)) - boost) * 0.08;
      tweens.forEach(t => t.timeScale(boost * sign));
      gsap.set('.marquee__inner', { skewX: gsap.utils.clamp(-8, 8, -v * 0.35) });
    });
  }

  /* ---------- intro sequence ---------- */
  function intro() {
    const count = $('[data-count]');
    const counter = { v: 0 };
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

    gsap.set(heroChars, { yPercent: 115, rotate: 8 });
    gsap.set($$('.hero .reveal-up'), { y: 30, opacity: 0 });

    tl.to('.loader__lines path', { strokeDashoffset: 0, duration: 1.5, stagger: 0.15 })
      .to('.loader__orbit', { strokeDashoffset: 0, duration: 1.3 }, 0.3)
      .to(counter, {
        v: 100, duration: 2, ease: 'power2.inOut',
        onUpdate: () => { count.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
      }, 0)
      .to('.loader__fill', { opacity: 1, duration: 0.8 }, 1.3)
      .to('.loader__lines', { opacity: 0, duration: 0.6 }, 1.6)
      .to('.loader__curtain', { scaleY: 1, duration: 0.9, ease: 'expo.inOut' }, 2.2)
      .set('.loader', { background: 'transparent' })
      .set('.loader__inner', { autoAlpha: 0 })
      .set('.loader__curtain', { transformOrigin: 'top' })
      .add(() => {
        document.body.classList.remove('is-loading');
        if (lenis) lenis.start();
        setStage('hero', true);
        if (field) gsap.to(field.intro, { value: 1, duration: 3.6, ease: 'power2.out' });
      })
      .to('.loader__curtain', { scaleY: 0, duration: 1.1, ease: 'expo.inOut' })
      .set('.loader', { display: 'none' })
      .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.6, stagger: 0.06, ease: 'expo.out' }, '-=0.8')
      .to($$('.hero .reveal-up'), { y: 0, opacity: 1, duration: 1.4, stagger: 0.1, ease: 'expo.out' }, '-=1.3')
      .from('.nav > *', { y: -40, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' }, '<')
      .to('.hud', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '<');

    if (reduced) tl.progress(1);
  }

  /* ---------- hero parallax on scroll ---------- */
  function buildHeroScroll() {
    gsap.to('.hero__title', {
      yPercent: -40, opacity: 0, letterSpacing: '0.18em', ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(['.hero__top', '.hero__bottom'], {
      y: -80, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: '20% top', end: '80% top', scrub: true },
    });
  }

  /* ---------- boot ---------- */
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1200))]).then(() => {
    // the pinned section goes first so every trigger below it accounts for the pin spacing
    buildHorizontal();
    buildHeroScroll();
    buildReveals();
    buildPipeline();
    buildChart();
    buildMarquee();
    buildSectionTriggers();
    ScrollTrigger.refresh();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else scrollTo(0);
    intro();
  });

  addEventListener('resize', () => setStage(currentStage, true));
})();
