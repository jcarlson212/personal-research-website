import SectionHeader from './SectionHeader'
import { ArrowUpRight } from './icons'
import {
  garrychess,
  otherResearch,
  STATUS_LABEL,
  type Status,
} from '../data/content'

function StatusPill({ status }: { status: Status }) {
  return <span className={`pill pill--${status}`}>{STATUS_LABEL[status]}</span>
}

export default function Research() {
  return (
    <section className="section" id="research">
      <div className="container">
        <SectionHeader eyebrow="Research" title="What I'm working on" />

        {/* Flagship: GarryChess */}
        <article className="flagship">
          <div className="flagship__head">
            <div>
              <div className="flagship__kicker">Flagship program</div>
              <h3 className="flagship__title">
                <a
                  href={garrychess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  {garrychess.name}
                  <ArrowUpRight size={18} />
                </a>
              </h3>
            </div>
            <a
              href={garrychess.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flagship__url"
            >
              garrychess.ai
            </a>
          </div>
          <p className="flagship__blurb">{garrychess.blurb}</p>

          {/* Three sub-papers as a progress timeline */}
          <ol className="stages">
            {garrychess.stages.map((s) => (
              <li key={s.index} className={`stage stage--${s.status}`}>
                <div className="stage__rail" aria-hidden>
                  <span className="stage__node" />
                </div>
                <div className="stage__content">
                  <div className="stage__meta">
                    <span className="stage__num">Paper {s.index}</span>
                    <StatusPill status={s.status} />
                  </div>
                  <h4 className="stage__title">
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline"
                      >
                        {s.title}
                        <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      s.title
                    )}
                  </h4>
                  <p className="stage__venue">{s.venue}</p>
                  <p className="stage__summary">{s.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        {/* Other research */}
        <div className="other-research">
          <h3 className="other-research__label">Other research</h3>
          <div className="research-grid">
            {otherResearch.map((r) => (
              <article key={r.title} className="rcard">
                <div className="rcard__top">
                  <StatusPill status={r.status} />
                </div>
                <h4 className="rcard__title">
                  {r.href ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      {r.title}
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    r.title
                  )}
                </h4>
                <p className="rcard__venue">{r.venue}</p>
                <p className="rcard__summary">{r.summary}</p>
                <ul className="rcard__tags">
                  {r.tags.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
