import { useId, useState } from 'react'

interface Props {
  className?: string
  /** Real photo URL — when set it replaces the illustration. */
  image?: string | null
  /** 0–1: how "finished" the stew looks (used by the chef game). */
  glow?: number
  title?: string
}

/**
 * The hero plate. If `image` is set, the real photograph is used.
 * Otherwise a hand-built SVG illustration of appam + vegetable stew is drawn —
 * no network requests, sharp at any size, ~0 KB of images for fast QR loading.
 */
export default function DishArt({ className = '', glow = 0, title, image }: Props) {
  const raw = useId().replace(/:/g, '')
  const id = (s: string) => `${raw}-${s}`
  const alt = title ?? 'Appam and vegetable stew, illustrated'

  const [failed, setFailed] = useState(false)

  // Real photo, graded to sit in the Kokum palette: warm, deep shadows, soft vignette, gold rim.
  // Falls back to the illustration if the photo can't load (e.g. offline).
  if (image && !failed) {
    return (
      <div
        className={`relative aspect-square overflow-hidden rounded-full ${className}`}
        role="img"
        aria-label={title ?? 'Appam and vegetable stew'}
        style={{ boxShadow: `0 0 0 1px rgba(216,176,106,.45), 0 30px 60px -20px rgba(0,0,0,.9), 0 0 ${40 + glow * 60}px -10px rgba(240,170,90,${0.25 + glow * 0.4})` }}
      >
        <img
          src={image}
          alt=""
          crossOrigin="anonymous"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full scale-[1.12] object-cover"
          style={{ filter: 'brightness(.9) contrast(1.14) saturate(1.12) sepia(.1)' }}
        />
        <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,210,150,.55), rgba(120,60,20,.35) 70%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 48%, transparent 48%, rgba(11,9,8,.55) 78%, rgba(11,9,8,.9) 100%)' }} />
        <div className="absolute inset-[3%] rounded-full border border-gold/25" />
      </div>
    )
  }

  const leaf = (x: number, y: number, r: number, s = 1, key?: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C 8 -9, 26 -9, 36 0 C 26 9, 8 9, 0 0 Z" fill={`url(#${id('leaf')})`} />
      <path d="M1 0 L 34 0" stroke="#9fbf6e" strokeOpacity=".45" strokeWidth=".8" />
    </g>
  )

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={alt}>
      <defs>
        <radialGradient id={id('plate')} cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#2e2824" />
          <stop offset=".7" stopColor="#1a1614" />
          <stop offset="1" stopColor="#0e0c0b" />
        </radialGradient>
        <radialGradient id={id('appam')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fbf4e6" />
          <stop offset=".5" stopColor="#f3e6cb" />
          <stop offset=".72" stopColor="#e7c88f" />
          <stop offset=".9" stopColor="#c98f4b" />
          <stop offset="1" stopColor="#8e5627" />
        </radialGradient>
        <radialGradient id={id('stew')} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#fbf1dc" />
          <stop offset=".6" stopColor="#efdcb3" />
          <stop offset="1" stopColor="#d9bd86" />
        </radialGradient>
        <radialGradient id={id('bowl')} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#3a332e" />
          <stop offset="1" stopColor="#0d0b0a" />
        </radialGradient>
        <linearGradient id={id('leaf')} x1="0" x2="1">
          <stop offset="0" stopColor="#2c4a24" />
          <stop offset="1" stopColor="#4d7535" />
        </linearGradient>
        <radialGradient id={id('warm')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f0b35a" stopOpacity=".55" />
          <stop offset="1" stopColor="#f0b35a" stopOpacity="0" />
        </radialGradient>
        {/* Lace: fractal noise mapped to brown speckle, kept inside the ring */}
        <filter id={id('lace')} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 .48  0 0 0 0 .27  0 0 0 0 .1  0 0 0 -3.2 1.55" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={id('pores')}>
          <feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="2" />
          <feColorMatrix values="0 0 0 0 .75  0 0 0 0 .62  0 0 0 0 .42  0 0 0 -6 3.4" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={id('edge')} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="9" />
        </filter>
        <filter id={id('soft')}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id('blur2')}>
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {/* warm glow behind plate */}
      <circle cx="200" cy="200" r="200" fill={`url(#${id('warm')})`} opacity={0.35 + glow * 0.5} />

      {/* plate */}
      <ellipse cx="206" cy="214" rx="186" ry="184" fill="#000" opacity=".55" filter={`url(#${id('soft')})`} />
      <circle cx="200" cy="200" r="186" fill={`url(#${id('plate')})`} />
      <circle cx="200" cy="200" r="178" fill="none" stroke="#d8b06a" strokeOpacity=".22" strokeWidth="1" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="6" />
      <circle cx="200" cy="200" r="147" fill="none" stroke="#fff" strokeOpacity=".04" strokeWidth="1" />

      {/* appam */}
      <g filter={`url(#${id('edge')})`}>
        <circle cx="160" cy="168" r="112" fill={`url(#${id('appam')})`} />
        <circle cx="160" cy="168" r="96" fill="none" stroke="#c98f4b" strokeWidth="34" filter={`url(#${id('lace')})`} />
      </g>
      <circle cx="160" cy="168" r="56" fill="#fbf4e6" opacity=".85" filter={`url(#${id('blur2')})`} />
      <circle cx="160" cy="168" r="54" fill="#f4e7cc" filter={`url(#${id('pores')})`} opacity=".9" />
      <ellipse cx="140" cy="146" rx="26" ry="12" fill="#fff" opacity=".18" transform="rotate(-30 140 146)" />

      {/* bowl shadow + bowl */}
      <ellipse cx="282" cy="282" rx="96" ry="92" fill="#000" opacity=".6" filter={`url(#${id('soft')})`} />
      <circle cx="274" cy="272" r="94" fill={`url(#${id('bowl')})`} />
      <circle cx="274" cy="272" r="93" fill="none" stroke="#d8b06a" strokeOpacity=".3" strokeWidth="1.2" />
      <circle cx="274" cy="272" r="78" fill={`url(#${id('stew')})`} />
      <circle cx="274" cy="272" r="78" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="4" />

      {/* vegetables in stew */}
      <g>
        {[
          [248, 244, 9], [300, 300, 8], [262, 304, 7.5], [312, 250, 7],
        ].map(([x, y, r], i) => (
          <g key={`c${i}`}>
            <circle cx={x} cy={y} r={r} fill="#e07b35" />
            <circle cx={x} cy={y} r={r * 0.55} fill="#f09a4d" />
          </g>
        ))}
        {[
          [280, 250, 20], [236, 280, -12], [296, 284, 35], [270, 320, 8], [320, 276, -20],
        ].map(([x, y, r], i) => (
          <rect key={`p${i}`} x={x - 8} y={y - 7} width="16" height="14" rx="4" fill="#ecd08e" stroke="#c9a462" strokeWidth=".8" transform={`rotate(${r} ${x} ${y})`} />
        ))}
        {[
          [258, 268], [290, 236], [316, 300], [246, 312], [284, 302], [228, 256], [304, 262],
        ].map(([x, y], i) => (
          <circle key={`g${i}`} cx={x} cy={y} r="4.2" fill="#7fa044" stroke="#5a7a2d" strokeWidth=".6" />
        ))}
        {[
          [262, 230, 30], [322, 318, -40], [236, 300, 70],
        ].map(([x, y, r], i) => (
          <rect key={`b${i}`} x={x - 11} y={y - 3.2} width="22" height="6.4" rx="3.2" fill="#5f8a33" transform={`rotate(${r} ${x} ${y})`} />
        ))}
        {/* onion slivers */}
        <path d="M250 290 q 14 -10 28 0" stroke="#f7ecd8" strokeWidth="2.5" fill="none" opacity=".8" />
        <path d="M296 318 q 10 -9 22 -2" stroke="#f7ecd8" strokeWidth="2.2" fill="none" opacity=".7" />
        {/* green chilli, slit */}
        <path d="M232 236 q 30 -14 60 -8" stroke="#557f2a" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M236 234 q 26 -11 52 -6" stroke="#8cb351" strokeWidth="1.2" fill="none" />
        <path d="M292 228 l 7 -3" stroke="#3d5a1e" strokeWidth="3" strokeLinecap="round" />
        {/* whole spices */}
        <rect x="300" y="236" width="20" height="5" rx="2.5" fill="#7b4a26" transform="rotate(-25 310 238)" />
        <g transform="translate(252 262)">
          <circle r="1.8" fill="#3a2414" />
          <path d="M0 0 L0 -7" stroke="#3a2414" strokeWidth="1.5" />
        </g>
        {/* oil / coconut sheen */}
        {[[270, 258, 3], [292, 292, 2.2], [248, 296, 2], [310, 262, 1.8], [276, 312, 2.4]].map(([x, y, r], i) => (
          <circle key={`o${i}`} cx={x} cy={y} r={r} fill="#f3b24d" opacity=".45" />
        ))}
        {leaf(268, 270, -30, 0.7)}
        {leaf(300, 300, 150, 0.6)}
        {leaf(238, 262, 40, 0.55)}
        <ellipse cx="248" cy="236" rx="30" ry="12" fill="#fff" opacity=".16" transform="rotate(-35 248 236)" />
      </g>

      {/* garnish on plate */}
      {leaf(84, 300, -60, 0.8)}
      {leaf(96, 312, -20, 0.65)}
      <g transform="translate(330 120) rotate(12)">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d="M0 0 C 3 -4, 3 -12, 0 -16 C -3 -12, -3 -4, 0 0 Z" fill="#6b3a1c" stroke="#3f200e" strokeWidth=".6" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="3" fill="#8a5028" />
      </g>
    </svg>
  )
}
