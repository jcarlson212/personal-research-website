import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import MediaBlock from './Media'
import {
  profile,
  news,
  themes,
  publications,
  talks,
  education,
  experience,
  honors,
  coursework,
  meta,
  type Entry,
} from '../data/content'
import { postsByDate } from '../data/blog'

const SECTIONS = ['news', 'research', 'publications', 'blog', 'talks', 'cv']

/** Renders `**bold**` spans in a plain string. */
function rich(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
    )
}

/** Bolds the site owner's name inside an author list. */
function authors(list: string): ReactNode[] {
  return list
    .split(new RegExp(`(${profile.name})`))
    .map((part, i) => (part === profile.name ? <strong key={i}>{part}</strong> : part))
}

/** In-page anchors and app routes stay in the tab; everything else opens a new one. */
function A({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith('#')) return <a href={href}>{children}</a>
  if (href.startsWith('/') && !/\.[a-z]+$/i.test(href)) return <Link to={href}>{children}</Link>
  const external = !href.startsWith('mailto:')
  return (
    <a href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
      {children}
    </a>
  )
}

/** Links joined by a separator, e.g. "paper / code". */
function Joined({ links, sep = ' / ' }: { links: { label: string; href: string }[]; sep?: string }) {
  return (
    <>
      {links.map((l, i) => (
        <Fragment key={l.label}>
          {i > 0 && sep}
          <A href={l.href}>{l.label}</A>
        </Fragment>
      ))}
    </>
  )
}

/** CV-style rows: what on the left, when on the right. */
function Rows({ entries }: { entries: Entry[] }) {
  return (
    <div className="rows">
      {entries.map((e) => (
        <div key={e.title + e.date} className="row">
          <div>
            <div className="row__title">{e.title}</div>
            {e.lines.map((line) => (
              <div key={line} className="row__line">
                {line}
              </div>
            ))}
          </div>
          <div className="row__date">{e.date}</div>
        </div>
      ))}
    </div>
  )
}

function shortDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Home() {
  return (
    <>
      <nav className="topnav" aria-label="Sections">
        <div className="topnav__inner">
          <a href="#top" className="topnav__name">
            {profile.name}
          </a>
          <div className="topnav__links">
            {SECTIONS.map((s) => (
              <a key={s} href={`#${s}`}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="page" id="top">
        <header className="intro">
          <div className="intro__text">
            <h1>{profile.name}</h1>
            <p className="intro__role">{profile.role}</p>
            <p>{rich(profile.bio)}</p>
            <p className="intro__links">
              <Joined links={profile.links} sep=" · " />
            </p>
          </div>
          <img className="intro__photo" src={profile.photo} alt={profile.name} />
        </header>

        <section id="news">
          <h2>News</h2>
          <dl className="news">
            {news.map((n) => (
              <Fragment key={n.text}>
                <dt>{n.date}</dt>
                <dd>{n.href ? <A href={n.href}>{n.text}</A> : n.text}</dd>
              </Fragment>
            ))}
          </dl>
        </section>

        <section id="research">
          <h2>Research</h2>
          <ul className="themes">
            {themes.map((t) => (
              <li key={t.name}>
                <strong>{t.name}.</strong> {t.text}
                <br />
                <em>Key work:</em> <Joined links={t.papers} sep=", " />
              </li>
            ))}
          </ul>
        </section>

        <section id="publications">
          <h2>Publications</h2>
          {publications.map((p) => (
            <article key={p.id} id={p.id} className="pub">
              <div className="pub__title">{p.title}</div>
              {p.authors && <div>{authors(p.authors)}</div>}
              <div className="pub__venue">{p.venue.join(' · ')}</div>
              {p.links.length > 0 && (
                <div>
                  <Joined links={p.links} />
                </div>
              )}
              {p.tldr && <p className="pub__tldr">{p.tldr}</p>}
              {p.media && <MediaBlock media={p.media} />}
            </article>
          ))}
        </section>

        <section id="blog">
          <h2>Blog</h2>
          <ul className="dated">
            {postsByDate.map((p) => (
              <li key={p.slug}>
                <span className="dated__date">{shortDate(p.date)}</span>
                <Link to={`/blog/${p.slug}`} className="dated__title">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="talks">
          <h2>Talks</h2>
          <ul className="dated">
            {talks.flatMap((g) =>
              g.items.map((t) => (
                <li key={t.title}>
                  <span className="dated__date">{t.date}</span>
                  <span>
                    {t.href ? (
                      <A href={t.href}>{t.title}</A>
                    ) : (
                      <span className="dated__plain">{t.title}</span>
                    )}
                    <span className="dated__where"> {t.where}</span>
                  </span>
                </li>
              )),
            )}
          </ul>
        </section>

        <section id="cv">
          <h2>Experience</h2>
          <Rows entries={experience} />

          <h2>Education</h2>
          <Rows entries={education} />

          <h2>Honors and Awards</h2>
          <Rows entries={honors} />

          <h2>Graduate Coursework</h2>
          <p className="row__title">{coursework.heading}</p>
          <ul className="courses">
            {coursework.courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <footer className="footer">
          <A href="/cv.pdf">Full CV</A> · <Link to="/acknowledgements">Acknowledgements</Link> ·
          Last updated {meta.updated}
        </footer>
      </div>
    </>
  )
}
