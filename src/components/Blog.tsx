import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postsByDate, formatDate } from '../data/blog'

export default function Blog() {
  useEffect(() => {
    document.title = 'Blog — Jason Carlson'
    return () => {
      document.title = 'Jason Carlson'
    }
  }, [])

  return (
    <div className="page">
      <Link to="/" className="back">
        ← Home
      </Link>
      <h2>Blog posts</h2>
      {postsByDate.map((post) => (
        <article key={post.slug} className="pub">
          <Link to={`/blog/${post.slug}`} className="pub__title">
            {post.title}
          </Link>
          <div className="pub__venue">{formatDate(post.date)}</div>
          <p className="pub__tldr">{post.summary}</p>
        </article>
      ))}
    </div>
  )
}
