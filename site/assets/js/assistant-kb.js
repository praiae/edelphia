/* =========================================================
   EDELPHIA — local assistant knowledge base (PT / EN)
   Each intent: keys (phrases/words in either language that signal it),
   q (the question as shown on suggestion chips), a (answer, light markdown),
   more (optional deeper answer for "tell me more"), next (related intents).
   Links like [text](#anchor) jump to page sections.
   ========================================================= */
(function () {
  'use strict';

  window.EDELPHIA_KB = [
    /* ---------- conversation ---------- */
    {
      id: 'greeting',
      keys: ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      q: { pt: 'Olá', en: 'Hello' },
      a: {
        pt: 'Olá! Sou o assistente da EDELPHIA. Posso explicar o que fazemos, a nossa visão e objetivos, as soluções end-to-end de IA & ML, ou levá-lo a qualquer secção do site.',
        en: 'Hello! I’m the EDELPHIA assistant. I can explain what we do, our vision and objectives, our end-to-end AI & ML solutions, or take you to any section of the site.',
      },
      next: ['about', 'solutions', 'vision'],
    },
    {
      id: 'thanks',
      keys: ['obrigado', 'obrigada', 'obg', 'agradeco', 'thanks', 'thank you', 'thx', 'cheers', '~perfeito', '~otimo', '~great', '~perfect'],
      q: { pt: 'Obrigado', en: 'Thanks' },
      a: { pt: 'De nada! Há mais alguma coisa que queira saber sobre a EDELPHIA?', en: 'You’re welcome! Anything else you’d like to know about EDELPHIA?' },
      next: ['mission', 'method', 'contact'],
    },
    {
      id: 'bye',
      keys: ['adeus', 'tchau', 'ate logo', 'ate breve', 'bye', 'goodbye', 'see you'],
      q: { pt: 'Adeus', en: 'Bye' },
      a: { pt: 'Até breve! Se quiser falar connosco, as nossas redes estão em [Contacto](#contacto).', en: 'See you soon! If you’d like to reach us, our profiles are in [Contact](#contacto).' },
    },
    {
      id: 'who',
      keys: ['quem es', 'quem e voce', 'es um robo', 'es uma ia', 'who are you', 'are you a bot', 'are you ai', 'what are you', 'assistente', 'assistant', 'chatbot', 'bot'],
      q: { pt: 'Quem és tu?', en: 'Who are you?' },
      a: {
        pt: 'Sou o assistente do site da EDELPHIA. Funciono localmente no seu browser, sem enviar dados para nenhum servidor, e respondo a partir do conteúdo do site: empresa, visão, objetivos, soluções, método e contacto.',
        en: 'I’m the EDELPHIA website assistant. I run locally in your browser, without sending data to any server, and I answer from the site’s content: the company, vision, objectives, solutions, method and contact.',
      },
      next: ['about', 'navigate'],
    },

    /* ---------- company ---------- */
    {
      id: 'about',
      keys: ['o que faz', 'o que fazem', 'o q fazem', 'q fazem', 'fazem o que', 'que fazem vcs', 'vcs fazem', 'voces fazem', 'que empresa', 'sobre a empresa', 'sobre a edelphia', 'quem sao', 'o que e a edelphia', '~edelphia', '~empresa', 'what do you do', 'what does edelphia do', 'about', 'who are you guys', '~company', 'what is edelphia', 'servicos', 'services', 'oferecem', 'offer'],
      q: { pt: 'O que faz a EDELPHIA?', en: 'What does EDELPHIA do?' },
      a: {
        pt: 'A EDELPHIA desenvolve **soluções end-to-end de inteligência artificial e machine learning**: da estratégia e dos dados até aos modelos em produção e à sua monitorização. O lema é *Science · Algorithms · Intelligence*, e a ideia central é **Φ = ∫ knowledge · dt**: o valor está no conhecimento acumulado ao longo do tempo. Veja [Soluções](#solucoes).',
        en: 'EDELPHIA builds **end-to-end artificial intelligence and machine learning solutions**, from strategy and data all the way to models in production and their monitoring. The motto is *Science · Algorithms · Intelligence*, and the core idea is **Φ = ∫ knowledge · dt**: value lies in knowledge accumulated over time. See [Solutions](#solucoes).',
      },
      more: {
        pt: 'Trabalhamos em três pilares: **Science** (método e evidência), **Algorithms** (engenharia que escala) e **Intelligence** (IA & ML que aprendem e explicam). Veja [Pilares](#pilares) e o [Manifesto](#manifesto).',
        en: 'We work across three pillars: **Science** (method and evidence), **Algorithms** (engineering that scales) and **Intelligence** (AI & ML that learn and explain). See [Pillars](#pilares) and the [Manifesto](#manifesto).',
      },
      next: ['solutions', 'vision', 'equation'],
    },
    {
      id: 'manifesto',
      keys: ['manifesto', 'filosofia', 'philosophy', 'acreditam', 'believe', 'valores', 'values'],
      q: { pt: 'Qual é o manifesto?', en: 'What is the manifesto?' },
      a: {
        pt: '«A inteligência não é um momento. É uma soma.» Cada dado, experiência e algoritmo acrescenta uma fração ao todo; a EDELPHIA existe para integrar essas frações com rigor científico e engenharia precisa. *Do ruído ao sinal. Do sinal ao sentido.* Leia em [Manifesto](#manifesto).',
        en: '“Intelligence is not a moment. It is a sum.” Every datum, experiment and algorithm adds a fraction to the whole; EDELPHIA exists to integrate those fractions with scientific rigour and precise engineering. *From noise to signal. From signal to meaning.* Read it in [Manifesto](#manifesto).',
      },
      next: ['vision', 'equation'],
    },
    {
      id: 'vision',
      keys: ['visao', 'vision', 'futuro', 'future', 'ambicao', 'ambition', 'tese', 'thesis', 'resumo', 'abstract'],
      q: { pt: 'Qual é a visão?', en: 'What is the vision?' },
      a: {
        pt: '**Organizações que aprendem tão depressa quanto o mundo muda.** A tese: o valor de um sistema inteligente não é o que sabe num instante, mas o integral do conhecimento que adquire, valida e converte em ação ao longo do tempo. Veja [Visão](#visao).',
        en: '**Organisations that learn as fast as the world changes.** The thesis: the value of an intelligent system is not what it knows at an instant, but the integral of the knowledge it acquires, validates and acts upon over time. See [Vision](#visao).',
      },
      more: {
        pt: 'Imaginamos organizações que funcionam como sistemas inferenciais: cada decisão é uma crença *a posteriori* que se atualiza com a evidência, com incerteza quantificada. A IA deixa de ser um modelo isolado e passa a ser um ciclo fechado — observação, representação, inferência, intervenção, retroação — concebido de ponta a ponta.',
        en: 'We envision organisations operating as inferential systems: each decision is a *posterior* belief updated with evidence, with quantified uncertainty. AI stops being an isolated model and becomes a closed loop — observation, representation, inference, intervention, feedback — engineered end to end.',
      },
      next: ['mission', 'bayesian', 'equation'],
    },
    {
      id: 'mission',
      keys: ['missao', 'mission', 'objetivo', 'objetivos', 'objective', 'objectives', 'goal', 'goals', 'proposito', 'purpose', 'objetivo geral'],
      q: { pt: 'Qual é a missão?', en: 'What is the mission?' },
      a: {
        pt: '**Da hipótese à produção.** Objetivo geral: conceber, validar e implementar sistemas de IA e ML de ponta a ponta que transformem dados heterogéneos e ruidosos em decisões estatisticamente sólidas, causalmente fundamentadas, explicáveis e em melhoria contínua. Veja [Missão & Objetivos](#missao).',
        en: '**From hypothesis to production.** General objective: to design, validate and deploy end-to-end AI and ML systems that turn heterogeneous, noisy data into decisions that are statistically sound, causally grounded, explainable and continuously improving. See [Mission & Objectives](#missao).',
      },
      more: {
        pt: 'Há quatro objetivos específicos:\n- **O₁ Rigor epistémico:** hipóteses falsificáveis, métricas pré-registadas, incerteza calibrada.\n- **O₂ Generalização:** controlar o fosso entre risco empírico e populacional.\n- **O₃ Causalidade & explicabilidade:** da correlação à intervenção.\n- **O₄ Continuidade ponta a ponta:** pipelines observáveis que detetam drift.',
        en: 'There are four specific objectives:\n- **O₁ Epistemic rigour:** falsifiable hypotheses, pre-registered metrics, calibrated uncertainty.\n- **O₂ Generalisation:** control the gap between empirical and population risk.\n- **O₃ Causality & explainability:** from correlation to intervention.\n- **O₄ End-to-end continuity:** observable pipelines that detect drift.',
      },
      next: ['o1', 'o3', 'solutions'],
    },
    {
      id: 'o1',
      keys: ['rigor', 'epistemico', 'epistemic', 'o1', 'calibracao', 'calibration', 'calibrado', 'calibrated', 'incerteza', 'uncertainty', 'falsificavel', 'falsifiable', 'pre registadas', 'pre registered'],
      q: { pt: 'O que é o rigor epistémico (O₁)?', en: 'What is epistemic rigour (O₁)?' },
      a: {
        pt: '**O₁ — Rigor epistémico:** cada modelo parte de uma hipótese falsificável, com métricas definidas antes da experiência, incerteza preditiva **calibrada** e avaliação sob mudança de distribuição. Calibração significa que, quando o modelo diz 80%, acerta cerca de 80% das vezes: 𝔼[y | p̂(x) = p] = p. Veja [Missão](#missao).',
        en: '**O₁ — Epistemic rigour:** every model starts from a falsifiable hypothesis, with metrics fixed before the experiment, **calibrated** predictive uncertainty and evaluation under distribution shift. Calibration means that when the model says 80%, it is right about 80% of the time: 𝔼[y | p̂(x) = p] = p. See [Mission](#missao).',
      },
      next: ['o2', 'shift'],
    },
    {
      id: 'o2',
      keys: ['generalizacao', 'generalisation', 'generalization', 'o2', 'risco empirico', 'empirical risk', 'overfitting', 'sobreajuste', 'regularizacao', 'regularisation', 'regularization'],
      q: { pt: 'O que é a generalização (O₂)?', en: 'What is generalisation (O₂)?' },
      a: {
        pt: '**O₂ — Generalização:** aprender representações que funcionam para além dos dados de treino, controlando o fosso entre o risco empírico e o risco real, R(θ) − R̂ₙ(θ) ≤ ε, através de regularização, desenho centrado nos dados e validação robusta. Veja [Missão](#missao).',
        en: '**O₂ — Generalisation:** learn representations that work beyond the training data, controlling the gap between empirical and true risk, R(θ) − R̂ₙ(θ) ≤ ε, through regularisation, data-centric design and robust validation. See [Mission](#missao).',
      },
      next: ['o3', 'shift'],
    },
    {
      id: 'o3',
      keys: ['causalidade', 'causality', 'causal', 'causais', 'o3', 'explicabilidade', 'explainability', 'explicavel', 'explainable', 'xai', 'intervencao', 'intervention', 'do calculus', 'correlacao', 'correlation'],
      q: { pt: 'O que é causalidade & explicabilidade (O₃)?', en: 'What is causality & explainability (O₃)?' },
      a: {
        pt: '**O₃ — Causalidade & explicabilidade:** passar da correlação à intervenção — estimar o efeito real de uma ação, 𝔼[Y | do(X = x)], com pressupostos de identificação explícitos — e dar explicações fiéis ao mecanismo do modelo, não narrativas *post hoc*. Veja [Missão](#missao).',
        en: '**O₃ — Causality & explainability:** move from correlation to intervention — estimate the real effect of an action, 𝔼[Y | do(X = x)], under explicit identification assumptions — and give explanations faithful to the model’s mechanism, not *post hoc* narratives. See [Mission](#missao).',
      },
      next: ['o4', 'capabilities'],
    },
    {
      id: 'o4',
      keys: ['continuidade', 'continuity', 'o4', 'ponta a ponta', 'drift', 'deriva', 'retreino', 'retraining', 'pipeline'],
      q: { pt: 'O que é a continuidade ponta a ponta (O₄)?', en: 'What is end-to-end continuity (O₄)?' },
      a: {
        pt: '**O₄ — Continuidade ponta a ponta:** fechar o ciclo desde a ingestão de dados até à monitorização em produção, com pipelines versionados, reprodutíveis e observáveis, onde os modelos detetam **drift** e aprendem com segurança à medida que o mundo muda. Em símbolos: ∂Φ/∂t > 0. Veja [Missão](#missao).',
        en: '**O₄ — End-to-end continuity:** close the loop from data ingestion to production monitoring, with versioned, reproducible and observable pipelines in which models detect **drift** and learn safely as the world changes. In symbols: ∂Φ/∂t > 0. See [Mission](#missao).',
      },
      next: ['mlops', 'solutions'],
    },

    /* ---------- pillars ---------- */
    {
      id: 'pillars',
      keys: ['pilares', '~pillars', 'pilar', '~pillar', 'tres forcas', 'three forces', 'science algorithms intelligence'],
      q: { pt: 'Quais são os pilares?', en: 'What are the pillars?' },
      a: {
        pt: '**Três forças, um único vetor:**\n- **Science** — método antes do modelo; evidência medida.\n- **Algorithms** — engenharia que escala; otimização e sistemas distribuídos.\n- **Intelligence** — IA & ML que aprendem e explicam.\n\nVeja [Pilares](#pilares).',
        en: '**Three forces, a single vector:**\n- **Science** — method before model; measured evidence.\n- **Algorithms** — engineering that scales; optimisation and distributed systems.\n- **Intelligence** — AI & ML that learn and explain.\n\nSee [Pillars](#pilares).',
      },
      next: ['solutions', 'method'],
    },
    {
      id: 'science',
      keys: ['science', 'ciencia', 'cientifico', 'scientific', 'investigacao', 'research', 'estatistica', '~statistics', '~inferencia', '~inference'],
      q: { pt: 'O pilar Science', en: 'The Science pillar' },
      a: {
        pt: '**Science:** método antes do modelo. Hipóteses claras, experiências reprodutíveis e evidência medida — não intuição. Inclui investigação aplicada, estatística & inferência e validação rigorosa. Veja [Pilares](#pilares).',
        en: '**Science:** method before model. Clear hypotheses, reproducible experiments and measured evidence — not intuition. It covers applied research, statistics & inference and rigorous validation. See [Pillars](#pilares).',
      },
      next: ['algorithms', 'intelligence'],
    },
    {
      id: 'algorithms',
      keys: ['algorithms', 'algoritmos', 'algoritmo', 'algorithm', 'engenharia', 'engineering', 'sistemas distribuidos', 'distributed systems', 'escala', 'scale', 'performance', 'desempenho'],
      q: { pt: 'O pilar Algorithms', en: 'The Algorithms pillar' },
      a: {
        pt: '**Algorithms:** engenharia que escala. Código eficiente, sistemas robustos e otimização até ao último milissegundo — otimização, sistemas distribuídos e engenharia de dados. Veja [Pilares](#pilares).',
        en: '**Algorithms:** engineering that scales. Efficient code, robust systems and optimisation down to the last millisecond — optimisation, distributed systems and data engineering. See [Pillars](#pilares).',
      },
      next: ['intelligence', 'solutions'],
    },
    {
      id: 'intelligence',
      keys: ['intelligence', 'inteligencia', 'inteligencia artificial', 'artificial intelligence', '~ia', '~ai', '~machine learning', '~aprendizagem automatica', '~ml', '~deep learning'],
      q: { pt: 'O pilar Intelligence', en: 'The Intelligence pillar' },
      a: {
        pt: '**Intelligence:** IA & machine learning que aprendem e explicam, ao serviço de decisões reais e com transparência — machine & deep learning, linguagem & visão, IA explicável. Veja [Pilares](#pilares) e as [competências](#solucoes).',
        en: '**Intelligence:** AI & machine learning that learn and explain, in service of real decisions and with transparency — machine & deep learning, language & vision, explainable AI. See [Pillars](#pilares) and our [capabilities](#solucoes).',
      },
      next: ['capabilities', 'solutions'],
    },

    /* ---------- solutions ---------- */
    {
      id: 'solutions',
      keys: ['solucoes', 'solucao', 'solutions', 'solution', 'end to end', 'end-to-end', 'ponta a ponta', 'ciclo de vida', 'lifecycle', 'como trabalham', 'how do you work', 'processo', 'process', 'implementar', 'implement'],
      q: { pt: 'Como é uma solução end-to-end?', en: 'What does an end-to-end solution look like?' },
      a: {
        pt: '**Dos dados em bruto às decisões em produção.** Assumimos todo o ciclo de vida de IA & ML — uma equipa, um pipeline responsável:\n1. Estratégia\n2. Dados\n3. Modelos\n4. MLOps\n5. Implementação\n6. Monitorização\n\nVeja [Soluções](#solucoes).',
        en: '**From raw data to decisions in production.** We own the entire AI & ML lifecycle — one team, one accountable pipeline:\n1. Strategy\n2. Data\n3. Models\n4. MLOps\n5. Deployment\n6. Monitoring\n\nSee [Solutions](#solucoes).',
      },
      more: {
        pt: '- **Estratégia:** enquadramento do problema, hipóteses de valor e viabilidade.\n- **Dados:** ingestão, qualidade, governação e feature stores.\n- **Modelos:** ML, deep learning e LLMs, concebidos e validados.\n- **MLOps:** versionamento, CI/CD e treino reprodutível.\n- **Implementação:** APIs, edge e cloud, em escala e com baixa latência.\n- **Monitorização:** drift, desempenho e retreino contínuo.',
        en: '- **Strategy:** problem framing, value hypotheses and feasibility.\n- **Data:** ingestion, quality, governance and feature stores.\n- **Models:** ML, deep learning and LLMs, designed and validated.\n- **MLOps:** versioning, CI/CD and reproducible training.\n- **Deployment:** APIs, edge and cloud, at scale with low latency.\n- **Monitoring:** drift, performance and continuous retraining.',
      },
      next: ['capabilities', 'mlops', 'method'],
    },
    {
      id: 'capabilities',
      keys: ['competencias', 'capabilities', 'tecnologias', 'technologies', 'stack', 'areas', 'especialidades', 'expertise', 'llm', 'llms', 'ia generativa', 'generative ai', 'genai', 'visao computacional', 'computer vision', 'nlp', 'linguagem natural', 'natural language', 'series temporais', 'time series', 'forecasting', 'previsao', 'recomendacao', 'recommender', 'otimizacao', 'optimisation', 'optimization'],
      q: { pt: 'Que competências de IA & ML têm?', en: 'What AI & ML capabilities do you have?' },
      a: {
        pt: 'As competências em IA & ML apresentadas no site: **machine learning, deep learning, IA generativa & LLMs, visão computacional, processamento de linguagem natural, previsão de séries temporais, sistemas de recomendação, inferência causal, otimização matemática e MLOps.** Veja [Soluções](#solucoes).',
        en: 'The AI & ML capabilities listed on the site: **machine learning, deep learning, generative AI & LLMs, computer vision, natural language processing, time-series forecasting, recommender systems, causal inference, mathematical optimisation and MLOps.** See [Solutions](#solucoes).',
      },
      next: ['solutions', 'o3'],
    },
    {
      id: 'mlops',
      keys: ['mlops', 'ci cd', 'cicd', 'versionamento', 'versioning', 'reprodutivel', 'reproducible', '~producao', '~production', 'deploy', 'implementacao', 'deployment', 'monitorizacao', 'monitoring', '~cloud', '~edge', '~api', '~apis'],
      q: { pt: 'O que é MLOps?', en: 'What is MLOps?' },
      a: {
        pt: '**MLOps** é a engenharia que leva modelos para produção e os mantém fiáveis: versionamento de dados e modelos, CI/CD, treino reprodutível, implementação (APIs, edge, cloud) e monitorização de drift e desempenho com retreino contínuo. É o que garante a [continuidade ponta a ponta](#missao) das nossas [soluções](#solucoes).',
        en: '**MLOps** is the engineering that takes models into production and keeps them reliable: data and model versioning, CI/CD, reproducible training, deployment (APIs, edge, cloud) and drift/performance monitoring with continuous retraining. It underpins the [end-to-end continuity](#missao) of our [solutions](#solucoes).',
      },
      next: ['o4', 'solutions'],
    },

    /* ---------- method & equation ---------- */
    {
      id: 'method',
      keys: ['metodo', 'method', 'metodologia', 'methodology', 'passos', 'steps', 'etapas', 'stages', 'observar', 'observe', 'modelar', '~model', 'treinar', '~train', '~training', 'integrar', 'integrate', 'iteracao', 'iteration'],
      q: { pt: 'Qual é o método?', en: 'What is the method?' },
      a: {
        pt: '**Quatro passos, iteração infinita:**\n1. **Observar** — o problema e os dados; perguntas certas antes de respostas rápidas.\n2. **Modelar** — formalizar o conhecimento: estrutura, variáveis, restrições.\n3. **Treinar** — aprender, falhar, corrigir; medir cada época.\n4. **Integrar** — levar à produção; o conhecimento soma-se e volta ao início.\n\nVeja [Método](#metodo).',
        en: '**Four steps, infinite iteration:**\n1. **Observe** — the problem and the data; the right questions before fast answers.\n2. **Model** — formalise knowledge: structure, variables, constraints.\n3. **Train** — learn, fail, correct; measure every epoch.\n4. **Integrate** — take it to production; knowledge adds up and loops back.\n\nSee [Method](#metodo).',
      },
      next: ['equation', 'solutions'],
    },
    {
      id: 'equation',
      keys: ['equacao', 'equation', 'formula', 'phi', 'integral', 'knowledge dt', 'conhecimento dt', '~simbolo', '~symbol', 'logo', 'logotipo', '~significado', '~meaning'],
      q: { pt: 'Explique Φ = ∫ knowledge · dt', en: 'Explain Φ = ∫ knowledge · dt' },
      a: {
        pt: '**Φ = ∫ knowledge · dt** diz que o valor (Φ) não está num único dado, mas na **área sob a curva** do conhecimento ao longo do tempo. Cada decisão deve ser melhor do que a anterior porque integra tudo o que se aprendeu. Na secção [Equação](#equacao), o gráfico preenche essa área à medida que faz scroll. O símbolo Φ com a órbita é também o logótipo da EDELPHIA.',
        en: '**Φ = ∫ knowledge · dt** says that value (Φ) doesn’t live in a single data point but in the **area under the curve** of knowledge over time. Each decision should beat the last because it integrates everything learned so far. In the [Equation](#equacao) section the chart fills that area as you scroll. The Φ with its orbit is also EDELPHIA’s logo.',
      },
      next: ['vision', 'stats'],
    },
    {
      id: 'stats',
      keys: ['numeros', 'numbers', 'estatisticas', 'statistics', 'metricas', 'metrics', 'modelos em producao', 'models in production', 'disponibilidade', 'availability', 'uptime', 'latencia', 'latency', 'eventos', 'events', 'resultados', 'results'],
      q: { pt: 'Que números apresentam?', en: 'What figures do you show?' },
      a: {
        pt: 'Os números apresentados no site: **128+** modelos em produção, **4,2 mil milhões** de eventos processados por mês, **99,98%** de disponibilidade e **12 ms** de latência média de inferência. Estão por baixo da [Equação](#equacao).',
        en: 'The figures shown on the site: **128+** models in production, **4.2 billion** events processed per month, **99.98%** availability and **12 ms** average inference latency. They sit under the [Equation](#equacao).',
      },
      next: ['solutions', 'contact'],
    },

    /* ---------- concepts ---------- */
    {
      id: 'shift',
      keys: ['mudanca de distribuicao', 'distribution shift', 'dataset shift', 'covariate shift', 'fora da distribuicao', 'out of distribution', 'ood'],
      q: { pt: 'O que é mudança de distribuição?', en: 'What is distribution shift?' },
      a: {
        pt: 'Há **mudança de distribuição** quando os dados em produção deixam de se parecer com os de treino — novos clientes, sazonalidade, sensores diferentes. Um modelo pode ter ótimos resultados no teste e falhar no mundo real. Por isso avaliamos sob mudança de distribuição e monitorizamos drift em produção ([O₁ e O₄](#missao)).',
        en: '**Distribution shift** happens when production data stops resembling training data — new customers, seasonality, different sensors. A model can score well on tests and still fail in the real world. That’s why we evaluate under distribution shift and monitor drift in production ([O₁ and O₄](#missao)).',
      },
      next: ['o1', 'o4'],
    },
    {
      id: 'bayesian',
      keys: ['bayes', 'bayesiana', 'bayesian', 'posteriori', 'posterior', 'priori', 'prior', 'crenca', 'belief', 'probabilistico', 'probabilistic'],
      q: { pt: 'O que é inferência bayesiana?', en: 'What is Bayesian inference?' },
      a: {
        pt: 'Na **inferência bayesiana**, uma crença inicial (*a priori*) é atualizada com a evidência observada, dando uma crença *a posteriori* com incerteza explícita. É a base da nossa [visão](#visao): tratar cada decisão como uma crença que se refina com os dados, em vez de uma estimativa pontual.',
        en: 'In **Bayesian inference**, an initial belief (the *prior*) is updated with observed evidence, giving a *posterior* belief with explicit uncertainty. It underpins our [vision](#visao): treating each decision as a belief refined by data rather than a point estimate.',
      },
      next: ['vision', 'o1'],
    },

    /* ---------- contact & practical ---------- */
    {
      id: 'contact',
      keys: ['contacto', 'contato', 'contactar', 'contatar', 'contact', 'falar convosco', 'falar com voces', 'get in touch', 'reach', 'redes sociais', 'social', 'linkedin', 'github', 'instagram', 'youtube', 'twitter', 'parceria', 'partnership', 'trabalhar convosco', 'work with you', 'orcamento', 'proposta', 'proposal', 'quote'],
      q: { pt: 'Como posso entrar em contacto?', en: 'How can I get in touch?' },
      a: {
        pt: 'Pode falar com a EDELPHIA através das redes sociais na secção [Contacto](#contacto): **LinkedIn, GitHub, X, Instagram e YouTube**.',
        en: 'You can reach EDELPHIA through the social profiles in the [Contact](#contacto) section: **LinkedIn, GitHub, X, Instagram and YouTube**.',
      },
      next: ['about', 'solutions'],
    },
    {
      id: 'email',
      keys: ['email', 'e mail', 'mail', 'telefone', 'phone', 'telemovel', 'whatsapp', 'formulario', 'form', 'ligar', 'call'],
      q: { pt: 'Têm email ou telefone?', en: 'Do you have an email or phone?' },
      a: {
        pt: 'O site não apresenta email, telefone nem formulário. O contacto é feito pelas redes sociais em [Contacto](#contacto).',
        en: 'The site doesn’t list an email, phone number or form. Contact is through the social profiles in [Contact](#contacto).',
      },
      next: ['contact'],
    },
    {
      id: 'unknown_info',
      keys: ['preco', 'precos', 'price', 'pricing', 'custo', 'cost', 'quanto custa', 'how much', 'clientes', 'clients', 'customers', 'casos de estudo', 'case studies', 'portfolio', 'equipa', 'team', 'fundador', 'fundadores', 'founder', 'founders', 'ceo', 'morada', 'localizacao', 'onde estao', 'address', 'location', 'where are you', 'escritorio', 'office', 'emprego', 'vagas', 'carreiras', 'careers', 'jobs', 'hiring', 'recrutamento'],
      q: { pt: 'Preços, clientes, equipa…', en: 'Pricing, clients, team…' },
      a: {
        pt: 'Essa informação não está publicada no site — por exemplo preços, clientes, equipa, localização ou vagas. A melhor forma de saber é falar diretamente com a EDELPHIA pelas redes em [Contacto](#contacto).',
        en: 'That information isn’t published on the site — for example pricing, clients, team, location or openings. The best way to find out is to reach EDELPHIA directly through the profiles in [Contact](#contacto).',
      },
      next: ['contact', 'about'],
    },

    /* ---------- site help ---------- */
    {
      id: 'navigate',
      keys: ['navegar', 'navigate', 'navigation', 'seccoes', 'secoes', 'sections', 'menu', 'mapa do site', 'sitemap', 'onde encontro', 'where can i find', '~mostra', '~show me', 'leva me', 'take me', 'ir para', 'go to', '~pagina', '~page'],
      q: { pt: 'Que secções tem o site?', en: 'What sections does the site have?' },
      a: {
        pt: 'O site é uma página contínua com estas secções:\n- [Manifesto](#manifesto)\n- [Visão](#visao)\n- [Missão & Objetivos](#missao)\n- [Pilares](#pilares)\n- [Soluções end-to-end](#solucoes)\n- [Método](#metodo)\n- [Equação](#equacao)\n- [Contacto](#contacto)',
        en: 'The site is one continuous page with these sections:\n- [Manifesto](#manifesto)\n- [Vision](#visao)\n- [Mission & Objectives](#missao)\n- [Pillars](#pilares)\n- [End-to-end solutions](#solucoes)\n- [Method](#metodo)\n- [Equation](#equacao)\n- [Contact](#contacto)',
      },
      next: ['about', 'site_features'],
    },
    {
      id: 'language',
      keys: ['idioma', 'lingua', 'language', 'ingles', 'english', 'portugues', 'portuguese', 'traduzir', 'translate'],
      q: { pt: 'Como mudo o idioma?', en: 'How do I change the language?' },
      a: {
        pt: 'Use o botão **PT | EN** na barra de cima. A mudança é instantânea e fica guardada para a próxima visita. Eu respondo na língua em que me escrever.',
        en: 'Use the **PT | EN** switch in the top bar. It switches instantly and is remembered for your next visit. I reply in the language you write in.',
      },
      next: ['theme', 'navigate'],
    },
    {
      id: 'theme',
      keys: ['modo claro', 'modo escuro', 'light mode', 'dark mode', 'tema', 'theme', '~claro', '~escuro', '~light', '~dark', '~cores', '~colors', '~colours'],
      q: { pt: 'Como mudo para o modo claro?', en: 'How do I switch to light mode?' },
      a: {
        pt: 'Clique no botão **sol/lua** ao lado de PT | EN para alternar entre o modo escuro (predefinido) e o modo claro. A escolha fica guardada.',
        en: 'Click the **sun/moon** button next to PT | EN to switch between dark mode (the default) and light mode. Your choice is remembered.',
      },
      next: ['language', 'site_features'],
    },
    {
      id: 'site_features',
      keys: ['particulas', 'particles', 'animacao', 'animation', 'animacoes', 'animations', 'fundo', 'background', 'galaxia', 'galaxy', 'esfera', 'sphere', 'onda', 'wave', 'contador', 'counter', 'phi t', 'webgl', '3d', 'como foi feito', 'how was it made'],
      q: { pt: 'O que são as partículas?', en: 'What are the particles?' },
      a: {
        pt: 'O fundo é um campo de partículas em 3D que muda de forma com o scroll: o símbolo **Φ** no início, uma **galáxia de dados**, uma **rede neural** esférica, um **campo de onda** e de novo o **Φ** no contacto. O contador **Φ(t)** no canto acumula com o tempo e o scroll — uma brincadeira com Φ = ∫ knowledge · dt.',
        en: 'The background is a 3D particle field that changes shape as you scroll: the **Φ** symbol at the top, a **data galaxy**, a spherical **neural network**, a **wave field**, and the **Φ** again at contact. The **Φ(t)** counter in the corner accumulates with time and scrolling — a playful nod to Φ = ∫ knowledge · dt.',
      },
      next: ['equation', 'navigate'],
    },
  ];

  /* "tell me more" — answered from the previous intent's `more`, see chat.js */
  window.EDELPHIA_KB_MORE_KEYS = ['mais', 'mais detalhes', 'explica melhor', 'explique melhor', 'elabora', 'continua', 'diz me mais', 'conta me mais', 'more', 'tell me more', 'more details', 'elaborate', 'go on', 'explain more', 'details', 'detalhes'];

  window.EDELPHIA_KB_FALLBACK = {
    pt: 'Não encontrei isso no conteúdo do site. Posso ajudar com a empresa, a visão, os objetivos, as soluções de IA & ML, o método ou o contacto — experimente uma destas:',
    en: 'I couldn’t find that in the site’s content. I can help with the company, vision, objectives, AI & ML solutions, method or contact — try one of these:',
  };
  window.EDELPHIA_KB_FALLBACK_NEXT = ['about', 'solutions', 'mission', 'contact'];
})();
