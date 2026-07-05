/* ============================================================================
   Blog post registry — newest first on the index page (sorted by date).
   Each post's markdown + figures live in public/blog_posts/<slug>/.
   ========================================================================== */

export interface BlogPost {
  slug: string
  title: string
  /** ISO date, used for chronological ordering and display. */
  date: string
  summary: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'basic_topology_and_symmetric_simplexes',
    title: 'Basic Topology and Symmetric Simplexes',
    date: '2026-07-05',
    summary:
      'From open sets to persistent homology, with animations: homeomorphism, homotopy equivalence, fundamental groups, homology, the nerve lemma, Čech and Vietoris–Rips complexes, the sandwich theorem — and why robust topological features matter for exploration in RL.',
    tags: ['Topology', 'Math'],
  },
]

/** Posts sorted newest-first for the index page. */
export const postsByDate = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
