/* ============================================================================
   Site content — single source of truth.
   Edit copy, links, and research items here; components render from this.
   ========================================================================== */

export type Status = 'published' | 'in-submission' | 'in-preparation'

export const STATUS_LABEL: Record<Status, string> = {
  published: 'Published',
  'in-submission': 'In submission',
  'in-preparation': 'In preparation',
}

/* ---- Profile ------------------------------------------------------------- */
export const profile = {
  name: 'Jason Carlson',
  title: 'ML Research Engineer',
  location: 'New York, NY',
  tagline:
    'I work on two threads: personalizing policies through LLM fine-tuning and reinforcement learning, and exploration for applications like robotics — driven by latent prediction errors (ICM) and topological navigation.',
  email: 'jcarlson212@gmail.com',
  links: {
    github: 'https://github.com/jcarlson212',
    linkedin: 'https://www.linkedin.com/in/jason-carlson-sde',
    cv: '/cv.pdf',
  },
}

/* ---- About / bio --------------------------------------------------------- */
export const about = {
  paragraphs: [
    "I'm an ML research engineer in New York. For the last five years I've built and deployed large-scale machine-learning and reinforcement-learning systems in production — credit-risk models, distributed inference serving over a billion embeddings a day, and safety-constrained RL — first at Amazon and AppLovin, and now as an independent researcher.",
    'My research sits at the intersection of human-aligned modeling and reinforcement learning: I want models that capture how *particular people* decide, not just what is optimal. Chess is my main model system — it offers near-unlimited labeled human decisions across the full skill spectrum — but the same questions show up in clinical decision-making and in the reliability of model-generated reasoning.',
    'I hold an M.A. in Mathematics (4.0) and a B.S. in Computer Science (3.9) and B.S. in Mathematics from Arizona State University, with graduate coursework in analysis, topology, and abstract algebra.',
  ],
  interests: [
    'Human-aligned policy learning',
    'Reinforcement learning & exploration',
    'Preference optimization (DPO variants)',
    'Representation learning',
    'Clinical ML & reasoning fidelity',
  ],
}

/* ---- Flagship project: GarryChess --------------------------------------- */
export interface ResearchStage {
  index: number
  title: string
  status: Status
  venue: string
  summary: string
  href?: string
}

export const garrychess = {
  name: 'GarryChess',
  url: 'https://www.garrychess.ai',
  blurb:
    'A multi-year research program on modeling individual human chess play — how a specific person, at a specific strength, actually chooses their moves. Three connected papers build from imitation, to disentangled style, to adaptive engine search.',
  stages: [
    {
      index: 1,
      title:
        'Beyond Imitation: Preference-Optimized Policies for Realistic Grandmaster Chess',
      status: 'published',
      venue: 'IEEE Conference on Games (CoG) 2026 · Oral',
      summary:
        'Style-weighted preference optimization (DPO variants) fine-tunes a human move model toward a target grandmaster, producing play that is both strong and recognizably in-style. First author, team of three.',
      href: 'https://docs.google.com/document/d/1HFvOFimXU8G6AL21yJkcq3okjf4Dxz0A0LRsxWaVJ_4/edit?usp=sharing',
    },
    {
      index: 2,
      title:
        'Elo-Disentangled Player-Style Embeddings via a Rating-Conditioned Residual Move Model',
      status: 'in-submission',
      venue: 'Targeting AAAI 2027',
      summary:
        'A compact per-player embedding that captures style disentangled from strength (linear probe recovers rating at only R²=0.06). A rating-conditioned base model — Maia-3 policy plus Stockfish features — explains rating-typical play; a frozen residual leaves the embedding to encode only how a player deviates.',
      href: 'https://www.garrychess.ai',
    },
    {
      index: 3,
      title:
        'Learned, Adaptive Engine Consultation for Human Move Prediction',
      status: 'in-preparation',
      venue: 'In preparation',
      summary:
        'A reinforcement-learning controller that decides — from the Maia-3 hidden representation of the board and recent moves — which candidate moves are worth searching with Stockfish and how deeply, under a compute budget. Reward is tied to downstream move-prediction and style fidelity per unit of engine compute.',
    },
  ] as ResearchStage[],
}

/* ---- Other research ------------------------------------------------------ */
export interface ResearchItem {
  title: string
  status: Status
  venue: string
  summary: string
  tags: string[]
  href?: string
}

export const otherResearch: ResearchItem[] = [
  {
    title:
      'The Use of AutoML for Predicting Intracranial Aneurysm Rupture',
    status: 'published',
    venue: 'Congress of Neurological Surgeons (CNS) 2025 · Poster',
    summary:
      'Benchmarks automated machine learning against hand-engineered pipelines for clinical aneurysm-rupture risk prediction. Co-author.',
    tags: ['Clinical ML', 'AutoML'],
    href: 'https://drive.google.com/file/d/15fAJXPF2haC8Y6Gw3452G2hU8vtzsO-E/view?usp=sharing',
  },
  {
    title: 'TopoExplore: Topology-Guided Exploration for RL',
    status: 'in-preparation',
    venue: 'In preparation',
    summary:
      'Topology-guided exploration for reinforcement learning, with a benchmark suite and baselines on MiniGrid DoorKey; algorithm and ablations in progress.',
    tags: ['Reinforcement learning', 'Exploration'],
  },
]

