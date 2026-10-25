# edelphia

Website da EDELPHIA — *Science · Algorithms · Intelligence* — e pacote de logótipos da marca.

## Estrutura

- `site/` — o website (HTML/CSS/JS estático, sem build). É esta pasta que a Vercel publica (ver `vercel.json`).
  - `assets/js/i18n.js` — todos os textos em PT e EN
  - `assets/js/field.js` — campo de partículas WebGL (o Φ)
  - `assets/js/main.js` — animações e interações
  - `assets/js/assistant-kb.js` — base de conhecimento do assistente (perguntas, palavras-chave e respostas em PT/EN)
  - `assets/js/chat.js` — o assistente: janela do chat e motor de correspondência
- `SVG/`, `PNG/`, `PDF/`, `EPS/`, `Favicon/` — logótipos (ver `LEIA-ME.txt`)

## Assistente

O assistente corre inteiramente no browser: sem servidor, sem API e sem custos, e nada do que o visitante escreve sai do computador dele.
Reconhece a intenção da pergunta (sem acentos, plurais e pequenos erros de escrita incluídos), responde na língua em que o visitante escreve
e sugere perguntas relacionadas. Não é um modelo de linguagem: só responde ao que está na base de conhecimento.

Para acrescentar ou mudar respostas, edite `site/assets/js/assistant-kb.js`. Cada entrada tem:
- `keys` — palavras ou frases (PT e EN, sem acentos) que indicam a pergunta; prefixo `~` = palavra genérica, com menos peso
- `q` — o texto da pergunta nos botões de sugestão
- `a` — a resposta (`**negrito**`, `*itálico*`, listas `- ` e links para secções como `[Visão](#visao)`)
- `more` (opcional) — resposta mais detalhada para "conta-me mais"
- `next` — perguntas relacionadas a sugerir

**Se mudar os textos do site, atualize também as respostas.** Para testar uma pergunta, na consola do browser: `edelphiaAssistant.match('o que fazem?')`.

## Correr localmente

```
python -m http.server 8765 --directory site
```

e abrir http://127.0.0.1:8765
