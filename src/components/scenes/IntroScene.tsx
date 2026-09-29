import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DishArt from '../ui/DishArt'
import { Particles } from '../ui/Effects'
import { useExperience } from '../../experience/store'
import { useStages } from '../../experience/hooks'
import { sound, haptic } from '../../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const

/** SCENE 01 — near-black, a glow, the dish emerges, then a touch-to-begin "fingerprint". */
export default function IntroScene() {
  const { next } = useExperience()
  // 1 wordmark · 2 "something is waiting" · 3 dish emerges · 4 headline · 5 touch prompt
  const [stage, setStage] = useStages([500, 1600, 3300, 4700, 6000])
  const [opening, setOpening] = useState(false)

  const begin = () => {
    if (opening) return
    if (stage < 5) {
      setStage(5) // impatient tap fast-forwards the intro
      return
    }
    setOpening(true)
    sound.reveal()
    haptic([10, 40, 20])
    window.setTimeout(next, 1100)
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink" onClick={stage < 5 ? begin : undefined}>
      {/* glow */}
      <motion.div
        className="absolute left-1/2 top-[42%] h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(216,150,80,.28) 0%, rgba(138,39,72,.10) 35%, transparent 62%)' }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: stage >= 2 ? 1 : 0, scale: stage >= 2 ? 1 : 0.4 }}
        transition={{ duration: 3, ease }}
      />

      {/* dish emerging from darkness */}
      <motion.div
        className="absolute left-1/2 top-[38%] w-[118%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 1.25, filter: 'blur(24px) brightness(.3)' }}
        animate={
          stage >= 3
            ? { opacity: stage >= 4 ? 0.55 : 0.8, scale: 1, filter: 'blur(0px) brightness(.8)' }
            : { opacity: 0, scale: 1.25, filter: 'blur(24px) brightness(.3)' }
        }
        transition={{ duration: 3.2, ease }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}>
          <DishArt className="w-full" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,9,8,.2) 0%, rgba(11,9,8,.1) 35%, rgba(11,9,8,.85) 62%, #0b0908 80%)' }} />
      <div className="vignette absolute inset-0" />
      {stage >= 2 && <Particles count={16} />}

      {/* wordmark */}
      <motion.div
        className="absolute inset-x-0 top-[13%] text-center"
        initial={{ opacity: 0, letterSpacing: '0.9em' }}
        animate={{ opacity: stage >= 1 ? 1 : 0, letterSpacing: stage >= 1 ? '0.55em' : '0.9em' }}
        transition={{ duration: 2.2, ease }}
      >
        <span className="font-serif text-[15px] text-ivory/90">KOKUM</span>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center px-8 text-center">
        <AnimatePresence mode="wait">
          {stage >= 2 && stage < 4 && (
            <motion.p
              key="waiting"
              className="mb-24 font-serif text-[22px] italic text-ivory/80"
              initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 1.1 }}
            >
              Something is waiting for you.
            </motion.p>
          )}
          {stage >= 4 && (
            <motion.div key="headline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <h1 className="display text-[54px] text-ivory">
                {['Every dish', 'has a story.'].map((l, i) => (
                  <span key={l} className="block overflow-hidden pb-1">
                    <motion.span
                      className={`block ${i === 1 ? 'gold-text italic' : ''}`}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1.1, delay: i * 0.15, ease }}
                    >
                      {l}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p
                className="mt-4 text-[14px] text-ivory/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                Want to discover yours?
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* touch-to-begin fingerprint */}
        <motion.div
          className="mt-9 flex flex-col items-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: stage >= 5 ? 1 : 0, y: stage >= 5 ? 0 : 12 }}
          transition={{ duration: 1, ease }}
        >
          <button
            type="button"
            aria-label="Touch to begin the story"
            onClick={(e) => {
              e.stopPropagation()
              begin()
            }}
            className="relative grid h-[88px] w-[88px] place-items-center rounded-full"
            tabIndex={stage >= 5 ? 0 : -1}
          >
            <span className="ring-pulse absolute inset-0 rounded-full border border-gold/60" />
            <span className="ring-pulse absolute inset-0 rounded-full border border-gold/40" style={{ animationDelay: '1.3s' }} />
            <span className="absolute inset-2 rounded-full bg-gold/10 shadow-[0_0_40px_rgba(216,176,106,.35)] backdrop-blur-sm" />
            <Fingerprint />
          </button>
          <span className="eyebrow mt-4 text-gold/80">Touch to begin</span>
        </motion.div>
      </div>

      {/* opening burst — light floods out from the touch point */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[80%] z-50 aspect-square w-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, #fff3dc 0%, #e7b877 30%, rgba(192,122,76,.6) 55%, rgba(11,9,8,0) 72%)' }}
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: 60, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Fingerprint() {
  return (
    <svg viewBox="0 0 48 48" className="relative h-10 w-10 text-gold" aria-hidden="true">
      {[6, 10, 14, 18].map((r, i) => (
        <motion.path
          key={r}
          d={`M${24 - r} ${28} a ${r} ${r + 2} 0 0 1 ${r * 2} 0 ${i % 2 ? `v ${3 + i}` : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: 'easeInOut' }}
        />
      ))}
      <circle cx="24" cy="28" r="1.6" fill="currentColor" />
    </svg>
  )
}
