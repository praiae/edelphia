# edelphia

Website da EDELPHIA — *Science · Algorithms · Intelligence* — e pacote de logótipos da marca.

## Estrutura

- `site/` — o website (HTML/CSS/JS estático, sem build). É esta pasta que a Vercel publica (ver `vercel.json`).
  - `assets/js/i18n.js` — todos os textos em PT e EN
  - `assets/js/field.js` — campo de partículas WebGL (o Φ)
  - `assets/js/main.js` — animações e interações
- `SVG/`, `PNG/`, `PDF/`, `EPS/`, `Favicon/` — logótipos (ver `LEIA-ME.txt`)

- `api/chat.js` — função serverless (Vercel) do assistente de IA; chama a API do Claude em streaming
- `api/_knowledge.js` — tudo o que o assistente sabe sobre a EDELPHIA (prompt de sistema). **Se mudar os textos do site, atualize também este ficheiro.**
- `site/assets/js/chat.js` — a janela do chat no site

## Assistente de IA

Precisa da variável de ambiente `ANTHROPIC_API_KEY` (chave em https://platform.claude.com):
Vercel → Project → Settings → Environment Variables → `ANTHROPIC_API_KEY` → Redeploy.
Sem a chave o site funciona na mesma; o chat apenas mostra que não está configurado.

## Correr localmente

```
npm install
set ANTHROPIC_API_KEY=sk-ant-...      (PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-...")
node dev-server.mjs
```

e abrir http://127.0.0.1:8765. Para testar a interface do chat sem chave: `MOCK_CHAT=1` (PowerShell: `$env:MOCK_CHAT="1"`) antes de `node dev-server.mjs`.
