import { useId } from 'react'

/** Generic illustrated bowl for menu dishes that don't have a photo yet. */
export default function BowlArt({ tone, className = '' }: { tone: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`b${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#3a332e" />
          <stop offset="1" stopColor="#0d0b0a" />
        </radialGradient>
        <radialGradient id={`c${id}`} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".5" stopColor={tone} stopOpacity="1" />
          <stop offset="1" stopColor={tone} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="#15110f" />
      <circle cx="100" cy="100" r="80" fill={`url(#b${id})`} stroke="#d8b06a" strokeOpacity=".3" />
      <circle cx="100" cy="100" r="64" fill={`url(#c${id})`} />
      {[[80, 84], [120, 110], [96, 124], [118, 80]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5 - (i % 2)} fill="#fff" opacity=".25" />
      ))}
      <path d="M80 100 C 88 92, 100 92, 108 100 C 100 108, 88 108, 80 100 Z" fill="#3b6128" opacity=".85" />
    </svg>
  )
}
