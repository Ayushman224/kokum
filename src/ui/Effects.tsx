import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { haptic } from '../lib/sound'

/** Slow-rising embers. CSS-only animation — cheap on mid-range phones. */
export function Particles({ count = 18, color = '#d8b06a', className = '' }: { count?: number; color?: string; className?: string }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 53) % 100}%`,
        size: 1 + ((i * 7) % 3),
        d: `${10 + ((i * 13) % 12)}s`,
        delay: `${-((i * 1.7) % 12)}s`,
        dx: `${((i % 5) - 2) * 14}px`,
        o: 0.25 + ((i * 3) % 6) / 10,
      })),
    [count],
  )
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((p, i) => (
        <span
          key={i}
          className="particle absolute bottom-[-10px] rounded-full"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              background: color,
              boxShadow: `0 0 ${p.size * 4}px ${color}`,
              '--d': p.d,
              '--delay': p.delay,
              '--dx': p.dx,
              '--o': p.o,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Three soft steam wisps. */
export function Steam({ className = '', intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <svg viewBox="0 0 120 120" className={`pointer-events-none ${className}`} aria-hidden="true" style={{ opacity: Math.min(1, intensity) }}>
      <defs>
        <filter id="steam-blur" x="-100%" y="-20%" width="300%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          className="steam-wisp"
          style={{ animationDelay: `${i * 1.3}s` }}
          d={`M${40 + i * 18} 110 C ${30 + i * 18} 90, ${55 + i * 18} 75, ${42 + i * 18} 55 S ${50 + i * 18} 25, ${44 + i * 18} 10`}
          stroke="#fff6ea"
          strokeOpacity=".5"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#steam-blur)"
        />
      ))}
    </svg>
  )
}

/** Magnetic, tactile button. The label drifts toward the finger/cursor. */
export function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ...rest
}: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'quiet' } & Omit<HTMLMotionProps<'button'>, 'children' | 'onClick'>) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })

  const styles = {
    primary:
      'bg-gradient-to-b from-[#f1d9a4] via-[#d8b06a] to-[#a8763f] text-ink shadow-[0_10px_40px_-10px_rgba(216,176,106,.7),inset_0_1px_0_rgba(255,255,255,.5)]',
    ghost: 'border border-gold/40 bg-white/[0.03] text-ivory backdrop-blur-md',
    quiet: 'text-ivory/60 hover:text-ivory',
  }[variant]

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      onClick={() => {
        haptic()
        onClick?.()
      }}
      className={`relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-7 text-[12px] font-bold tracking-[0.2em] uppercase ${styles} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/** Concentric ripple — "sound-like" visual feedback. */
export function Ripple({ trigger, color = '#d8b06a' }: { trigger: number; color?: string }) {
  if (!trigger) return null
  return (
    <div key={trigger} className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute aspect-square w-1/2 rounded-full border"
          style={{ borderColor: color }}
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 1.3, delay: i * 0.16, ease: [0.2, 0.6, 0.3, 1] }}
        />
      ))}
    </div>
  )
}

/** Serif headline whose lines rise in one after another. */
export function RevealText({ lines, className = '', delay = 0, as: Tag = 'h2' }: { lines: string[]; className?: string; delay?: number; as?: 'h1' | 'h2' | 'p' }) {
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
