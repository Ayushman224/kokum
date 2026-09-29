import { motion, useReducedMotion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import { brand, dishData, type TasteProfile } from '../data/dishData'
import { Dust } from './Atmosphere'
import { Screen } from './Screen'

type TasteCardProps = {
  profile: TasteProfile
  url: string
  onShare: () => void
}

export function TasteCard({ profile, url, onShare }: TasteCardProps) {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  async function saveCard() {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#14110d',
      })
      const link = document.createElement('a')
      link.download = `kokum-${profile.id}.png`
      link.href = dataUrl
      link.click()
      setSaved(true)
    } catch {
      setSaved(false)
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Screen className="bg-charcoal">
      <Dust />
      <div className="relative z-10 flex h-full flex-col px-6 pt-16 pb-10">
        <motion.div
          ref={cardRef}
          className="mx-auto w-full max-w-sm bg-[#14110d] px-7 py-8 ring-1 ring-copper/35"
          initial={reduce ? false : { rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <p className="font-serif text-[11px] tracking-[0.4em] text-ivory">
            {brand.name}
          </p>
          <p className="mt-6 text-[10px] tracking-[0.28em] text-copper uppercase">
            {dishData.cardEyebrow}
          </p>
          <p className="mt-2 font-serif text-3xl text-ivory">{profile.name}</p>
          <div className="mt-6 space-y-1">
            {profile.notes.map((note) => (
              <p key={note.label} className="text-[11px] tracking-[0.2em] text-ivory-soft uppercase">
                {note.symbol} {note.label}
              </p>
            ))}
          </div>
          <p className="mt-8 text-[10px] tracking-[0.24em] text-copper uppercase">
            {dishData.cardDiscovered}
          </p>
          <p className="mt-1 font-serif text-lg text-ivory">{dishData.cardDishName}</p>
          <p className="mt-8 text-[10px] tracking-[0.22em] text-ivory-muted">
            {dishData.cardHashtag}
          </p>
        </motion.div>

        <div className="mt-auto flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => void saveCard()}
            className="text-[11px] tracking-[0.26em] text-ivory-muted uppercase"
          >
            {saved ? 'Saved' : dishData.saveCard}
          </button>
          <button
            type="button"
            onClick={onShare}
            className="text-[11px] tracking-[0.28em] text-copper uppercase"
          >
            {dishData.shareCard}
          </button>
          <button
            type="button"
            onClick={() => void copyLink()}
            className="text-[11px] tracking-[0.26em] text-ivory-muted uppercase"
          >
            {copied ? 'Link copied' : dishData.copyLink}
          </button>
        </div>
      </div>
    </Screen>
  )
}
