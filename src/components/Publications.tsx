import SectionHeader from './SectionHeader'
import { ArrowUpRight } from './icons'
import { publications, STATUS_LABEL } from '../data/content'

export default function Publications() {
  return (
    <section className="section" id="publications">
      <div className="container">
        <SectionHeader eyebrow="Publications" title="Papers & posters" />
        <ol className="pubs">
          {publications.map((p) => {
            const Tag = p.href ? 'a' : 'div'
            return (
              <li key={p.title} className="pub">
                <span className="pub__year">{p.year}</span>
                <Tag
                  className={`pub__body ${p.href ? 'pub__body--link' : ''}`}
                  {...(p.href
                    ? { href: p.href, target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <h3 className="pub__title">
                    {p.title}
                    {p.href && <ArrowUpRight size={15} className="pub__ext" />}
                  </h3>
                  <p className="pub__meta">
                    <span className="pub__authors">{p.authors}</span>
                    <span className="pub__sep">·</span>
                    <span className="pub__venue">{p.venue}</span>
                  </p>
                  {p.status !== 'published' && (
                    <span className="pub__status">{STATUS_LABEL[p.status]}</span>
                  )}
                </Tag>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
