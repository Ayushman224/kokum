import { motion } from 'framer-motion'
import type { TasteProfileId } from '../../data/types'

/**
 * A generative emblem per taste profile — the guest's "visual identity".
 * Each profile gets a different ray count, ring rhythm and inner geometry.
 */
const SHAPES: Record<TasteProfileId, { rays: number; rings: number[]; poly: number; rot: number }> = {
  explorer: { rays: 36, rings: [92, 70, 48], poly: 8, rot: 22.5 },
  balanced: { rays: 24, rings: [92, 76, 60, 44], poly: 6, rot: 0 },
  bold: { rays: 12, rings: [92, 56], poly: 3, rot: -90 },
  comfort: { rays: 48, rings: [92, 80, 68, 56, 44], poly: 0, rot: 0 },
}

export default function Sigil({ id, accent, className = '' }: { id: TasteProfileId; accent: string; className?: string }) {
  const s = SHAPES[id]
  const polyPts = (r: number, n: number, rot: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i / n) * 360 + rot) * (Math.PI / 180)
      return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`
    }).join(' ')

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`sg-${id}`}>
          <stop offset="0" stopColor={accent} stopOpacity=".55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#sg-${id})`} />
      <g className="spin-slow" style={{ transformOrigin: '100px 100px' }}>
        {Array.from({ length: s.rays }).map((_, i) => {
          const a = (i / s.rays) * Math.PI * 2
          return (
            <motion.line
              key={i}
              x1={100 + Math.cos(a) * 58}
              y1={100 + Math.sin(a) * 58}
              x2={100 + Math.cos(a) * (i % 3 === 0 ? 98 : 84)}
              y2={100 + Math.sin(a) * (i % 3 === 0 ? 98 : 84)}
              stroke={accent}
              strokeWidth=".7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.015 }}
            />
          )
        })}
      </g>
      {s.rings.map((r, i) => (
        <motion.circle
          key={r}
          cx="100"
          cy="100"
          r={r * 0.62}
          fill="none"
          stroke={accent}
          strokeWidth={i === 0 ? 1.2 : 0.6}
          strokeDasharray={i % 2 ? '2 4' : undefined}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: 'easeInOut' }}
        />
      ))}
      {s.poly > 0 && (
        <g className="spin-rev" style={{ transformOrigin: '100px 100px' }}>
          <motion.polygon
            points={polyPts(40, s.poly, s.rot)}
            fill="none"
            stroke={accent}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.6 }}
          />
          <motion.polygon
            points={polyPts(40, s.poly, s.rot + 180 / s.poly)}
            fill="none"
            stroke={accent}
            strokeOpacity=".5"
            strokeWidth=".6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.8 }}
          />
        </g>
      )}
      <circle cx="100" cy="100" r="3" fill={accent} />
    </svg>
  )
}