/* ---- Experience ---------------------------------------------------------- */
export interface Job {
  org: string
  role: string
  period: string
  points: string[]
  stack?: string
}

export const experience: Job[] = [
  {
    org: 'Independent AI Researcher',
    role: 'Research',
    period: '2025 — Present',
    points: [
      'Evaluating the safety and fidelity of LLM-generated reasoning in clinical decision-making (aneurysm rupture risk) — analyzing misleading explanations and overconfidence.',
      'Training preference-optimized policies (DPO variants) to model human decision-making in chess (garrychess.ai); accepted as an IEEE CoG oral.',
      'Researching robust exploration methods in reinforcement learning.',
    ],
  },
  {
    org: 'Amazon',
    role: 'Software Engineer II',
    period: '2021 — 2026',
    points: [
      'Led a supervised credit-extension model trained on 1M+ payment-failure labels, replacing a rule-based system and generating an estimated $43M annual profit (+200%).',
      'Designed RL-based credit-allocation experiments (PPO + safety constraints) to optimize long-term outcomes under risk limits.',
      'Built an inference service for a BERT-class embedding model generating 1B+ embeddings/day on AWS Inferentia; fine-tuned a foundation model for ticket root-cause analysis (SFT + Ray).',
    ],
    stack: 'PyTorch · Ray · JAX · Spark · AWS',
  },
  {
    org: 'AppLovin',
    role: 'Senior Software Engineer',
    period: '2024 — 2025',
    points: [
      'Built a large-scale identity-graph system, cutting infrastructure cost by $1.8M/year and improving cold-start latency by 87.5%.',
    ],
    stack: 'Spark · Airflow · Java · Delta Lake · GCP',
  },
]

/* ---- Education ----------------------------------------------------------- */
export const education = [
  {
    school: 'Arizona State University',
    degree: 'M.A. Mathematics',
    detail: 'GPA 4.0 · Analysis, topology, abstract algebra',
    year: '2021',
  },
  {
    school: 'Arizona State University',
    degree: 'B.S. Computer Science · B.S. Mathematics',
    detail: "GPA 3.9 · Dean's Scholarship · Outstanding Junior, Math Dept.",
    year: '2020',
  },
]

/* ---- Selected earlier projects ------------------------------------------ */
export interface Project {
  name: string
  year: string
  summary: string
  href?: string
}

export const projects: Project[] = [
  {
    name: 'Chaos-Theory Website',
    year: '2020',
    summary:
      'Interactive simulations of chaotic differential equations (React, MATLAB, React-vis) alongside the underlying theorems.',
    href: 'https://jcarlson212.github.io/Chaos-Theory/',
  },
  {
    name: 'Search Algorithm Visualizer',
    year: '2020',
    summary: 'Visualizes DFS, BFS, and A* pathfinding in the browser. Built with React.',
    href: 'https://jcarlson212.github.io/Path-Finding-Visualizer/',
  },
  {
    name: 'Berkeley Pac-Man AI',
    year: '2019',
    summary:
      'Search and adversarial agents for the Berkeley Pac-Man projects — 100% across all projects.',
  },
]

/* ---- Publication list (formal) ------------------------------------------ */
export interface Publication {
  title: string
  authors: string
  venue: string
  year: string
  status: Status
  href?: string
}

export const publications: Publication[] = [
  {
    title:
      'Beyond Imitation: Preference-Optimized Policies for Realistic Grandmaster Chess',
    authors: 'J. Carlson, et al.',
    venue: 'IEEE Conference on Games (CoG) — Oral',
    year: '2026',
    status: 'published',
    href: 'https://docs.google.com/document/d/1HFvOFimXU8G6AL21yJkcq3okjf4Dxz0A0LRsxWaVJ_4/edit?usp=sharing',
  },
  {
    title:
      'Elo-Disentangled Player-Style Embeddings via a Rating-Conditioned Residual Move Model',
    authors: 'J. Carlson',
    venue: 'In submission (targeting AAAI 2027)',
    year: '2026',
    status: 'in-submission',
  },
  {
    title: 'The Use of AutoML for Predicting Intracranial Aneurysm Rupture',
    authors: 'Co-authored',
    venue: 'Congress of Neurological Surgeons (CNS) — Poster',
    year: '2025',
    status: 'published',
    href: 'https://drive.google.com/file/d/15fAJXPF2haC8Y6Gw3452G2hU8vtzsO-E/view?usp=sharing',
  },
]

export const meta = {
  /** Bump when content changes meaningfully. */
  updated: 'June 2026',
}
