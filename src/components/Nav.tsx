import { useEffect, useState } from 'react'
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
        <a href="#top" className="nav__brand">
          {profile.name}
          <span className="nav__brand-dot" aria-hidden>
            ·
          </span>
          <span className="nav__brand-role">{profile.title}</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="nav__link">
              {s.label}
            </a>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
