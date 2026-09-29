import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CardBack, CardFront } from '../ui/KokumCard'
import { MagneticButton, Particles } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { renderCardPng } from '../../lib/cardImage'
import { buildShareUrl, copyText } from '../../lib/share'
import { sound, haptic } from '../../lib/sound'
import { Download, Link2, Share2, X } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

/** SCENE 09 — the collectible. Card materialises, flips, and is theirs to keep. */
export default function TasteCard() {
  const { profile, go, showToast } = useExperience()
  const [flipped, setFlipped] = useState(false)
  const [ready, setReady] = useState(false)
  const [png, setPng] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => {
      setFlipped(true)
      sound.reveal()
      haptic([10, 50, 10])
    }, 1300)
    const t2 = window.setTimeout(() => {
      setReady(true)
      sound.success()
    }, 2900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const save = async () => {
    const url = png ?? (await renderCardPng(profile))
    setPng(url)
    setPreview(true)
  }

  const copyLink = async () => {
    const ok = await copyText(buildShareUrl(dishData.id, profile))
    showToast(ok ? 'Link copied' : 'Could not copy — long-press the link instead')
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(70% 45% at 50% 40%, ${profile.accent}30, transparent 70%)` }}
        animate={{ opacity: flipped ? 1 : 0.3 }}
        transition={{ duration: 1.5 }}
      />
      <Particles count={ready ? 22 : 8} color={profile.accent} />

      <div className="absolute inset-x-0 top-[8%] text-center">
        <AnimatePresence mode="wait">
          <motion.div key={ready ? 'r' : 'c'} className="eyebrow text-gold/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {ready ? 'Your Kokum card' : 'Creating your card…'}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* card */}
      <div className="absolute left-1/2 top-[45%] aspect-[9/14] w-[68%] -translate-x-1/2 -translate-y-1/2" style={{ perspective: 1200 }}>
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateY: 0, scale: 0.4, opacity: 0, y: 60 }}
          animate={{ rotateY: flipped ? 180 : 0, scale: 1, opacity: 1, y: 0 }}
          transition={{ rotateY: { duration: 1.3, ease: [0.6, 0, 0.2, 1] }, scale: { duration: 1.1, ease }, opacity: { duration: 0.6 }, y: { duration: 1.1, ease } }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <CardBack />
          </div>
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            {flipped && <CardFront profile={profile} reveal />}
          </div>
        </motion.div>
        {/* sweep of light across the card */}
        {ready && (
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-clip rounded-[18px]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              initial={{ x: '-120%', skewX: -18 }}
              animate={{ x: '260%' }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </div>

      {/* actions */}
      <motion.div
        className="absolute inset-x-0 bottom-[5%] flex flex-col items-center gap-3 px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24 }}
        transition={{ duration: 0.8, ease }}
        style={{ pointerEvents: ready ? 'auto' : 'none' }}
      >
        <div className="flex w-full gap-3">
          <MagneticButton variant="ghost" onClick={save} className="flex-1 px-3 tracking-[0.14em]">
            <Download className="h-4 w-4" aria-hidden="true" /> Save card
          </MagneticButton>
          <MagneticButton onClick={() => go('share')} className="flex-1 px-3 tracking-[0.14em]">
            <Share2 className="h-4 w-4" aria-hidden="true" /> Share card
          </MagneticButton>
        </div>
        <button type="button" onClick={copyLink} className="eyebrow flex min-h-11 items-center gap-2 px-4 text-ivory/60 hover:text-ivory">
          <Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Copy share link
        </button>
      </motion.div>

      {/* save sheet */}
      <AnimatePresence>
        {preview && png && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 px-8 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Your card image"
          >
            <button type="button" onClick={() => setPreview(false)} aria-label="Close" className="absolute right-4 top-14 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-ivory/80">
              <X className="h-5 w-5" />
            </button>
            <motion.img src={png} alt={`Kokum card — ${profile.title}`} className="max-h-[62%] rounded-xl shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} />
            <p className="mt-4 text-center text-[12px] text-ivory/55">Long-press the image to save it, or download below.</p>
            <a href={png} download="kokum-card.png" className="eyebrow mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-b from-[#f1d9a4] via-[#d8b06a] to-[#a8763f] px-7 text-ink">
              <Download className="h-4 w-4" aria-hidden="true" /> Download PNG
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
