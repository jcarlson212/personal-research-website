/* ============================================================================
   Site content — single source of truth.
   Edit copy, links, and research items here; components render from this.
   ========================================================================== */

/* ---- Profile ------------------------------------------------------------- */
export const profile = {
  name: 'Jason Carlson',
  photo: '/profile_oct_23.jpg',
  email: 'jcarlson212@gmail.com',
  /** One paragraph. `**text**` renders bold. */
  bio:
    "I'm a visiting researcher at NYU working on **exploration in reinforcement learning**. A robot learns well only where its training data lives. My goal is to improve that state-visitation distribution so it is broad and well-structured relative to both the control prior and the task at hand from the start, using the topology of what the agent has already seen. This is to make exploration robust enough to transfer to hard robotics problems such as **manipulation**. Before research, I spent five years building large-scale ML and RL systems at Amazon and AppLovin.",
  role: 'Visiting Researcher, NYU',
  links: [
    { label: 'CV', href: '/cv.pdf' },
    { label: 'Email', href: 'mailto:jcarlson212@gmail.com' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=Z2rbMF8AAAAJ&hl=en' },
    { label: 'Github', href: 'https://github.com/jcarlson212' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jason-carlson-sde' },
  ],
}

/* ---- News (newest first) -------------------------------------------------- */
export const news: { date: string; text: string; href?: string }[] = [
  { date: 'Nov 2026', text: 'Submitted an extended abstract to RSS 2027.' },
  { date: 'Oct 2026', text: 'Joined Benjamin Riviere at NYU as a visiting researcher.' },
  { date: 'Aug 2026', text: 'New blog post: A Tour of TopoGym.', href: '/blog/a_tour_of_topogym' },
  { date: 'Jul 2026', text: 'TopoExplore preprint on arXiv.', href: 'https://arxiv.org/abs/2607.09971' },
  { date: 'Jun 2026', text: 'Matilda preprint on arXiv; under review at AAAI 2027.', href: 'https://arxiv.org/abs/2606.25176' },
  { date: 'May 2026', text: 'Left Amazon to work full-time as an independent researcher.' },
]

/* ---- Research themes ------------------------------------------------------ */
export const themes: { name: string; text: string; papers: { label: string; href: string }[] }[] = [
  {
    name: 'Exploration in RL',
    text: 'Exploration methods that use the topological structure of where an agent has already been, from archive-based exploration over topological benchmarks to online RL for locomotion and manipulation.',
    papers: [
      { label: 'MSPT', href: '#mspt' },
      { label: 'TopoExplore', href: '#topoexplore' },
      { label: 'TopoGym', href: '#topogym' },
    ],
  },
  {
    name: 'Human-guided search',
    text: 'Using a model of how a specific person plays chess to decide which moves are worth searching, so that what a model explores is shaped by that person. In the longer run: robots that can tell when a gap in their experience is worth a person\'s attention.',
    papers: [
      { label: 'Beyond Imitation', href: '#beyond-imitation' },
      { label: 'Matilda', href: '#matilda' },
      { label: 'garrychess.ai', href: 'https://www.garrychess.ai' },
    ],
  },
]

/* ---- Publications ---------------------------------------------------------
   Newest first. `authors` is printed with the site owner's name in bold.
   `media` renders inline under the entry.
   ------------------------------------------------------------------------- */
export type Media =
  | { kind: 'figure'; src: string; alt: string; caption?: string }
  | { kind: 'gallery'; images: { src: string; alt: string }[]; caption?: string }
  | { kind: 'tabs'; demos: { label: string; src: string; alt: string }[]; caption?: string }
  | { kind: 'video'; src: string; caption?: string }

export interface Paper {
  /** Anchor id, used by the research themes. */
  id: string
  title: string
  /** One-line takeaway shown under the links. */
  tldr?: string
  authors?: string
  /** Each item is a bold line (venue, award, status). */
  venue: string[]
  links: { label: string; href: string }[]
  media?: Media
}

export const publications: Paper[] = [
  {
    id: 'mspt',
    title: 'Minimum Spanning Persistence Trees for Robotics',
    tldr: 'An RL exploration paper looking at new ways to use state entropy.',
    venue: ['In preparation for RSS 2027', 'Draft ready for the extended-abstract submission'],
    links: [],
    media: {
      kind: 'tabs',
      demos: [
        { label: 'Trossen strike', src: '/mspt/trossen-strike.gif', alt: 'Trossen arm strike: MSPT and five baselines, one evaluation episode each' },
        { label: 'Kitchen · microwave', src: '/mspt/kitchen-microwave.gif', alt: 'Franka Kitchen microwave: MSPT and five baselines, one evaluation episode each' },
        { label: 'Swimmer', src: '/mspt/swimmer.gif', alt: 'Swimmer: MSPT and five baselines, one evaluation episode each' },
        { label: 'Walker', src: '/mspt/walker.gif', alt: 'Walker: MSPT and five baselines, one evaluation episode each' },
        { label: 'Kitchen · top burner', src: '/mspt/kitchen-top-burner.gif', alt: 'Franka Kitchen top burner: MSPT and five baselines, one evaluation episode each' },
      ],
      caption: 'MSPT (top left) against SAC, APT, RND, ICM and Disagreement on the same task.',
    },
  },
  {
    id: 'engine-consultation',
    title: 'Learned, Adaptive Engine Consultation for Human Move Prediction',
    tldr: 'An RL controller that decides which candidate moves are worth searching with Stockfish, and how deeply, under a compute budget.',
    venue: ['In preparation'],
    links: [{ label: 'project page', href: 'https://www.garrychess.ai' }],
    media: {
      kind: 'video',
      src: '/reinforcement_learning_human_chess_example.mp4',
      caption: 'Teaser: a rough preview of what this paper is aiming for.',
    },
  },
  {
    id: 'topoexplore',
    title: 'TopoExplore: Homology as an Exploration Signal',
    tldr: 'Uses the holes in the visited space as a signal for where to explore, building on Go-Explore.',
    authors: 'Jason Carlson',
    venue: ['Preprint', 'In preparation for ICML 2027'],
    links: [{ label: 'paper', href: 'https://arxiv.org/abs/2607.09971' }],
    media: {
      kind: 'figure',
      src: '/topoexplore/solve-profile.png',
      alt: 'Solve profile: fraction of TopoGym worlds solved against training steps, comparing Go-Explore with three TopoExplore variants. All three TopoExplore curves rise faster and settle higher than Go-Explore.',
      caption:
        'Fraction of TopoGym worlds solved over training. The coverage Go-Explore reaches at 1M steps is matched by TopoExplore at about 0.5M, and by the curvature variants at about 0.3M.',
    },
  },
  {
    id: 'topogym',
    title: 'TopoGym: Environments and Benchmarks for Topological Exploration in RL',
    tldr: 'Gridworld and continuous environments whose topology is known exactly, for testing sparse-reward exploration.',
    authors: 'Jason Carlson',
    venue: ['Open-source library'],
    links: [
      { label: 'code', href: 'https://github.com/jcarlson212/TopoGym' },
      { label: 'blog post', href: '/blog/a_tour_of_topogym' },
    ],
    media: {
      kind: 'gallery',
      images: [
        { src: '/topogym/missions/orbital-dock.gif', alt: 'OrbitDock: a thruster craft finding the docking chamber through a bottleneck' },
        { src: '/topogym/missions/lava-braid.gif', alt: 'LavaBraid3: a rover in a lava tube braided into three loops' },
        { src: '/topogym/missions/underice-cavity.gif', alt: 'IceKeelCavity: an underwater vehicle searching for a cavity behind an ice keel' },
        { src: '/topogym/missions/uav-rubble.gif', alt: 'RubbleVoids: a drone searching the voids of a rubble field' },
        { src: '/topogym/iceship.gif', alt: 'EnvironmentalIceShip: ship in an ice field where winter freezes the channel shut' },
        { src: '/topogym/space-warp.gif', alt: 'SpaceWarp: doorless treasure chamber reachable only through one wormhole among thirty' },
        { src: '/topogym/nested3.gif', alt: 'Nested3: three nested chambers with hidden doors' },
        { src: '/topogym/top-torus.gif', alt: 'TopTorus: torus world with identified edges drawn as fundamental-polygon arrows' },
      ],
      caption:
        'Top: continuous missions (OrbitDock, LavaBraid3, IceKeelCavity, RubbleVoids). Bottom: gridworlds (EnvironmentalIceShip, SpaceWarp, Nested3, TopTorus).',
    },
  },
  {
    id: 'matilda',
    title: 'Matilda: Engine-Agnostic Search with Human Policy Guidance',
    tldr: 'Decouples search from neural human-policy priors, then recombines them with a residual re-ranker for state-of-the-art elite move prediction.',
    authors: 'Jason Carlson',
    venue: ['Preprint', 'Under review at AAAI 2027 (Phase 2)'],
    links: [
      { label: 'paper', href: 'https://arxiv.org/abs/2606.25176' },
      { label: 'project page', href: 'https://www.garrychess.ai' },
    ],
  },
  {
    id: 'beyond-imitation',
    title: 'Beyond Imitation: Preference-Optimized Policies for Realistic Grandmaster Chess',
    tldr: 'Style-weighted preference optimization tunes a human move model toward a target grandmaster: strong play that is recognizably in style.',
    authors: 'Jason Carlson, L. Bernard, B. H. Carlson',
    venue: ['IEEE CoG 2026 (Oral)'],
    links: [
      { label: 'paper', href: 'https://drive.google.com/file/d/15fAJXPF2haC8Y6Gw3452G2hU8vtzsO-E/view?usp=sharing' },
      { label: 'project page', href: 'https://www.garrychess.ai' },
    ],
  },
  {
    id: 'automl',
    title: 'The Use of AutoML for Predicting Intracranial Aneurysm Rupture',
    tldr: 'Benchmarks automated ML against hand-engineered pipelines for aneurysm-rupture risk prediction.',
    authors: 'Jason Carlson, B. H. Carlson',
    venue: ['CNS 2025 (Poster)'],
    links: [
      { label: 'paper', href: 'https://docs.google.com/document/d/1HFvOFimXU8G6AL21yJkcq3okjf4Dxz0A0LRsxWaVJ_4/edit?usp=sharing' },
    ],
  },
  {
    id: 'inferentia',
    title: 'How Amazon Search Reduced ML Inference Costs by 85% with AWS Inferentia',
    authors: 'J. Moura, Jason Carlson, J. Singh, S. Xi, S. Koparkar, H. Sun, W. Zhang, Z. Zhang',
    venue: ['AWS Machine Learning Blog, 2022'],
    links: [
      { label: 'article', href: 'https://aws.amazon.com/blogs/machine-learning/how-amazon-search-reduced-ml-inference-costs-by-85-with-aws-inferentia/' },
    ],
  },
]

/* ---- Talks --------------------------------------------------------------- */
export interface Talk {
  title: string
  where: string
  date: string
  href?: string
}

export const talks: { heading: string; items: Talk[] }[] = [
  {
    heading: 'Conference Talks',
    items: [
      {
        title: 'Beyond Imitation: Preference-Optimized Policies for Realistic Grandmaster Chess',
        where: 'IEEE Conference on Games (Oral)',
        date: '2026',
      },
    ],
  },
  {
    heading: 'Videos',
    items: [
      {
        title: 'Trust Region Policy Optimization, explained',
        where: 'YouTube',
        date: '2026',
        href: 'https://youtu.be/OFgpPEjyJew',
      },
    ],
  },
]

/* ---- CV-style lists (Education, Work Experience, Honors) ----------------- */
export interface Entry {
  title: string
  date: string
  lines: string[]
}

export const education: Entry[] = [
  {
    title: 'Arizona State University',
    date: 'Jun 2021',
    lines: ['M.A. in Mathematics', 'GPA 4.0'],
  },
  {
    title: 'Arizona State University',
    date: 'Jun 2020',
    lines: ['B.S. in Mathematics, second major in Computer Science', 'GPA 3.9'],
  },
]

export const experience: Entry[] = [
  {
    title: 'New York University',
    date: 'Oct 2026 - Present',
    lines: ['Visiting Researcher'],
  },
  {
    title: 'Independent Researcher',
    date: 'May 2026 - Oct 2026',
    lines: ['Exploration in RL (TopoExplore, TopoGym) and human move prediction in chess (GarryChess)'],
  },
  {
    title: 'Amazon',
    date: 'May 2025 - Apr 2026',
    lines: ['Software Engineer II', 'Machine learning systems for credit extension and risk modeling'],
  },
  {
    title: 'AppLovin',
    date: 'Oct 2024 - Mar 2025',
    lines: ['Senior Software Engineer', 'Large-scale identity-graph infrastructure and distributed data systems'],
  },
  {
    title: 'Amazon',
    date: 'Jun 2021 - Sep 2024',
    lines: [
      'Software Engineer I, II',
      'Technical lead of a team of six; petabyte-scale catalog grouping and large-scale embedding infrastructure',
    ],
  },
]

export const honors: Entry[] = [
  {
    title: 'Outstanding Junior Award',
    date: '2019',
    lines: ['Department of Mathematics, Arizona State University'],
  },
  {
    title: "Dean's Scholarship",
    date: '',
    lines: ['Arizona State University'],
  },
]

/* ---- Coursework ---------------------------------------------------------- */
export const coursework = {
  heading: 'Arizona State University (Selected)',
  courses: [
    'Real Analysis I, II',
    'Functional Analysis I, II',
    'Geometry/Topology of Manifolds I, II',
    'Abstract Algebra I, II',
    'C*-Algebras',
    'Differential Equations I',
    'Graph Theory I',
    'Theory of Statistics I',
    'Computational Statistics',
  ],
}

export const meta = {
  /** Bump when content changes meaningfully. */
  updated: 'November 2026',
}
