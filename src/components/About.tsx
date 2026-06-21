import SectionHeader from './SectionHeader'
import { about } from '../data/content'

/** Render *single asterisk* spans as emphasis without a markdown dep. */
function withEmphasis(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((chunk, i) =>
    chunk.startsWith('*') && chunk.endsWith('*') ? (
      <em key={i}>{chunk.slice(1, -1)}</em>
    ) : (
      <span key={i}>{chunk}</span>
    ),
  )
}

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div className="about__header">
          <SectionHeader eyebrow="About" title="Background" />
        </div>
        <div className="about__body">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="about__p">
              {withEmphasis(p)}
            </p>
          ))}
          <div className="about__interests">
            <span className="about__interests-label">Interests</span>
            <ul className="about__tags">
              {about.interests.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
