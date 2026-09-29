import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import DishArt from '../ui/DishArt'
import { Particles } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { sound, haptic } from '../../lib/sound'
import { ArrowRight, Lock, ScanLine, X } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const
const ORBIT_SECONDS = 90

/**
 * SCENE 14 — the wider Kokum world. One story found, seven waiting.
 * Other stories are deliberately unnamed placeholders ("Story 02"…) — never invented dishes.
 * Production: each node maps to a real dish + its own QR; unlocked state comes from the guest's session.
 */
export default function DishExplorer() {
  const { go } = useExperience()
  const reduce = useReducedMotion()
  const [picked, setPicked] = useState<number | null>(null)
  const total = dishData.totalStories
  const stories = Array.from({ length: total }, (_, i) => i + 1)

  const pick = (n: number) => {
    sound.tap()
    haptic()
    setPicked(n)
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 40% at 50% 52%, rgba(192,122,76,.16), transparent 70%)' }} />
      <Particles count={12} />

      <div className="absolute inset-x-0 top-[9%] px-8 text-center">
        <motion.h2 className="display text-[38px] text-ivory" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
          You've discovered
          <br />
          <span className="gold-text italic">one story.</span>
        </motion.h2>
        <motion.div className="mt-3 font-serif text-[22px] tabular-nums text-ivory/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <span className="text-gold">01</span> / {String(total).padStart(2, '0')}
        </motion.div>
      </div>

      {/* radial explorer */}
      <div className="absolute left-1/2 top-[57%] aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-[9%] rounded-full border border-gold/15" />
        <div className="absolute inset-[22%] rounded-full border border-dashed border-gold/10" />
        {/* orbit */}
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
        >
          {stories.map((n, i) => {
            const a = ((90 + (i * 360) / total) * Math.PI) / 180
            const mine = n === dishData.storyNumber
            return (
              <motion.div
                key={n}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${50 + Math.cos(a) * 41}%`, top: `${50 + Math.sin(a) * 41}%` }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
              >
                <motion.button
                  type="button"
                  onClick={() => pick(n)}
                  aria-label={mine ? `Story ${n}: ${dishData.name} — discovered` : `Story ${String(n).padStart(2, '0')} — coming soon, locked`}
                  className="flex flex-col items-center"
                  animate={reduce ? undefined : { rotate: -360 }}
                  transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
                  whileTap={{ scale: 0.9 }}
                >
                  {mine ? (
                    <span className="relative block h-[64px] w-[64px]">
                      <span className="ring-pulse absolute inset-0 rounded-full border border-gold/70" />
                      <span className="absolute inset-0 overflow-clip rounded-full ring-2 ring-gold shadow-[0_0_30px_rgba(216,176,106,.6)]">
                        <DishArt className="h-full w-full scale-[1.15]" />
                      </span>
                    </span>
                  ) : (
                    <span className="grid h-[46px] w-[46px] place-items-center rounded-full border border-ivory/15 bg-white/[0.03] backdrop-blur">
                      <Lock className="h-4 w-4 text-ivory/35" aria-hidden="true" />
                    </span>
                  )}
                  <span className={`mt-1.5 whitespace-nowrap text-[8.5px] font-semibold uppercase tracking-[0.16em] ${mine ? 'text-gold' : 'text-ivory/40'}`}>
                    {mine ? 'Your dish' : `Story ${String(n).padStart(2, '0')}`}
                  </span>
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>
        {/* centre medallion */}
        <div className="absolute left-1/2 top-1/2 grid h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-gradient-to-b from-[#1f1814] to-[#0e0b09] shadow-[0_0_60px_rgba(216,176,106,.15)]">
          <div className="text-center">
            <div className="font-serif text-[15px] tracking-[0.4em] text-ivory">KOKUM</div>
            <div className="mt-1 text-[8px] uppercase tracking-[0.2em] text-gold/70">8 stories</div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[4%] flex flex-col items-center px-8 text-center">
        <motion.p className="font-serif text-[19px] italic text-ivory/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          Which story will you discover next?
        </motion.p>
        <motion.button type="button" onClick={() => go('finale')} className="eyebrow mt-2 flex min-h-11 items-center gap-2 px-4 text-gold/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          Close this story <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.button>
      </div>

      {/* locked-story sheet */}
      <AnimatePresence>
        {picked !== null && (
          <>
            <motion.div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPicked(null)} />
            <motion.div
              className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] border-t border-gold/25 bg-gradient-to-b from-[#1d1713] to-[#0e0b09] px-7 pb-10 pt-4 text-center"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => info.offset.y > 80 && setPicked(null)}
              role="dialog"
              aria-modal="true"
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-ivory/20" />
              <button type="button" onClick={() => setPicked(null)} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-ivory/60">
                <X className="h-5 w-5" />
              </button>
              {picked === dishData.storyNumber ? (
                <>
                  <div className="eyebrow text-gold">Story 01 · Discovered</div>
                  <div className="display mt-2 text-[34px] text-ivory">{dishData.name}</div>
                  <p className="mt-3 text-[13px] text-ivory/55">You've already unlocked this one. It lives in your collection.</p>
                </>
              ) : (
                <>
                  <div className="eyebrow text-ivory/50">Story {String(picked).padStart(2, '0')} · Coming soon</div>
                  <div className="relative mx-auto mt-6 grid h-28 w-28 place-items-center">
                    {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'].map((c) => (
                      <span key={c} className={`absolute h-6 w-6 rounded-sm border-gold ${c}`} />
                    ))}
                    <ScanLine className="h-10 w-10 text-gold/70" aria-hidden="true" />
                    <motion.span className="absolute inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_12px_#d8b06a]" animate={{ top: ['12%', '88%', '12%'] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
                  </div>
                  <p className="display mx-auto mt-6 max-w-[280px] text-[26px] text-ivory">
                    Scan the QR beside another dish to <span className="gold-text italic">unlock its story.</span>
                  </p>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
