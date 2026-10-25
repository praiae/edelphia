/* =========================================================
   EDELPHIA — local site assistant
   Runs entirely in the browser: no server, no API, no data sent anywhere.
   Matches the visitor's question to an intent in assistant-kb.js
   (accent-insensitive, light stemming, typo-tolerant) and answers in PT or EN.
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const root = $('[data-chat]');
  const KB = window.EDELPHIA_KB;
  if (!root || !KB) return;

  const site = window.edelphia;
  const BY_ID = Object.fromEntries(KB.map(i => [i.id, i]));
  const fab = $('[data-chat-toggle]', root);
  const panel = $('.chat__panel', root);
  const log = $('[data-chat-log]', root);
  const suggest = $('[data-chat-suggest]', root);
  const form = $('[data-chat-form]', root);
  const input = $('[data-chat-input]', root);
  const sendBtn = $('.chat__send', root);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = () => matchMedia('(max-width: 640px)').matches;

  /* =========================================================
     Matching engine
     ========================================================= */
  const norm = s => s.toLowerCase()
    .replace(/φ|Φ/g, ' phi ')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();

  const SUFFIXES = ['mente', 'idades', 'idade', 'coes', 'cao', 'oes', 'ais', 'eis', 'ing', 'ers', 'ies', 'es', 's'];
  const stem = w => {
    if (w.length <= 4) return w;
    for (const suf of SUFFIXES) if (w.endsWith(suf) && w.length - suf.length >= 3) return w.slice(0, -suf.length);
    return w;
  };

  const STOP = new Set(('a o os as um uma uns umas de do da dos das no na nos nas em ao aos e ou que se por para com sem como mais muito ' +
    'me te lhe eu tu ele ela nos vos eles elas meu minha seu sua este esta isto esse essa isso aquele aquela qual quais ' +
    'the an of to in on at for with and or is are was be it this that these those i you he she we they my your our ' +
    'do does did can could would should will what which who how why when about tell please pode podes poderia quero gostaria saber').split(' '));

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diag = prev[0];
      prev[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = prev[j];
        prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
        diag = tmp;
      }
    }
    return prev[b.length];
  }

  // pre-index every key: phrase or single stemmed word, strong or weak (~)
  const INDEX = KB.map(intent => ({
    intent,
    keys: intent.keys.map(raw => {
      const weak = raw.startsWith('~');
      const k = norm(weak ? raw.slice(1) : raw);
      return { k, weak, phrase: k.includes(' '), stem: stem(k) };
    }),
  }));
  const MORE = new Set(window.EDELPHIA_KB_MORE_KEYS.map(norm));

  // how well one word of the question matches one single-word key
  function wordScore(t, key) {
    if (t === key.stem) return key.k.length >= 6 ? 2.5 : 2;
    if (key.stem.length >= 4 && t.length >= 4 && (t.startsWith(key.stem) || key.stem.startsWith(t))) return 1.2;
    if (key.stem.length >= 5 && lev(t, key.stem) <= 1) return 1;
    return 0;
  }

  function scoreIntents(text) {
    const n = ` ${norm(text)} `;
    const stems = n.trim().split(' ').filter(w => w && !STOP.has(w)).map(stem);
    let best = null;
    for (const { intent, keys } of INDEX) {
      let score = 0;
      // phrases: each matching phrase counts
      for (const key of keys) {
        if (key.phrase && n.includes(` ${key.k} `)) score += (2 + key.k.split(' ').length) * (key.weak ? 0.35 : 1);
      }
      // words: each word of the question counts once, by its best-matching key
      for (const t of stems) {
        let s = 0;
        for (const key of keys) if (!key.phrase) s = Math.max(s, wordScore(t, key) * (key.weak ? 0.35 : 1));
        score += s;
      }
      if (score > 0 && (!best || score > best.score)) best = { intent, score };
    }
    // very short questions ("what is AI?") carry little signal, so accept a weaker match
    const threshold = stems.length <= 2 ? 0.6 : 1.5;
    return best && best.score >= threshold ? best.intent : null;
  }

  // answer in the language the visitor writes in; fall back to the page language
  // ("me" is left out: it is both Portuguese and English)
  const PT_WORDS = new Set('que como qual quais onde voces vcs fazem faz sao nao sim obrigado obrigada ola tem empresa posso quero sobre isso uma dos das para com mim explica explique diz diga fala fale conta mais tambem solucoes visao missao contacto'.split(' '));
  const EN_WORDS = new Set('what how which where you your the is are do does can about company thanks thank hello tell and of with for explain show more vision mission solutions contact who'.split(' '));
  function detectLang(text) {
    if (/[ãõçáéíóúâêô]/i.test(text)) return 'pt';
    let pt = 0, en = 0;
    for (const w of norm(text).split(' ')) { if (PT_WORDS.has(w)) pt++; if (EN_WORDS.has(w)) en++; }
    if (pt > en) return 'pt';
    if (en > pt) return 'en';
    const lastBot = [...history].reverse().find(m => m.role === 'bot');   // keep the conversation's language
    return lastBot ? lastBot.lang : site.lang;
  }

  /* =========================================================
     Rendering (tiny, safe markdown)
     ========================================================= */
  const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inline = s => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((#[\w-]+)\)/g, '<a href="$2" class="msg__jump">$1<span aria-hidden="true">↘</span></a>');

  function markdown(src) {
    const out = [];
    let list = null;
    const flush = () => { if (list) { out.push(`<${list.tag}>${list.items.join('')}</${list.tag}>`); list = null; } };
    for (const line of escapeHtml(src.trim()).split('\n')) {
      const ul = line.match(/^\s*[-•]\s+(.*)/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)/);
      const item = ul || ol;
      if (item) {
        const tag = ul ? 'ul' : 'ol';
        if (!list || list.tag !== tag) { flush(); list = { tag, items: [] }; }
        list.items.push(`<li>${inline(item[1])}</li>`);
      } else {
        flush();
        if (line.trim()) out.push(`<p>${inline(line)}</p>`);
      }
    }
    flush();
    return out.join('');
  }

  const scrollLog = () => { log.scrollTop = log.scrollHeight; };

  function addMsg(role, html) {
    const msg = document.createElement('div');
    msg.className = `msg msg--${role}`;
    msg.innerHTML = `<div class="msg__body">${html}</div>`;
    log.appendChild(msg);
    scrollLog();
    return msg;
  }

  function addNext(msg, ids, lang) {
    const valid = (ids || []).filter(id => BY_ID[id]);
    if (!valid.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'msg__next';
    wrap.innerHTML = valid.map(id => `<button type="button" data-intent="${id}">${escapeHtml(BY_ID[id].q[lang])}</button>`).join('');
    msg.appendChild(wrap);
  }

  /* =========================================================
     Conversation
     ========================================================= */
  const STORE_KEY = 'edelphia-chat-local';
  let history = [];            // [{ role: 'user' | 'bot', text, next?, lang }]
  let lastIntent = null;
  let typing = false;

  function save() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ history: history.slice(-30), lastIntent })); } catch (e) { /* storage blocked */ }
  }
  function restore() {
    try {
      const data = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
      if (data && Array.isArray(data.history)) { history = data.history; lastIntent = data.lastIntent || null; }
    } catch (e) { history = []; }
    history.forEach(m => {
      const msg = addMsg(m.role, m.role === 'user' ? escapeHtml(m.text) : markdown(m.text));
      if (m.role === 'bot') addNext(msg, m.next, m.lang);
    });
    suggest.hidden = history.length > 0;
  }

  // work out the reply for a free-text question (or a chip's intent id)
  function reply(text, forcedId) {
    const lang = forcedId ? site.lang : detectLang(text);
    const normalized = norm(text);

    if (!forcedId && lastIntent && (MORE.has(normalized) || [...MORE].some(m => normalized.startsWith(m + ' ') && normalized.split(' ').length <= 4))) {
      const prev = BY_ID[lastIntent];
      if (prev.more) return { lang, text: prev.more[lang], next: prev.next, id: prev.id };
      const intro = lang === 'pt' ? 'Sobre esse tema, isto é o essencial. Pode explorar também:' : 'That’s the essence of it. You can also explore:';
      return { lang, text: intro, next: prev.next, id: prev.id };
    }

    const intent = forcedId ? BY_ID[forcedId] : scoreIntents(text);
    if (!intent) return { lang, text: window.EDELPHIA_KB_FALLBACK[lang], next: window.EDELPHIA_KB_FALLBACK_NEXT, id: null };
    return { lang, text: intent.a[lang], next: intent.next, id: intent.id };
  }

  async function ask(text, forcedId) {
    text = (text || '').trim();
    if (!text || typing) return;
    typing = true;
    root.classList.add('is-busy');
    sendBtn.disabled = true;
    suggest.hidden = true;
    input.value = '';
    autosize();

    addMsg('user', escapeHtml(text));
    history.push({ role: 'user', text });

    const r = reply(text, forcedId);
    if (r.id) lastIntent = r.id;

    // short "thinking" pause, then type the answer out word by word
    const msg = addMsg('bot', '<span class="msg__typing"><i></i><i></i><i></i></span>');
    msg.classList.add('is-streaming');
    const body = $('.msg__body', msg);
    if (!reduced) await wait(450 + Math.min(r.text.length, 400));
    if (reduced) body.innerHTML = markdown(r.text);
    else {
      const words = r.text.split(/(?<=\s)/);
      let shown = '';
      for (let i = 0; i < words.length; i++) {
        shown += words[i];
        if (i % 2 === 1 || i === words.length - 1) { body.innerHTML = markdown(shown); scrollLog(); await wait(22); }
      }
    }
    msg.classList.remove('is-streaming');
    addNext(msg, r.next, r.lang);
    scrollLog();

    history.push({ role: 'bot', text: r.text, next: r.next, lang: r.lang });
    save();
    typing = false;
    root.classList.remove('is-busy');
    sendBtn.disabled = false;
  }
  const wait = ms => new Promise(res => setTimeout(res, ms));

  /* =========================================================
     UI wiring
     ========================================================= */
  function setOpen(open) {
    root.classList.toggle('is-open', open);
    fab.setAttribute('aria-expanded', String(open));
    fab.setAttribute('aria-label', site.t(open ? 'chat.close' : 'chat.open'));
    panel.inert = !open;
    if (isSmall()) site.lockScroll(open);
    if (open) { setTimeout(() => input.focus({ preventScroll: true }), 350); scrollLog(); }
    else if (panel.contains(document.activeElement)) fab.focus();
  }
  fab.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
  $('[data-chat-close]', root).addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('is-open')) setOpen(false); });

  $('[data-chat-reset]', root).addEventListener('click', () => {
    if (typing) return;
    history = [];
    lastIntent = null;
    save();
    log.querySelectorAll('.msg:not(:first-child)').forEach(n => n.remove());
    suggest.hidden = false;
    input.focus();
  });

  // section links scroll smoothly; follow-up chips ask their intent
  log.addEventListener('click', e => {
    const chip = e.target.closest('[data-intent]');
    if (chip) { ask(chip.textContent, chip.dataset.intent); return; }
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    const target = $(href);
    if (!target) return;
    if (isSmall()) setOpen(false);
    site.scrollTo(href === '#top' ? 0 : target);
  });

  suggest.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) ask(b.textContent, b.dataset.intent);
  });

  const autosize = () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; };
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });

  restore();

  // exposed for quick testing from the console: edelphiaAssistant.match('o que fazem?')
  window.edelphiaAssistant = { match: text => (scoreIntents(text) || {}).id || null, detectLang };
})();
