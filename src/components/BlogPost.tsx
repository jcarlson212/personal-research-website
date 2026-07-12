import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { getPost, formatDate } from '../data/blog'

/**
 * Figure captions come from image alt text. remark-math consumes the `$...$`
 * delimiters inside image labels but leaves the alt as plain text, so the
 * caption must be re-extracted from the raw markdown (via node positions)
 * and its math typeset here.
 */
function Caption({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.length > 2 && part.startsWith('$') && part.endsWith('$') ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part.slice(1, -1), {
                throwOnError: false,
              }),
            }}
          />
        ) : (
          part
        ),
      )}
    </>
  )
}

/**
 * Figure with automatic theme variants: a src ending in `_light.<ext>` also
 * renders its `_dark.<ext>` twin, and CSS shows whichever matches the current
 * theme. Rendered with spans (not <figure>) because react-markdown places
 * images inside <p> elements.
 */
function PostImage({
  src,
  alt,
  rawAlt,
  slug,
}: {
  src?: string
  alt?: string
  /** Caption as written in the markdown source, `$...$` intact. */
  rawAlt?: string
  slug: string
}) {
  if (!src) return null
  const resolved = /^(https?:)?\//.test(src) ? src : `/blog_posts/${slug}/${src}`
  const isThemed = /_light\.[a-z]+$/i.test(resolved)
  return (
    <span className="post__figure">
      <img src={resolved} alt={alt ?? ''} loading="lazy" className={isThemed ? 'fig-light' : ''} />
      {isThemed && (
        <img
          src={resolved.replace(/_light\.([a-z]+)$/i, '_dark.$1')}
          alt={alt ?? ''}
          loading="lazy"
          className="fig-dark"
        />
      )}
      {(rawAlt ?? alt) && (
        <span className="post__figcaption">
          <Caption text={(rawAlt ?? alt)!} />
        </span>
      )}
    </span>
  )
}

export default function BlogPost() {
  const { slug = '' } = useParams()
  const post = getPost(slug)
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!post) return
    document.title = `${post.title} — Jason Carlson`
    let cancelled = false
    fetch(`/blog_posts/${post.slug}/post.md`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.text()
      })
      .then((text) => {
        if (!cancelled) setMarkdown(text)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
      document.title = 'Jason Carlson — AI Research Engineer'
    }
  }, [post])

  if (!post) {
    return (
      <section className="section section--flush post">
        <div className="container">
          <p className="eyebrow">Blog</p>
          <h1 className="section-title">Post not found</h1>
          <Link to="/blog" className="link">
            ← Back to all posts
          </Link>
        </div>
      </section>
    )
  }

  return (
    <article className="section section--flush post">
      <div className="container post__container">
        <Link to="/blog" className="link post__back">
          ← All posts
        </Link>
        <header className="post__header">
          <h1 className="post__title">{post.title}</h1>
          <div className="post__meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>Jason Carlson</span>
          </div>
        </header>

        {error && (
          <p className="post__status">Couldn’t load this post. Please try again later.</p>
        )}
        {!error && markdown === null && <p className="post__status">Loading…</p>}
        {markdown !== null && (
          <div className="post__body">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                img: (props) => {
                  // Recover the caption exactly as written (with $...$)
                  // from the image's source span in the markdown.
                  let rawAlt: string | undefined
                  const pos = props.node?.position
                  if (pos?.start.offset != null && pos.end.offset != null) {
                    const span = markdown.slice(pos.start.offset, pos.end.offset)
                    rawAlt = span.match(/^!\[([\s\S]*)\]\(/)?.[1]
                  }
                  return (
                    <PostImage
                      src={props.src}
                      alt={props.alt}
                      rawAlt={rawAlt}
                      slug={post.slug}
                    />
                  )
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </article>
  )
}
