import { useReducedMotion } from 'framer-motion'

export function Steam({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  if (!active || reduce) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[38%] flex justify-center gap-6" aria-hidden>
      <span className="steam steam-a" />
      <span className="steam steam-b" />
      <span className="steam steam-c" />
    </div>
  )
}

export function Dust() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="dust"
          style={{
            left: `${8 + i * 7}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${6 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  )
}
