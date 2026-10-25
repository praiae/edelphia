// POST /api/chat — EDELPHIA website assistant (Vercel Node.js function).
// Body: { messages: [{ role: "user" | "assistant", content: string, lang?: "pt" | "en" }] }
// Response: text/plain stream of the assistant's reply.
// Needs the ANTHROPIC_API_KEY environment variable (Vercel → Project → Settings → Environment Variables).

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './_knowledge.js';

const MODEL = 'claude-opus-5-5';
const MAX_TURNS = 20;           // messages kept from the conversation
const MAX_CHARS = 2000;         // per message
const MAX_TOKENS = 4096;        // a chat-widget reply; caps cost per request

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const MESSAGES = {
  pt: {
    busy: 'Estou com muitos pedidos neste momento. Tente novamente dentro de alguns segundos.',
    error: 'Não consegui responder agora. Tente novamente daqui a pouco.',
    refusal: 'Não posso ajudar com esse pedido. Posso falar sobre a EDELPHIA e o que está no site.',
    truncated: '…',
  },
  en: {
    busy: "I'm handling a lot of requests right now. Please try again in a few seconds.",
    error: "I couldn't answer just now. Please try again shortly.",
    refusal: "I can't help with that request. I'm happy to talk about EDELPHIA and what's on the site.",
    truncated: '…',
  },
};

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

// Keep only well-formed turns, trimmed to size, starting with a user turn and alternating roles.
function sanitize(raw) {
  if (!Array.isArray(raw)) return null;
  const out = [];
  for (const m of raw.slice(-MAX_TURNS)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') continue;
    const text = m.content.trim().slice(0, MAX_CHARS);
    if (!text) continue;
    if (out.length && out[out.length - 1].role === m.role) continue;   // enforce alternation
    const lang = m.lang === 'en' ? 'en' : 'pt';
    out.push({
      role: m.role,
      // the language note keeps each user turn stable across requests, so the cached prefix holds
      content: m.role === 'user' ? `[page language: ${lang}]\n${text}` : text,
    });
  }
  while (out.length && out[0].role !== 'user') out.shift();
  if (!out.length || out[out.length - 1].role !== 'user') return null;
  return out;
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json(400, { error: 'invalid_json' }); }

  const messages = sanitize(body?.messages);
  if (!messages) return json(400, { error: 'invalid_messages' });
  const lang = body?.messages?.at(-1)?.lang === 'en' ? 'en' : 'pt';
  const t = MESSAGES[lang];

  if (!process.env.ANTHROPIC_API_KEY) return json(503, { error: 'not_configured' });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const write = (s) => controller.enqueue(encoder.encode(s));
      try {
        const response = client.beta.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          output_config: { effort: 'low' },          // chat: quick, conversational answers
          cache_control: { type: 'ephemeral' },      // caches the static system prompt + history prefix
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',                      // a declined request is re-run on Anthropic's recommended fallback
          system: SYSTEM_PROMPT,
          messages,
        });

        let wrote = false;
        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            write(event.delta.text);
            wrote = true;
          }
        }
        const final = await response.finalMessage();
        if (final.stop_reason === 'refusal') write(wrote ? `\n\n${t.refusal}` : t.refusal);
        else if (final.stop_reason === 'max_tokens') write(t.truncated);
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError) {
          write(t.busy);
        } else {
          console.error('chat error', err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
          write(t.error);
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
