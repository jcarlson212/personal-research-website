type Props = { eyebrow: string; title: string }

export default function SectionHeader({ eyebrow, title }: Props) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
    </>
  )
}
