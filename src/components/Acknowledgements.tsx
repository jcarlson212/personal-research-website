import { useEffect } from 'react'
import { ArrowUpRight } from './icons'
import { acknowledgements, acknowledgementsIntro } from '../data/acknowledgements'

export default function Acknowledgements() {
  useEffect(() => {
    document.title = 'Acknowledgements — Jason Carlson'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Jason Carlson — AI Research Engineer'
    }
  }, [])

  return (
    <section className="section section--flush acks" id="acknowledgements">
      <div className="container">
        <p className="eyebrow">Acknowledgements</p>
        <h1 className="section-title">Thank you</h1>
        <p className="acks__intro">{acknowledgementsIntro}</p>

        <ul className="acks__list">
          {acknowledgements.map((p) => (
            <li key={p.name} className="acks__item">
              {p.photo && (
                <img src={p.photo} alt={p.photoAlt ?? p.name} className="acks__photo" loading="lazy" />
              )}
              <div className="acks__body">
                <span className="acks__name">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="acks__link">
                      {p.name}
                      <ArrowUpRight size={12} className="social__ext" />
                    </a>
                  ) : (
                    p.name
                  )}
                </span>
                {p.note && <span className="acks__note">{p.note}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
