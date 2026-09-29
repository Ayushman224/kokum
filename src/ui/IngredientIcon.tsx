import type { ReactElement } from 'react'
import type { IconKey } from '../data/types'

const G = '#d8b06a'

/** Engraved-style ingredient illustrations: muted fills + hairline gold edges. */
const icons: Record<IconKey, ReactElement> = {
  coconut: (
    <>
      <circle cx="32" cy="34" r="22" fill="#4a2f1c" stroke={G} strokeOpacity=".5" />
      <circle cx="32" cy="34" r="17" fill="#f4ecdf" />
      <circle cx="32" cy="34" r="11" fill="#e8dcc6" />
      <path d="M14 24 q 4 -8 12 -10" stroke="#7a5236" strokeWidth="1.5" fill="none" />
      <ellipse cx="26" cy="28" rx="5" ry="2.4" fill="#fff" opacity=".6" transform="rotate(-30 26 28)" />
    </>
  ),
  coconutMilk: (
    <>
      <path d="M32 8 C 32 8, 14 30, 14 40 a18 18 0 0 0 36 0 C 50 30, 32 8, 32 8 Z" fill="#f7f0e3" stroke={G} strokeOpacity=".6" />
      <path d="M22 40 a10 10 0 0 0 8 10" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".9" />
      <ellipse cx="32" cy="44" rx="12" ry="4" fill="#e8dcc6" opacity=".6" />
    </>
  ),
  rice: (
    <>
      {[
        [24, 26, -30], [34, 22, 20], [42, 30, 60], [28, 36, 10], [38, 40, -40], [22, 44, 45], [32, 48, -10], [44, 46, 25],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.4" ry="7" fill="#f6efe2" stroke={G} strokeOpacity=".45" strokeWidth=".8" transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </>
  ),
  curryLeaves: (
    <>
      <path d="M12 52 C 24 40, 36 26, 52 12" stroke="#5c7b3a" strokeWidth="1.6" fill="none" />
      {[
        [20, 44, -80], [22, 44, 10], [30, 34, -90], [32, 34, 0], [40, 24, -100], [42, 24, -10], [50, 14, -45],
      ].map(([x, y, r], i) => (
        <path key={i} d="M0 0 C 4 -5, 12 -5, 16 0 C 12 5, 4 5, 0 0 Z" fill={i % 2 ? '#4e7a34' : '#3b6128'} stroke="#8fb563" strokeOpacity=".35" strokeWidth=".6" transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
    </>
  ),
  chilli: (
    <>
      <path d="M16 46 C 22 30, 38 18, 50 16 C 44 24, 34 40, 18 50 Z" fill="#5f9030" stroke={G} strokeOpacity=".4" />
      <path d="M22 44 C 30 34, 38 26, 46 20" stroke="#a6cf6c" strokeWidth="1.2" fill="none" opacity=".7" />
      <path d="M50 16 q 4 -2 6 -8" stroke="#3d5a1e" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  spices: (
    <>
      <g transform="translate(28 34)">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d="M0 0 C 3.5 -5, 3.5 -13, 0 -18 C -3.5 -13, -3.5 -5, 0 0 Z" fill="#7a4424" stroke={G} strokeOpacity=".45" strokeWidth=".7" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="3.4" fill="#a8683a" />
      </g>
      <rect x="40" y="40" width="18" height="6" rx="3" fill="#8b5530" transform="rotate(-35 49 43)" />
      <g transform="translate(48 18)">
        <circle r="2.5" fill="#3a2414" />
        <path d="M0 0 L0 9" stroke="#3a2414" strokeWidth="2" />
      </g>
    </>
  ),
  tomato: (
    <>
      <circle cx="32" cy="36" r="19" fill="#b8422e" stroke={G} strokeOpacity=".35" />
      <ellipse cx="25" cy="29" rx="6" ry="3" fill="#fff" opacity=".25" transform="rotate(-30 25 29)" />
      <path d="M32 18 l -7 -3 l 5 5 l -6 3 l 8 -1 l 0 6 l 2 -6 l 7 2 l -5 -4 l 5 -5 z" fill="#4e7a34" />
    </>
  ),
  cream: (
    <>
      <path d="M12 34 h40 a20 18 0 0 1 -40 0 z" fill="#2a2420" stroke={G} strokeOpacity=".5" />
      <ellipse cx="32" cy="34" rx="20" ry="6" fill="#fbf7ef" />
      <path d="M24 33 c 4 -3, 10 -3, 12 0 c 2 2, 6 2, 8 -1" stroke="#e8dcc6" strokeWidth="1.5" fill="none" />
    </>
  ),
  butter: (
    <>
      <path d="M14 30 l 24 -8 l 14 8 l -24 9 z" fill="#f6dd83" />
      <path d="M14 30 v 12 l 14 8 v -11 z" fill="#e3c35f" />
      <path d="M28 39 v 11 l 24 -9 v -11 z" fill="#d6b24f" stroke={G} strokeOpacity=".4" />
    </>
  ),
  appam: (
    <>
      <circle cx="32" cy="32" r="24" fill="#c98f4b" stroke={G} strokeOpacity=".5" />
      <circle cx="32" cy="32" r="20" fill="#e2bd7f" />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        return <circle key={i} cx={32 + Math.cos(a) * 17} cy={32 + Math.sin(a) * 17} r="1.6" fill="#8e5627" opacity=".7" />
      })}
      <circle cx="32" cy="32" r="12" fill="#f8f0de" />
    </>
  ),
  stew: (
    <>
      <circle cx="32" cy="32" r="24" fill="#1d1916" stroke={G} strokeOpacity=".5" />
      <circle cx="32" cy="32" r="19" fill="#f1e1bd" />
      <circle cx="26" cy="28" r="3.5" fill="#e07b35" />
      <circle cx="38" cy="36" r="3" fill="#e07b35" />
      <circle cx="35" cy="26" r="2.4" fill="#7fa044" />
      <circle cx="27" cy="38" r="2.4" fill="#7fa044" />
      <rect x="31" y="31" width="6" height="5" rx="1.5" fill="#e6c77f" />
    </>
  ),
  carrot: (
    <>
      <path d="M14 52 L 40 20 C 46 14, 54 20, 48 26 Z" fill="#e07b35" stroke={G} strokeOpacity=".4" />
      {[[22, 42], [28, 35], [34, 28]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l 5 3`} stroke="#b85a22" strokeWidth="1.2" />
      ))}
      <path d="M44 22 C 46 12, 52 8, 56 8 M 46 24 C 54 20, 58 22, 60 24 M 45 23 C 48 14, 56 14, 58 16" stroke="#5f8a33" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </>
  ),
  herbs: (
    <>
      <path d="M32 56 V 24" stroke="#5c7b3a" strokeWidth="1.6" />
      {[
        [32, 22, 0], [24, 30, -40], [40, 30, 40], [22, 42, -60], [42, 42, 60],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 0 c -6 -2 -8 -10 -3 -14 c 1 3 3 4 3 4 c 0 0 2 -1 3 -4 c 5 4 3 12 -3 14 z" fill={i % 2 ? '#5b8a3c' : '#6f9d4a'} />
        </g>
      ))}
    </>
  ),
}

export default function IngredientIcon({ icon, className = '' }: { icon: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {icons[icon]}
    </svg>
  )
}
