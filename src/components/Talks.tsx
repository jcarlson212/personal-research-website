import SectionHeader from './SectionHeader'
import { ArrowUpRight } from './icons'
import { talks } from '../data/content'

export default function Talks() {
  return (
    <section className="section" id="talks">
      <div className="container">
        <SectionHeader eyebrow="Talks" title="Talks & videos" />
        <div className="talks">
          {talks.map((t) => (
            <article key={t.youtubeId} className="talk">
              <div className="talk__video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${t.youtubeId}`}
                  title={t.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="project__head">
                <h3 className="project__name">{t.title}</h3>
                <span className="project__year">{t.year}</span>
              </div>
              <p className="project__summary">{t.summary}</p>
              <a
                className="project__link"
                href={`https://youtu.be/${t.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube <ArrowUpRight size={13} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
