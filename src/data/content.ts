/* ============================================================================
   Site content — single source of truth.
   Edit copy, links, and research items here; components render from this.
   ========================================================================== */

export type Status =
  | 'published'
  | 'preprint'
  | 'in-submission'
  | 'in-preparation'
  | 'software'
  | 'planned'

export const STATUS_LABEL: Record<Status, string> = {
  published: 'Published',
  preprint: 'Preprint · arXiv',
  'in-submission': 'In submission',
  'in-preparation': 'In preparation',
  software: 'Open source',
  planned: 'Planned',
}

/* ---- Profile ------------------------------------------------------------- */
export const profile = {
  name: 'Jason Carlson',
  title: 'AI Research Engineer',
  location: 'New York, NY',
  photo: '/profile.jpg',
  tagline:
    'I work on two threads: topology-guided exploration for applications like robotics, and using human policies to guide exploration in chess toward more human-like models.',
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
    'My research is focused on two things at the moment. The first is exploration — how an agent should seek out novel candidate spaces using topology-guided exploration. For a long time RL has been contrained by optimizing within a narrow, non-contractible, incomplete region of space – the hope with my new algorithms is they produce sample-efficient learning through optimizing within the correct domain from conception for applications like robotics.',
    'The second thread carries the same question into chess: using human policies to guide exploration over candidate moves, so that what a model searches — not only what it imitates — is shaped by how a particular person plays. The aim is models that are human-like because of where they look, rather than because they were fit to human moves after the fact.',
    'I hold an M.A. in Mathematics (4.0) and a B.S. in Computer Science (3.9) and B.S. in Mathematics from Arizona State University, with graduate coursework in analysis, topology, and abstract algebra.',
  ],
  interests: [
    'Topological navigation',
    'Exploration in RL',
    'Human-guided search',
    'Representation learning',
    'Clinical ML & reasoning fidelity',
  ],
}

/* ---- Research programs ---------------------------------------------------
   Each program renders as its own full-width section with a stage timeline.
   ------------------------------------------------------------------------- */
export interface ProgramStage {
  index: number
  /** Rail label, e.g. "Paper 1", "Library", "Next". */
  label: string
  title: string
  status: Status
  venue: string
  summary: string
  href?: string
  images?: { src: string; alt: string }[]
  imagesCaption?: string
  /** A single result figure, rendered larger than the gallery grid. */
  figure?: { src: string; alt: string; caption: string }
}

export interface Program {
  kicker: string
  name: string
  url?: string
  /** Short display text for the header link, e.g. "garrychess.ai". */
  urlLabel?: string
  blurb: string
  stages: ProgramStage[]
  video?: { src: string; caption: string }
}

const garrychess: Program = {
  kicker: 'Research program · Human-guided search',
  name: 'GarryChess',
  url: 'https://www.garrychess.ai',
  urlLabel: 'garrychess.ai',
  blurb:
    'A multi-year research program on using human policies to guide exploration in chess — letting a model of how a specific person plays decide which moves are worth searching at all. Three connected papers move from imitation, to a style representation disentangled from strength, to a learned controller that spends engine search where that person would look.',
  video: {
    src: '/reinforcement_learning_human_chess_example.mp4',
    caption:
      'Teaser — a rough preview of what Paper 3 (adaptive engine consultation) is aiming for.',
  },
  stages: [
    {
      index: 1,
      label: 'Paper 1',
      title:
        'Beyond Imitation: Preference-Optimized Policies for Realistic Grandmaster Chess',
      status: 'published',
      venue: 'IEEE Conference on Games (CoG) 2026 · Oral',
      summary:
        'Style-weighted preference optimization (DPO variants) fine-tunes a human move model toward a target grandmaster, producing play that is both strong and recognizably in-style. First author, team of three.',
      href: 'https://drive.google.com/file/d/15fAJXPF2haC8Y6Gw3452G2hU8vtzsO-E/view?usp=sharing',
    },
    {
      index: 2,
      label: 'Paper 2',
      title: 'Matilda: Engine-Agnostic Search with Human Policy Guidance',
      status: 'preprint',
      venue: 'Preprint on arXiv · AAAI submission pending',
      summary:
        'Matilda decouples search from neural human-policy priors, then recombines them through a residual re-ranker to achieve state-of-the-art elite chess move prediction (+18.5% over Maia-3 23M).',
      href: 'https://arxiv.org/abs/2606.25176',
    },
    {
      index: 3,
      label: 'Paper 3',
      title:
        'Learned, Adaptive Engine Consultation for Human Move Prediction',
      status: 'in-preparation',
      venue: 'In preparation',
      summary:
        'A reinforcement-learning controller that decides — from the Maia-3 hidden representation of the board and recent moves — which candidate moves are worth searching with Stockfish and how deeply, under a compute budget. Reward is tied to downstream move-prediction and style fidelity per unit of engine compute.',
    },
  ],
}

