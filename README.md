# edelphia

Website da EDELPHIA — *Science · Algorithms · Intelligence* — e pacote de logótipos da marca.

## Estrutura

- `site/` — o website (HTML/CSS/JS estático, sem build). É esta pasta que a Vercel publica (ver `vercel.json`).
  - `assets/js/i18n.js` — todos os textos em PT e EN
  - `assets/js/field.js` — campo de partículas WebGL (o Φ)
  - `assets/js/main.js` — animações e interações
- `SVG/`, `PNG/`, `PDF/`, `EPS/`, `Favicon/` — logótipos (ver `LEIA-ME.txt`)

## Correr localmente

```
python -m http.server 8765 --directory site
```

e abrir http://127.0.0.1:8765
