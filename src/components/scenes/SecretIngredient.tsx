import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DishArt from '../ui/DishArt'
import DragToken from '../ui/DragToken'
import { Particles, Ripple } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { pointInside, useAfter, useStages } from '../../experience/hooks'
import { sound, haptic } from '../../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const

/** SCENE 04 — the room darkens; one more ingredient hides in the dish. Drag the right one in. */
export default function SecretIngredient() {
  const { next } = useExperience()
  const s = dishData.secretIngredient
  const [stage] = useStages([300, 1900, 2800])
  const [solved, setSolved] = useState(false)
  const [wrong, setWrong] = useState<string | null>(null)
  const [hover, setHover] = useState(false)
  const dishRef = useRef<HTMLDivElement>(null)

  const attempt = (id: string) => {
    if (solved) return false
    if (id === s.correctId) {
      setSolved(true)
      setWrong(null)
      sound.success()
      haptic([10, 30, 10, 30, 40])
      return true
    }
    setWrong(id)
    return 'wrong' as const
  }

  useAfter(solved, 3600, next)

  return (
    <div className="absolute inset-0 overflow-clip bg-[#070605]" onPointerMove={() => hover && setHover(false)}>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: solved ? 1 : 0.6 }}
        transition={{ duration: 1.6 }}
        style={{ background: 'radial-gradient(60% 40% at 50% 45%, rgba(244,236,223,.14), transparent 70%)' }}
      />

      <div className="absolute inset-x-0 top-[11%] px-8 text-center">
        <motion.p
          className="font-serif text-[21px] italic text-ivory/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 1 && !solved ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        >
          But there is one more.
        </motion.p>
        <AnimatePresence mode="wait">
          {!solved ? (
            <motion.h2
              key="secret"
              className="display mt-2 text-[64px] tracking-[0.02em] text-ivory"
              initial={{ opacity: 0, letterSpacing: '0.3em', filter: 'blur(12px)' }}
              animate={{ opacity: stage >= 2 ? 1 : 0, letterSpacing: '0.02em', filter: stage >= 2 ? 'blur(0px)' : 'blur(12px)' }}
              exit={{ opacity: 0, filter: 'blur(12px)' }}
              transition={{ duration: 1.4, ease }}
            >
              The <span className="gold-text italic">secret.</span>
            </motion.h2>
          ) : (
            <motion.div key="solved" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.6 }}>
              <h2 className="display mt-2 text-[44px] text-ivory">
                You found
                <br />
                <span className="gold-text italic">the secret.</span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* dish / drop target */}
      <div ref={dishRef} className="absolute left-1/2 top-[47%] w-[62%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={solved ? { scale: 1.08, filter: 'brightness(1.1)' } : { scale: hover ? 1.05 : 1, filter: 'brightness(.75)' }}
          transition={{ duration: 1.2, ease }}
        >
          <DishArt className="w-full" glow={solved ? 1 : 0.1} />
        </motion.div>
        {/* coconut milk swirl melting into the stew */}
        <AnimatePresence>
          {solved && (
            <motion.div
              className="pointer-events-none absolute left-[68%] top-[68%] aspect-square w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,251,242,.95) 0%, rgba(255,248,235,.6) 40%, transparent 70%)' }}
              initial={{ scale: 0.1, opacity: 1, rotate: 0 }}
              animate={{ scale: [0.1, 1.2, 1], opacity: [1, 0.9, 0], rotate: 180 }}
              transition={{ duration: 2.4, ease }}
            />
          )}
        </AnimatePresence>
        {!solved && stage >= 3 && (
          <div className="pointer-events-none absolute inset-[-6%] rounded-full border border-dashed border-gold/30 spin-mid" aria-hidden="true" />
        )}
        <Ripple trigger={solved ? 1 : 0} color="#f4ecdf" />
      </div>
      {solved && <Particles count={26} color="#f4ecdf" />}

      {/* options */}
      <div className="absolute inset-x-0 bottom-[8%] px-6">
        <div className="mb-5 h-6 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {solved ? (
              <motion.p key="note" className="mx-auto max-w-[300px] font-serif text-[16px] italic leading-snug text-ivory/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                {s.revealNote}
              </motion.p>
            ) : wrong ? (
              <motion.p key={`w-${wrong}`} className="font-serif text-[19px] italic text-copper" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {s.wrongMessage}
              </motion.p>
            ) : (
              <motion.p key="p" className="eyebrow text-ivory/50" initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 1 : 0 }}>
                {s.prompt}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          className="flex justify-around"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: stage >= 3 && !solved ? 1 : solved ? 0 : 0, y: stage >= 3 ? 0 : 30 }}
          transition={{ duration: 0.8, ease }}
        >
          {s.options.map((o, i) => (
            <DragToken
              key={o.id}
              label={o.label}
              icon={o.icon}
              floatDelay={i * 1.3}
              hidden={solved && o.id === s.correctId}
              disabled={solved}
              onActivate={() => attempt(o.id)}
              onDrop={(x, y) => (pointInside(dishRef.current, x, y, 20) ? attempt(o.id) : false)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
