import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { acknowledgements, acknowledgementsIntro } from '../data/acknowledgements'

export default function Acknowledgements() {
  useEffect(() => {
    document.title = 'Acknowledgements — Jason Carlson'
    return () => {
      document.title = 'Jason Carlson'
    }
  }, [])

  return (
    <div className="page acks" id="acknowledgements">
      <Link to="/" className="back">
        ← Home
      </Link>
      <h2>Acknowledgements</h2>
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
  )
}
