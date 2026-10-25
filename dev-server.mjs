// Local dev server: serves site/ and routes POST /api/chat to api/chat.js (same code Vercel runs).
//   node dev-server.mjs                       → needs ANTHROPIC_API_KEY in the environment
//   MOCK_CHAT=1 node dev-server.mjs           → streams a canned reply (UI testing without a key)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { Readable } from 'node:stream';
import { POST } from './api/chat.js';

const PORT = Number(process.env.PORT) || 8765;
const ROOT = join(import.meta.dirname, 'site');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json' };

async function mockReply(req) {
  let body = '';
  for await (const c of req) body += c;
  const last = JSON.parse(body).messages.at(-1);
  const text = last.lang === 'en'
    ? `(mock) You asked: “${last.content}”. EDELPHIA builds **end-to-end AI & ML solutions**: see [Solutions](#solucoes) and [Mission & Objectives](#missao).\n\n- Strategy → Data → Models\n- MLOps → Deployment → Monitoring`
    : `(simulação) Perguntou: “${last.content}”. A EDELPHIA desenvolve **soluções end-to-end de IA & ML**: veja [Soluções](#solucoes) e [Missão & Objetivos](#missao).\n\n- Estratégia → Dados → Modelos\n- MLOps → Implementação → Monitorização`;
  return new Response(new ReadableStream({
    async start(ctrl) {
      for (const word of text.split(/(?<= )/)) { ctrl.enqueue(new TextEncoder().encode(word)); await new Promise(r => setTimeout(r, 35)); }
      ctrl.close();
    },
  }), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/api/chat') {
      if (req.method !== 'POST') { res.writeHead(405).end(); return; }
      const response = process.env.MOCK_CHAT
        ? await mockReply(req)
        : await POST(new Request(url, { method: 'POST', headers: req.headers, body: Readable.toWeb(req), duplex: 'half' }));
      res.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) for await (const chunk of response.body) res.write(chunk);
      res.end();
      return;
    }
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    if (!path || path.endsWith('/') || path.endsWith('\\')) path = join(path, 'index.html');
    const file = join(ROOT, path);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(data);
  } catch (err) {
    if (!res.headersSent) res.writeHead(err.code === 'ENOENT' ? 404 : 500);
    res.end();
  }
}).listen(PORT, () => console.log(`EDELPHIA → http://127.0.0.1:${PORT}${process.env.MOCK_CHAT ? '  (chat: mock)' : ''}`));