const topology: Program = {
  kicker: 'Research program · Exploration',
  name: 'Topological Exploration',
  url: 'https://github.com/jcarlson212/TopoGym',
  urlLabel: 'TopoGym on GitHub',
  blurb:
    'A research program on exploration that uses the shape of an environment — the loops, enclosed chambers, and one-way passages that generic novelty-seeking treats as noise. TopoGym makes topological RL environments widely available; TopoExplore tests whether an agent can exploit them.',
  stages: [
    {
      index: 1,
      label: 'Library',
      title:
        'TopoGym: Environments and Benchmarks for Topological Exploration in RL',
      status: 'software',
      venue: 'Open-source Python library · Gymnasium API',
      summary:
        'Gridworld environments whose shape — chambers, decoys, loops, and edge identifications — is certified at generation time from the free-space cell complex, with everything deterministic up to seeds. One benchmark, TopoGym-v1, in three slices: GridWorld2D families varying size, chamber and decoy count, shape, nesting, and bottlenecks; Texture environments with semantic local signals that fail in controlled ways; and Top environments on the cylinder, Möbius band, torus, Klein bottle, and RP² with zero local signal. Includes trajectory-level TDA tools for measuring what an agent actually discovered.',
      href: 'https://github.com/jcarlson212/TopoGym',
      images: [
        { src: '/topogym/iceship.gif', alt: 'EnvironmentalIceShip: ship in an ice field where winter freezes the channel shut' },
        { src: '/topogym/clown-chase.gif', alt: 'ClownChase: wandering distractor paying a depleting trickle of reward' },
        { src: '/topogym/space-warp.gif', alt: 'SpaceWarp: doorless treasure chamber reachable only through one wormhole among thirty' },
        { src: '/topogym/dont-fall.gif', alt: 'DontFall: forest ring around a fatal drop where the most novel direction is the worst one' },
        { src: '/topogym/search-rescue.gif', alt: 'SearchRescue: trapped survivor in the only large persistent hole of a shrapnel field' },
        { src: '/topogym/bank-robber.gif', alt: 'BankRobber environment' },
        { src: '/topogym/nested3.gif', alt: 'Nested3: three nested chambers with hidden doors' },
        { src: '/topogym/top-torus.gif', alt: 'TopTorus: torus world with identified edges drawn as fundamental-polygon arrows' },
      ],
      imagesCaption:
        'From the TopoGym-v1 gallery: EnvironmentalIceShip, ClownChase, SpaceWarp, DontFall, SearchRescue, BankRobber, Nested3, TopTorus. Rendering dims everything outside the agent’s line of sight; hidden structure is revealed on demand.',
    },
    {
      index: 2,
      label: 'Paper 1',
      title: 'TopoExplore: Topology-Guided Exploration for RL',
      status: 'in-preparation',
      venue: 'In preparation',
      summary:
        'Proof of concept for topology-guided exploration in simple grid spaces, building on top of the work of Go-Explore in hard RL exploration and evaluated on the TopoGym benchmarks.',
      figure: {
        src: '/topoexplore/solve-profile.png',
        alt: 'Solve profile: fraction of TopoGym worlds solved against training steps, comparing Go-Explore with three TopoExplore variants. All three TopoExplore curves rise faster and settle higher than Go-Explore.',
        caption:
          'Preview of work in progress — solve profile over a few dozen TopoGym worlds, several seeds each; bands are the spread across seeds. The coverage Go-Explore reaches at 1M steps is matched by TopoExplore at about 0.5M, and by the curvature variants at about 0.3M. Curvature does nearly all of that work — TE + both tracks it closely.',
      },
    },
    {
      index: 3,
      label: 'Next',
      title: 'More to come',
      status: 'planned',
      venue: 'Planned',
      summary:
        'If TopoExplore proves out, the plan is to move to robotics environments, where the same exploration machinery applies directly to exploring the real world — and from there to world models, finding exploration opportunities in the latent space.',
    },
  ],
}

export const programs: Program[] = [topology, garrychess]

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
    href: 'https://docs.google.com/document/d/1HFvOFimXU8G6AL21yJkcq3okjf4Dxz0A0LRsxWaVJ_4/edit?usp=sharing',
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
  /** Optional label (e.g. "Article") to distinguish non-peer-reviewed work. */
  type?: string
}

export const publications: Publication[] = [
  {
    title:
      'Beyond Imitation: Preference-Optimized Policies for Realistic Grandmaster Chess',
    authors: 'J. Carlson, et al.',
    venue: 'IEEE Conference on Games (CoG) — Oral',
    year: '2026',
    status: 'published',
    href: 'https://drive.google.com/file/d/15fAJXPF2haC8Y6Gw3452G2hU8vtzsO-E/view?usp=sharing',
  },
  {
    title: 'Matilda: Engine-Agnostic Search with Human Policy Guidance',
    authors: 'J. Carlson',
    venue: 'Preprint on arXiv (AAAI submission pending)',
    year: '2026',
    status: 'preprint',
    href: 'https://arxiv.org/abs/2606.25176',
  },
  {
    title: 'The Use of AutoML for Predicting Intracranial Aneurysm Rupture',
    authors: 'Co-authored',
    venue: 'Congress of Neurological Surgeons (CNS) — Poster',
    year: '2025',
    status: 'published',
    href: 'https://docs.google.com/document/d/1HFvOFimXU8G6AL21yJkcq3okjf4Dxz0A0LRsxWaVJ_4/edit?usp=sharing',
  },
  {
    title:
      'How Amazon Search Reduced ML Inference Costs by 85% with AWS Inferentia',
    authors: 'J. Moura, J. Carlson, J. Singh, et al.',
    venue: 'AWS Machine Learning Blog',
    year: '2022',
    status: 'published',
    type: 'Article',
    href: 'https://aws.amazon.com/blogs/machine-learning/how-amazon-search-reduced-ml-inference-costs-by-85-with-aws-inferentia/',
  },
]

export const meta = {
  /** Bump when content changes meaningfully. */
  updated: 'July 2026',
}
