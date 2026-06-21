import SectionHeader from './SectionHeader'
import { ArrowUpRight } from './icons'
import { projects } from '../data/content'

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeader eyebrow="Projects" title="Earlier projects" />
        <div className="projects">
          {projects.map((p) => {
            const Tag = p.href ? 'a' : 'div'
            return (
              <Tag
                key={p.name}
                className={`project ${p.href ? 'project--link' : ''}`}
                {...(p.href
                  ? { href: p.href, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <div className="project__head">
                  <h3 className="project__name">{p.name}</h3>
                  <span className="project__year">{p.year}</span>
                </div>
                <p className="project__summary">{p.summary}</p>
                {p.href && (
                  <span className="project__link">
                    View <ArrowUpRight size={13} />
                  </span>
                )}
              </Tag>
            )
          })}
        </div>
      </div>
    </section>
  )
}
