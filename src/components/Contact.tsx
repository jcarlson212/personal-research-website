import { GitHub, LinkedIn, Mail, ArrowUpRight } from './icons'
import { profile, meta } from '../data/content'

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <p className="eyebrow">Contact</p>
        <h2 className="contact__title">
          Open to research collaborations and conversations.
        </h2>
        <a className="contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>

        <ul className="contact__links" aria-label="Profiles">
          <li>
            <a href={`mailto:${profile.email}`} className="social">
              <Mail size={17} /> <span>Email</span>
            </a>
          </li>
          <li>
            <a href={profile.links.github} className="social" target="_blank" rel="noopener noreferrer">
              <GitHub size={16} /> <span>GitHub</span>
              <ArrowUpRight size={13} className="social__ext" />
            </a>
          </li>
          <li>
            <a href={profile.links.linkedin} className="social" target="_blank" rel="noopener noreferrer">
              <LinkedIn size={16} /> <span>LinkedIn</span>
              <ArrowUpRight size={13} className="social__ext" />
            </a>
          </li>
        </ul>
      </div>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="footer__meta">
            Built with React · Updated {meta.updated}
          </span>
        </div>
      </footer>
    </section>
  )
}
