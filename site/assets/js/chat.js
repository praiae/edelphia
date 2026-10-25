/* =========================================================
   EDELPHIA — site assistant (talks to POST /api/chat)
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const root = $('[data-chat]');
  if (!root) return;

  const site = window.edelphia;
  const fab = $('[data-chat-toggle]', root);
  const panel = $('.chat__panel', root);
  const log = $('[data-chat-log]', root);
  const suggest = $('[data-chat-suggest]', root);
  const form = $('[data-chat-form]', root);
  const input = $('[data-chat-input]', root);
  const sendBtn = $('.chat__send', root);
  const isSmall = () => matchMedia('(max-width: 640px)').matches;

  const STORE_KEY = 'edelphia-chat';
  let history = [];          // [{ role, content, lang }]
  let busy = false;
  let controller = null;

  /* ---------- tiny, safe markdown: escape first, then bold / links / lists ---------- */
  const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function inline(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((#[\w-]+|https:\/\/[^\s)]+)\)/g, (m, text, href) =>
        href.startsWith('#')
          ? `<a href="${href}" class="msg__jump">${text}<span aria-hidden="true">↘</span></a>`
          : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`);
  }
  function markdown(src) {
    const blocks = escapeHtml(src.trim()).split(/\n{2,}/);
    return blocks.map(block => {
      const lines = block.split('\n');
      if (lines.every(l => /^\s*[-•*]\s+/.test(l))) {
        return '<ul>' + lines.map(l => `<li>${inline(l.replace(/^\s*[-•*]\s+/, ''))}</li>`).join('') + '</ul>';
      }
      if (lines.every(l => /^\s*\d+[.)]\s+/.test(l))) {
        return '<ol>' + lines.map(l => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('') + '</ol>';
      }
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    }).join('');
  }

  /* ---------- rendering ---------- */
  function addBubble(role, html) {
    const msg = document.createElement('div');
    msg.className = `msg msg--${role === 'user' ? 'user' : 'bot'}`;
    msg.innerHTML = `<div class="msg__body">${html}</div>`;
    log.appendChild(msg);
    scrollLog();
    return $('.msg__body', msg);
  }
  const scrollLog = () => { log.scrollTop = log.scrollHeight; };

  function renderHistory() {
    log.querySelectorAll('.msg:not(:first-child)').forEach(n => n.remove());
    history.forEach(m => addBubble(m.role, m.role === 'user' ? escapeHtml(m.content).replace(/\n/g, '<br>') : markdown(m.content)));
    suggest.hidden = history.length > 0;
  }

  function save() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-20))); } catch (e) { /* storage blocked */ }
  }
  try { history = JSON.parse(sessionStorage.getItem(STORE_KEY) || '[]'); } catch (e) { history = []; }
  if (!Array.isArray(history)) history = [];
  renderHistory();

  /* ---------- open / close ---------- */
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
    if (controller) controller.abort();
    history = [];
    save();
    renderHistory();
    input.focus();
  });

  // section links in answers use the site's smooth scroll
  log.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const target = $(a.getAttribute('href'));
    if (!target) return;
    if (isSmall()) setOpen(false);
    site.scrollTo(a.getAttribute('href') === '#top' ? 0 : target);
  });

  suggest.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) send(b.textContent);
  });

  /* ---------- input ---------- */
  const autosize = () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; };
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    send(input.value);
  });

  /* ---------- talk to /api/chat (streamed plain text) ---------- */
  async function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    busy = true;
    root.classList.add('is-busy');
    sendBtn.disabled = true;
    input.value = '';
    autosize();
    suggest.hidden = true;

    const lang = site.lang;
    history.push({ role: 'user', content: text, lang });
    addBubble('user', escapeHtml(text).replace(/\n/g, '<br>'));
    const body = addBubble('bot', '<span class="msg__typing"><i></i><i></i><i></i></span>');
    body.parentElement.classList.add('is-streaming');

    let reply = '';
    controller = new AbortController();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(res.status === 503 ? 'offline' : 'http');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        body.innerHTML = markdown(reply);
        scrollLog();
      }
      reply += decoder.decode();
      if (!reply.trim()) throw new Error('empty');
      body.innerHTML = markdown(reply);
      history.push({ role: 'assistant', content: reply, lang });
    } catch (err) {
      if (err.name === 'AbortError') { body.parentElement.remove(); history.pop(); }
      else {
        history.pop();   // drop the unanswered question so the conversation stays well-formed
        body.parentElement.classList.add('msg--error');
        body.textContent = site.t(err.message === 'offline' ? 'chat.offline' : 'chat.error');
      }
    } finally {
      body.parentElement && body.parentElement.classList.remove('is-streaming');
      save();
      busy = false;
      controller = null;
      root.classList.remove('is-busy');
      sendBtn.disabled = false;
      scrollLog();
    }
  }
})();
