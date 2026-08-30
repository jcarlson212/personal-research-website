import { profile, meta } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="footer__meta">
          Built with React · Updated {meta.updated}
        </span>
      </div>
    </footer>
  )
}
