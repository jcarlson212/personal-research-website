import { profile } from '../data/content'
import { GitHub, LinkedIn, Mail, Document, ArrowUpRight } from './icons'

export default function Hero() {
  return (
    <section className="hero section--flush" id="top">
      <div className="container">
        <p className="hero__eyebrow">{profile.location}</p>
        <h1 className="hero__name">{profile.name}</h1>
        <p className="hero__title">{profile.title}</p>
        <p className="hero__tagline">{profile.tagline}</p>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#research">
            View research
          </a>
          <a className="btn" href={profile.links.cv} target="_blank" rel="noopener noreferrer">
            <Document size={15} /> Curriculum vitae
          </a>
        </div>

        <ul className="hero__socials" aria-label="Profiles">
          <li>
            <a href={`mailto:${profile.email}`} className="social" aria-label="Email">
              <Mail size={17} /> <span>Email</span>
            </a>
          </li>
          <li>
            <a
              href={profile.links.github}
              className="social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub size={16} /> <span>GitHub</span>
              <ArrowUpRight size={13} className="social__ext" />
            </a>
          </li>
          <li>
            <a
              href={profile.links.linkedin}
              className="social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn size={16} /> <span>LinkedIn</span>
              <ArrowUpRight size={13} className="social__ext" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
