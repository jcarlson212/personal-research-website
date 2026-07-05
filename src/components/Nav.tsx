import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { profile } from '../data/content'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'publications', label: 'Publications' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand">
          {profile.name}
          <span className="nav__brand-dot" aria-hidden>
            ·
          </span>
          <span className="nav__brand-role">{profile.title}</span>
        </Link>

        <nav className="nav__links" aria-label="Sections">
          {SECTIONS.map((s) => (
            <Link key={s.id} to={`/#${s.id}`} className="nav__link">
              {s.label}
            </Link>
          ))}
          <Link to="/blog" className="nav__link nav__link--blog">
            Blog
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
