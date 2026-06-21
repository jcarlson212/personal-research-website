import SectionHeader from './SectionHeader'
import { experience, education } from '../data/content'

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader eyebrow="Experience" title="Selected experience" />

        <div className="exp">
          {experience.map((job) => (
            <article key={job.org + job.period} className="job">
              <div className="job__side">
                <span className="job__period">{job.period}</span>
              </div>
              <div className="job__main">
                <h3 className="job__org">{job.org}</h3>
                <p className="job__role">{job.role}</p>
                <ul className="job__points">
                  {job.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
                {job.stack && <p className="job__stack">{job.stack}</p>}
              </div>
            </article>
          ))}
        </div>

        <div className="edu">
          <h3 className="edu__label">Education</h3>
          <ul className="edu__list">
            {education.map((e) => (
              <li key={e.degree} className="edu__item">
                <div className="edu__head">
                  <span className="edu__degree">{e.degree}</span>
                  <span className="edu__year">{e.year}</span>
                </div>
                <span className="edu__school">{e.school}</span>
                <span className="edu__detail">{e.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
