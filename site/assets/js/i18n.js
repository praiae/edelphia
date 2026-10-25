/* =========================================================
   EDELPHIA — copy (PT / EN)
   Every element with data-i18n="key" gets its innerHTML from here.
   ========================================================= */
(function () {
  'use strict';

  const marquee = (items, sym) => {
    const once = items.map(t => `<span>${t}</span><i>${sym}</i>`).join('');
    return once + once;
  };

  window.EDELPHIA_I18N = {
    pt: {
      'meta.title': 'EDELPHIA — Science · Algorithms · Intelligence',
      'meta.desc': 'EDELPHIA — soluções end-to-end de inteligência artificial e machine learning. Φ = ∫ knowledge · dt.',
      'lang.label': 'Mudar idioma',
      'theme.label': 'Alternar modo claro / escuro',
      'stages': ['Símbolo', 'Galáxia de dados', 'Rede neural', 'Campo de onda', 'Integração'],

      'nav.vision': 'Visão',
      'nav.mission': 'Missão',
      'nav.solutions': 'Soluções',
      'nav.method': 'Método',
      'nav.equation': 'Equação',
      'nav.contact': 'Contacto',
      'nav.cta': 'Fale connosco',

      'hero.lead': 'Soluções end-to-end de IA &amp; Machine Learning. Transformamos dados em conhecimento — e conhecimento em decisões que se acumulam no tempo.',
      'hero.cursor': 'Descer',

      'manifesto.tag': 'Manifesto',
      'manifesto.text': 'A inteligência não é um momento. É uma soma. Cada dado, cada experiência, cada algoritmo acrescenta uma fração ao todo. A EDELPHIA existe para integrar essas frações — com rigor científico, engenharia precisa e uma obsessão por resultados que crescem com o tempo.',
      'manifesto.foot1': 'Do ruído ao sinal.<br>Do sinal ao sentido.',
      'manifesto.foot2': '[ dados → modelos → decisões ]',

      'vision.tag': 'Visão',
      'vision.title': 'Organizações que <em>aprendem</em><br>tão depressa quanto o mundo muda.',
      'vision.thesisLabel': 'Tese 1.',
      'vision.thesis': 'O valor de um sistema inteligente não é o conhecimento que detém num instante, mas o integral do conhecimento que adquire, valida e converte em ação ao longo do tempo.',
      'vision.abstractLabel': 'Resumo',
      'vision.abstract': 'Imaginamos um futuro em que cada organização funciona como um sistema inferencial que se aperfeiçoa a si próprio: trata cada decisão como uma crença <i>a posteriori</i> e não como uma estimativa pontual, atualiza essa crença à medida que a evidência se acumula e quantifica a sua própria incerteza com o mesmo rigor que aplica às previsões. Neste futuro, a inteligência artificial não é um modelo isolado, mas um ciclo epistémico fechado — observação, representação, inferência, intervenção, retroação — concebido de ponta a ponta. A visão da EDELPHIA é ser o parceiro científico e de engenharia que torna este ciclo fiável, explicável e cumulativo em valor, eliminando o fosso persistente entre a investigação de fronteira e os sistemas que perduram em produção.',
      'vision.kwLabel': 'Palavras-chave',
      'vision.keywords': '<span>Inferência bayesiana</span><span>Aprendizagem de representações</span><span>Inferência causal</span><span>Quantificação de incerteza</span><span>MLOps</span><span>Teoria da decisão</span>',

      'mission.tag': 'Missão &amp; Objetivos',
      'mission.title': 'Da hipótese<br><em>à produção.</em>',
      'mission.generalLabel': 'Objetivo geral',
      'mission.general': 'Conceber, validar e implementar sistemas de inteligência artificial e machine learning de ponta a ponta que transformem dados heterogéneos e ruidosos em decisões estatisticamente sólidas, causalmente fundamentadas, explicáveis e em melhoria contínua — de forma mensurável e em produção.',
      'mission.specificLabel': 'Objetivos específicos',
      'o1.title': 'Rigor epistémico',
      'o1.text': 'Fundamentar cada modelo numa hipótese falsificável, com métricas pré-registadas, incerteza preditiva calibrada e avaliação sob mudança de distribuição — e não apenas em dados de teste.',
      'o2.title': 'Generalização',
      'o2.text': 'Aprender representações que transferem para além da distribuição de treino, controlando explicitamente o fosso entre o risco empírico e o risco populacional através de regularização, desenho centrado nos dados e validação robusta.',
      'o3.title': 'Causalidade &amp; explicabilidade',
      'o3.text': 'Passar da correlação à intervenção: estimar efeitos causais sob pressupostos de identificação explícitos e produzir explicações fiéis ao mecanismo do modelo — não narrativas <i>post hoc</i>.',
      'o4.title': 'Continuidade ponta a ponta',
      'o4.text': 'Fechar o ciclo desde a ingestão de dados até à monitorização em produção — pipelines versionados, reprodutíveis e observáveis, nos quais os modelos detetam drift e aprendem com segurança à medida que o mundo evolui.',

      'pillars.tag': 'Pilares',
      'pillars.title': 'Três forças.<br><em>Um único vetor.</em>',
      'p1.text': 'Método antes do modelo. Hipóteses claras, experiências reprodutíveis e evidência medida — não intuição.',
      'p1.list': '<li>Investigação aplicada</li><li>Estatística &amp; inferência</li><li>Validação rigorosa</li>',
      'p2.text': 'Engenharia que escala. Código eficiente, sistemas robustos e otimização até ao último milissegundo.',
      'p2.list': '<li>Otimização</li><li>Sistemas distribuídos</li><li>Engenharia de dados</li>',
      'p3.text': 'IA &amp; machine learning que aprendem e explicam — ao serviço de decisões reais, com transparência.',
      'p3.list': '<li>Machine &amp; deep learning</li><li>Linguagem &amp; visão</li><li>IA explicável</li>',

      'solutions.tag': 'Soluções end-to-end',
      'solutions.title': 'Dos dados em bruto<br><em>às decisões em produção.</em>',
      'solutions.lead': 'Assumimos todo o ciclo de vida de IA &amp; ML — uma equipa, um pipeline responsável, sem perdas entre a estratégia e a produção.',
      's1.title': 'Estratégia', 's1.text': 'Enquadramento do problema, hipóteses de valor e viabilidade.',
      's2.title': 'Dados', 's2.text': 'Ingestão, qualidade, governação e feature stores.',
      's3.title': 'Modelos', 's3.text': 'ML, deep learning e LLMs — concebidos e validados.',
      's4.title': 'MLOps', 's4.text': 'Versionamento, CI/CD e treino reprodutível.',
      's5.title': 'Implementação', 's5.text': 'APIs, edge e cloud — em escala, com baixa latência.',
      's6.title': 'Monitorização', 's6.text': 'Drift, desempenho e retreino contínuo.',
      'solutions.capLabel': 'Competências em IA &amp; ML',
      'solutions.chips': '<span>Machine Learning</span><span>Deep Learning</span><span>IA Generativa &amp; LLMs</span><span>Visão Computacional</span><span>Processamento de Linguagem Natural</span><span>Previsão de Séries Temporais</span><span>Sistemas de Recomendação</span><span>Inferência Causal</span><span>Otimização Matemática</span><span>MLOps</span>',

      'method.tag': 'Método',
      'method.title': 'Quatro passos.<br><em>Iteração infinita.</em>',
      'method.hint': '← arrastar com o scroll →',
      'm1.title': 'Observar', 'm1.text': 'Mapeamos o problema e os dados disponíveis. Perguntas certas antes de respostas rápidas.',
      'm2.title': 'Modelar', 'm2.text': 'Formalizamos o conhecimento: estrutura, variáveis, restrições. A matemática por baixo de tudo.',
      'm3.title': 'Treinar', 'm3.text': 'Os modelos aprendem, falham, corrigem. Medimos cada época até o erro deixar de ser ruído.',
      'm4.title': 'Integrar', 'm4.text': 'Levamos o modelo à produção e ao dia a dia. O conhecimento soma-se — e volta ao início.',

      'equation.tag': 'Equação',
      'equation.lead': 'O valor não está num único dado — está na área sob a curva. Integramos conhecimento ao longo do tempo para que cada decisão seja melhor do que a anterior.',

      'stats.k1': 'Modelos em produção',
      'stats.k2': 'Eventos processados / mês',
      'stats.k3': 'Disponibilidade',
      'stats.k4': 'Latência média de inferência',

      'marquee.1': marquee(['IA &amp; Machine Learning', 'Soluções End-to-end', 'Deep Learning', 'IA Generativa'], 'Φ'),
      'marquee.2': marquee(['Engenharia de Dados', 'Visão Computacional', 'MLOps', 'Previsão'], '∫'),

      'cta.tag': 'Contacto',
      'cta.title': 'Vamos integrar<br><em>o seu conhecimento.</em>',
      'cta.lead': 'Acompanhe o nosso trabalho e comece a conversa.',

      'footer.top': 'Voltar ao topo ↑',
    },

    en: {
      'meta.title': 'EDELPHIA — Science · Algorithms · Intelligence',
      'meta.desc': 'EDELPHIA — end-to-end artificial intelligence and machine learning solutions. Φ = ∫ knowledge · dt.',
      'lang.label': 'Change language',
      'theme.label': 'Toggle light / dark mode',
      'stages': ['Symbol', 'Data galaxy', 'Neural network', 'Wave field', 'Integration'],

      'nav.vision': 'Vision',
      'nav.mission': 'Mission',
      'nav.solutions': 'Solutions',
      'nav.method': 'Method',
      'nav.equation': 'Equation',
      'nav.contact': 'Contact',
      'nav.cta': 'Contact us',

      'hero.lead': 'End-to-end AI &amp; Machine Learning solutions. We turn data into knowledge — and knowledge into decisions that compound over time.',
      'hero.cursor': 'Scroll',

      'manifesto.tag': 'Manifesto',
      'manifesto.text': 'Intelligence is not a moment. It is a sum. Every datum, every experiment, every algorithm adds a fraction to the whole. EDELPHIA exists to integrate those fractions — with scientific rigour, precise engineering and an obsession with results that compound over time.',
      'manifesto.foot1': 'From noise to signal.<br>From signal to meaning.',
      'manifesto.foot2': '[ data → models → decisions ]',

      'vision.tag': 'Vision',
      'vision.title': 'Organisations that <em>learn</em><br>as fast as the world changes.',
      'vision.thesisLabel': 'Thesis 1.',
      'vision.thesis': 'The value of an intelligent system is not the knowledge it holds at an instant, but the integral of the knowledge it acquires, validates and acts upon over time.',
      'vision.abstractLabel': 'Abstract',
      'vision.abstract': 'We envision a future in which every organisation operates as a self-improving inferential system: one that treats each decision as a <i>posterior</i> belief rather than a point estimate, updates that belief as evidence accumulates, and quantifies its own uncertainty with the same rigour it applies to its predictions. In this future, artificial intelligence is not an isolated model but a closed epistemic loop — observation, representation, inference, intervention, feedback — engineered end to end. EDELPHIA’s vision is to be the scientific and engineering partner that makes this loop reliable, explainable and economically compounding, closing the persistent gap between frontier research and systems that endure in production.',
      'vision.kwLabel': 'Keywords',
      'vision.keywords': '<span>Bayesian inference</span><span>Representation learning</span><span>Causal inference</span><span>Uncertainty quantification</span><span>MLOps</span><span>Decision theory</span>',

      'mission.tag': 'Mission &amp; Objectives',
      'mission.title': 'From hypothesis<br><em>to production.</em>',
      'mission.generalLabel': 'General objective',
      'mission.general': 'To design, validate and deploy end-to-end artificial intelligence and machine learning systems that transform heterogeneous, noisy data into decisions that are statistically sound, causally grounded, explainable and continuously improving — measurably, and in production.',
      'mission.specificLabel': 'Specific objectives',
      'o1.title': 'Epistemic rigour',
      'o1.text': 'Ground every model in a falsifiable hypothesis, with pre-registered metrics, calibrated predictive uncertainty and evaluation under distribution shift — not merely on held-out data.',
      'o2.title': 'Generalisation',
      'o2.text': 'Learn representations that transfer beyond the training distribution, explicitly controlling the gap between empirical and population risk through regularisation, data-centric design and robust validation.',
      'o3.title': 'Causality &amp; explainability',
      'o3.text': 'Move from correlation to intervention: estimate causal effects under explicit identification assumptions and deliver explanations faithful to the model’s mechanism — not <i>post hoc</i> narratives.',
      'o4.title': 'End-to-end continuity',
      'o4.text': 'Close the loop from data ingestion to production monitoring — versioned, reproducible and observable pipelines in which models detect drift and learn safely as the world evolves.',

      'pillars.tag': 'Pillars',
      'pillars.title': 'Three forces.<br><em>A single vector.</em>',
      'p1.text': 'Method before model. Clear hypotheses, reproducible experiments and measured evidence — not intuition.',
      'p1.list': '<li>Applied research</li><li>Statistics &amp; inference</li><li>Rigorous validation</li>',
      'p2.text': 'Engineering that scales. Efficient code, robust systems and optimisation down to the last millisecond.',
      'p2.list': '<li>Optimisation</li><li>Distributed systems</li><li>Data engineering</li>',
      'p3.text': 'AI &amp; machine learning that learn and explain — in service of real decisions, with transparency.',
      'p3.list': '<li>Machine &amp; deep learning</li><li>Language &amp; vision</li><li>Explainable AI</li>',

      'solutions.tag': 'End-to-end solutions',
      'solutions.title': 'From raw data<br><em>to decisions in production.</em>',
      'solutions.lead': 'We own the entire AI &amp; ML lifecycle — one team, one accountable pipeline, nothing lost between strategy and production.',
      's1.title': 'Strategy', 's1.text': 'Problem framing, value hypotheses and feasibility.',
      's2.title': 'Data', 's2.text': 'Ingestion, quality, governance and feature stores.',
      's3.title': 'Models', 's3.text': 'ML, deep learning and LLMs — designed and validated.',
      's4.title': 'MLOps', 's4.text': 'Versioning, CI/CD and reproducible training.',
      's5.title': 'Deployment', 's5.text': 'APIs, edge and cloud — at scale, with low latency.',
      's6.title': 'Monitoring', 's6.text': 'Drift, performance and continuous retraining.',
      'solutions.capLabel': 'AI &amp; ML capabilities',
      'solutions.chips': '<span>Machine Learning</span><span>Deep Learning</span><span>Generative AI &amp; LLMs</span><span>Computer Vision</span><span>Natural Language Processing</span><span>Time-series Forecasting</span><span>Recommender Systems</span><span>Causal Inference</span><span>Mathematical Optimisation</span><span>MLOps</span>',

      'method.tag': 'Method',
      'method.title': 'Four steps.<br><em>Infinite iteration.</em>',
      'method.hint': '← drag with the scroll →',
      'm1.title': 'Observe', 'm1.text': 'We map the problem and the data at hand. The right questions before fast answers.',
      'm2.title': 'Model', 'm2.text': 'We formalise knowledge: structure, variables, constraints. The mathematics beneath everything.',
      'm3.title': 'Train', 'm3.text': 'Models learn, fail and correct. We measure every epoch until the error stops being noise.',
      'm4.title': 'Integrate', 'm4.text': 'We take the model into production and daily operations. Knowledge adds up — and loops back to the start.',

      'equation.tag': 'Equation',
      'equation.lead': 'Value does not live in a single data point — it lives in the area under the curve. We integrate knowledge over time so that every decision is better than the last.',

      'stats.k1': 'Models in production',
      'stats.k2': 'Events processed / month',
      'stats.k3': 'Availability',
      'stats.k4': 'Average inference latency',

      'marquee.1': marquee(['AI &amp; Machine Learning', 'End-to-end Solutions', 'Deep Learning', 'Generative AI'], 'Φ'),
      'marquee.2': marquee(['Data Engineering', 'Computer Vision', 'MLOps', 'Forecasting'], '∫'),

      'cta.tag': 'Contact',
      'cta.title': 'Let’s integrate<br><em>your knowledge.</em>',
      'cta.lead': 'Follow our work and start the conversation.',

      'footer.top': 'Back to top ↑',
    },
  };
})();
