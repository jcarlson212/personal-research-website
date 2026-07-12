import { useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'
import { ArrowUpRight } from './icons'
import {
  programs,
  otherResearch,
  STATUS_LABEL,
  type Program,
  type Status,
} from '../data/content'

function StatusPill({ status }: { status: Status }) {
  return <span className={`pill pill--${status}`}>{STATUS_LABEL[status]}</span>
}

/** Autoplays while in view, pauses when scrolled away. */
function DemoVideo({ src, caption }: { src: string; caption: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <figure className="flagship__demo">
      <video
        ref={videoRef}
        className="flagship__video"
        src={src}
        controls
        loop
        muted
        playsInline
        preload="metadata"
      />
      <figcaption className="flagship__caption">{caption}</figcaption>
    </figure>
  )
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="flagship">
      <div className="flagship__head">
        <div>
          <div className="flagship__kicker">{program.kicker}</div>
          <h3 className="flagship__title">
            {program.url ? (
              <a
                href={program.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                {program.name}
                <ArrowUpRight size={18} />
              </a>
            ) : (
              program.name
            )}
          </h3>
        </div>
        {program.url && program.urlLabel && (
          <a
            href={program.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flagship__url"
          >
            {program.urlLabel}
          </a>
        )}
      </div>
      <p className="flagship__blurb">{program.blurb}</p>

      {/* Stages as a progress timeline */}
      <ol className="stages">
        {program.stages.map((s) => (
          <li key={s.index} className={`stage stage--${s.status}`}>
            <div className="stage__rail" aria-hidden>
              <span className="stage__node" />
            </div>
            <div className="stage__content">
              <div className="stage__meta">
                <span className="stage__num">{s.label}</span>
                <StatusPill status={s.status} />
              </div>
              <h4 className="stage__title">
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    {s.title}
                    <ArrowUpRight size={15} />
                  </a>
                ) : (
                  s.title
                )}
              </h4>
              <p className="stage__venue">{s.venue}</p>
              <p className="stage__summary">{s.summary}</p>
              {s.images && (
                <figure className="stage__gallery">
                  <div className="stage__gallery-grid">
                    {s.images.map((img) => (
                      <img
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                      />
                    ))}
                  </div>
                  {s.imagesCaption && (
                    <figcaption className="stage__gallery-caption">
                      {s.imagesCaption}
                    </figcaption>
                  )}
                </figure>
              )}
            </div>
          </li>
        ))}
      </ol>

      {program.video && (
        <DemoVideo src={program.video.src} caption={program.video.caption} />
      )}
    </article>
  )
}

export default function Research() {
  return (
    <section className="section" id="research">
      <div className="container">
        <SectionHeader eyebrow="Research" title="What I'm working on" />

        <div className="programs">
          {programs.map((p) => (
            <ProgramCard key={p.name} program={p} />
          ))}
        </div>

        {/* Other research */}
        <div className="other-research">
          <h3 className="other-research__label">Other research</h3>
          <div className="research-grid">
            {otherResearch.map((r) => (
              <article key={r.title} className="rcard">
                <div className="rcard__top">
                  <StatusPill status={r.status} />
                </div>
                <h4 className="rcard__title">
                  {r.href ? (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      {r.title}
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    r.title
                  )}
                </h4>
                <p className="rcard__venue">{r.venue}</p>
                <p className="rcard__summary">{r.summary}</p>
                <ul className="rcard__tags">
                  {r.tags.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
