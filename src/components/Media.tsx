import { useEffect, useRef, useState } from 'react'
import type { Media } from '../data/content'

/** Autoplays while in view, pauses when scrolled away. */
function InViewVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return <video ref={ref} src={src} controls loop muted playsInline preload="metadata" />
}

/** Wide comparison GIFs, one visible at a time so only the chosen clip loads. */
function Tabs({ demos }: { demos: { label: string; src: string; alt: string }[] }) {
  const [active, setActive] = useState(0)
  const demo = demos[active]
  return (
    <>
      <div className="media__tabs" role="tablist" aria-label="Task">
        {demos.map((d, i) => (
          <button
            key={d.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? 'is-active' : ''}
            onClick={() => setActive(i)}
          >
            {d.label}
          </button>
        ))}
      </div>
      <img key={demo.src} src={demo.src} alt={demo.alt} loading="lazy" />
    </>
  )
}

const SUMMARY: Record<Media['kind'], string> = {
  tabs: 'demos',
  gallery: 'environments',
  figure: 'results',
  video: 'teaser',
}

function MediaBody({ media }: { media: Media }) {
  return (
    <figure className={`media media--${media.kind}`}>
      {media.kind === 'figure' && <img src={media.src} alt={media.alt} loading="lazy" />}
      {media.kind === 'gallery' && (
        <div className="media__grid">
          {media.images.map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
          ))}
        </div>
      )}
      {media.kind === 'tabs' && <Tabs demos={media.demos} />}
      {media.kind === 'video' && <InViewVideo src={media.src} />}
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  )
}

/** Collapsed by default; the media only mounts (and downloads) once opened. */
export default function MediaBlock({ media }: { media: Media }) {
  const [open, setOpen] = useState(false)
  return (
    <details className="media-toggle" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{open ? 'hide' : 'show'} {SUMMARY[media.kind]}</summary>
      {open && <MediaBody media={media} />}
    </details>
  )
}
