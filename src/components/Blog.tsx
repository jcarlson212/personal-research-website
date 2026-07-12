import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postsByDate, formatDate } from '../data/blog'

export default function Blog() {
  useEffect(() => {
    document.title = 'Blog — Jason Carlson'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Jason Carlson — AI Research Engineer'
    }
  }, [])

  return (
    <section className="section section--flush blog" id="blog">
      <div className="container">
        <p className="eyebrow">Blog</p>
        <h1 className="section-title">Notes &amp; essays</h1>
        <p className="blog__intro">
          Longer-form writing on math and machine learning. The posts are mostly about ideas behind my
          research with relevant theory explained.
        </p>

        <ul className="blog__list">
          {postsByDate.map((post) => (
            <li key={post.slug} className="blog__item">
              <div className="blog__meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="blog__tags">
                  {post.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </span>
              </div>
              <h2 className="blog__title">
                <Link to={`/blog/${post.slug}`} className="blog__title-link">
                  {post.title}
                </Link>
              </h2>
              <p className="blog__summary">{post.summary}</p>
              <Link to={`/blog/${post.slug}`} className="link blog__read">
                Read post →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
