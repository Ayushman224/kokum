import { forwardRef, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import DishArt from './DishArt'
import type { CardLayout } from '../state/store'
import type { Dish } from '../data/types'
import { restaurant } from '../data/restaurant'

interface Props {
  layout: CardLayout
  photo: string | null
  dish: Dish
  className?: string
}

const TRAITS = ['🌿 Aromatic', '🥥 Rich', '🌶️ Bold']

/**
 * The shareable 9:16 story artwork. Sized with container-query units so the same
 * component renders identically as a thumbnail or full-screen.
 * The downloadable PNG is drawn by lib/storyImage.ts to match.
 */
const StoryCard = forwardRef<HTMLDivElement, Props>(function StoryCard({ layout, photo, dish, className = '' }, ref) {
  const L = LAYOUTS[layout]
  const visual = photo ? (
    <img src={photo} alt="Your photo" className="h-full w-full object-cover" style={{ filter: 'saturate(1.05) contrast(1.04) sepia(.08)' }} draggable={false} />
  ) : (
    <div className="grid h-full w-full place-items-center" style={{ background: L.photoBg }}>
      <DishArt className="w-[92%]" image={dish.image} />
    </div>
  )

  return (
    <div ref={ref} className={`relative aspect-[9/16] overflow-hidden ${className}`} style={{ containerType: 'inline-size', background: L.bg, color: L.ink, borderRadius: '4.5cqw' }}>
      {/* grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[.12] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      {/* frame */}
      <div className="pointer-events-none absolute" style={{ inset: '3.2cqw', border: `1px solid ${L.line}`, borderRadius: '2.6cqw' }} />
      <div className="pointer-events-none absolute" style={{ inset: '4.6cqw', border: `1px solid ${L.lineSoft}`, borderRadius: '1.8cqw' }} />
      {/* decorative leaves */}
      <Leaf className="absolute" style={{ left: '-3cqw', top: '52cqw', width: '22cqw', opacity: L.decoOpacity, transform: 'rotate(-30deg)' }} color={L.accent} />
      <Leaf className="absolute" style={{ right: '-4cqw', top: '120cqw', width: '26cqw', opacity: L.decoOpacity, transform: 'rotate(150deg)' }} color={L.accent} />

      <div className="relative flex h-full flex-col items-center text-center" style={{ padding: '10cqw 8cqw 9cqw' }}>
        <div className="font-serif" style={{ fontSize: '6.4cqw', letterSpacing: '1.1em', marginRight: '-1.1em' }}>
          KOKUM
        </div>
        <div className="font-semibold uppercase" style={{ fontSize: '2.4cqw', letterSpacing: '.4em', color: L.accent, marginTop: '2.4cqw' }}>
          {restaurant.line}
        </div>

        {/* photo */}
        <motion.div
          key={photo ?? 'dish'}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden"
          style={{ ...L.photoShape, marginTop: '7cqw', boxShadow: `0 0 0 1px ${L.line}, 0 0 0 2.2cqw ${L.ring}, 0 6cqw 14cqw -4cqw rgba(0,0,0,.6)` }}
        >
          {visual}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 20%, transparent 55%, rgba(0,0,0,.35))' }} />
        </motion.div>

        <div className="font-semibold uppercase" style={{ fontSize: '2.6cqw', letterSpacing: '.45em', marginTop: '8cqw', color: L.muted }}>
          My Kokum story
        </div>
        <div className="font-serif leading-none" style={{ fontSize: '11cqw', marginTop: '2.4cqw' }}>
          {dish.shortName.split(' & ')[0]} <span className="italic" style={{ color: L.accent }}>&amp;</span> {dish.shortName.split(' & ')[1]}
        </div>
        <div className="font-serif italic" style={{ fontSize: '6cqw', color: L.accent, marginTop: '3cqw' }}>
          The Explorer
        </div>
        <div className="flex flex-wrap justify-center" style={{ gap: '2cqw', marginTop: '4cqw' }}>
          {TRAITS.map((t) => (
            <span key={t} className="font-semibold uppercase" style={{ fontSize: '2.5cqw', letterSpacing: '.14em', padding: '1.4cqw 2.8cqw', borderRadius: '99px', border: `1px solid ${L.lineSoft}` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto font-semibold uppercase" style={{ fontSize: '2.8cqw', letterSpacing: '.35em', color: L.accent }}>
          {restaurant.hashtag}
        </div>
      </div>
    </div>
  )
})
export default StoryCard

export const LAYOUTS: Record<
  CardLayout,
  { label: string; bg: string; ink: string; accent: string; muted: string; line: string; lineSoft: string; ring: string; photoBg: string; decoOpacity: number; photoShape: CSSProperties }
> = {
  editorial: {
    label: 'Editorial',
    bg: 'linear-gradient(180deg, #f6efe3, #eadcc4)',
    ink: '#1a1411',
    accent: '#8a2748',
    muted: 'rgba(26,20,17,.55)',
    line: 'rgba(26,20,17,.35)',
    lineSoft: 'rgba(26,20,17,.18)',
    ring: 'rgba(255,255,255,.6)',
    photoBg: 'radial-gradient(circle at 50% 40%, #3a2d25, #15100d)',
    decoOpacity: 0.25,
    photoShape: { width: '70cqw', height: '84cqw', borderRadius: '35cqw 35cqw 3cqw 3cqw' },
  },
  dark: {
    label: 'Dark',
    bg: 'radial-gradient(90% 55% at 50% 40%, #2a201b, #0b0908 75%)',
    ink: '#f4ecdf',
    accent: '#e2b877',
    muted: 'rgba(244,236,223,.55)',
    line: 'rgba(244,236,223,.25)',
    lineSoft: 'rgba(244,236,223,.14)',
    ring: 'rgba(0,0,0,.35)',
    photoBg: 'radial-gradient(circle at 50% 40%, #2f2622, #0e0b09)',
    decoOpacity: 0.18,
    photoShape: { width: '76cqw', height: '84cqw', borderRadius: '3cqw' },
  },
  gold: {
    label: 'Kokum Gold',
    bg: 'radial-gradient(90% 55% at 50% 38%, rgba(216,150,80,.35), transparent 70%), linear-gradient(180deg, #1c1411, #0b0908)',
    ink: '#f4ecdf',
    accent: '#e0b66e',
    muted: 'rgba(244,236,223,.6)',
    line: 'rgba(216,176,106,.7)',
    lineSoft: 'rgba(216,176,106,.3)',
    ring: 'rgba(216,176,106,.14)',
    photoBg: 'radial-gradient(circle at 50% 40%, #2f2622, #0e0b09)',
    decoOpacity: 0.3,
    photoShape: { width: '72cqw', height: '72cqw', borderRadius: '50%' },
  },
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function Leaf({ className, style, color }: { className?: string; style?: CSSProperties; color: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} style={style} aria-hidden="true">
      <path d="M0 20 C 25 -2, 70 -2, 100 20 C 70 42, 25 42, 0 20 Z" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M2 20 L 96 20" stroke={color} strokeWidth=".8" />
      {[20, 38, 56, 74].map((x) => (
        <path key={x} d={`M${x} 20 L ${x + 10} 10 M ${x} 20 L ${x + 10} 30`} stroke={color} strokeWidth=".6" />
      ))}
    </svg>
  )
}
