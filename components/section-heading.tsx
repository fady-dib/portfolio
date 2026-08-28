export function SectionHeading({ eyebrow, label }: { eyebrow: string; label: string }) {
  return (
    <div className="mb-14">
      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2 className="text-4xl font-black tracking-tight md:text-h2">{label}</h2>
    </div>
  )
}
