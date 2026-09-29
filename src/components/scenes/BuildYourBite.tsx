import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DragToken from '../ui/DragToken'
import IngredientIcon from '../ui/IngredientIcon'
import { MagneticButton, Particles, Ripple } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { pointInside } from '../../experience/hooks'
import { computeTaste } from '../../lib/taste'
import { sound, haptic } from '../../lib/sound'
import { Sparkles } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const
const MIN_ITEMS = 3
// Where each placed item lands on the plate (% of plate box).
const SLOTS = [
  { x: 50, y: 50, s: 1.25 },
  { x: 30, y: 34, s: 0.95 },
  { x: 70, y: 36, s: 0.95 },
  { x: 32, y: 68, s: 0.9 },
  { x: 68, y: 67, s: 0.9 },
]

/** SCENE 06 — personalisation. Drag what you'd pick onto the plate; the plate becomes yours. */
export default function BuildYourBite() {
  const { setTaste, setBiteIds, go } = useExperience()
  const [picked, setPicked] = useState<string[]>([])
  const [ripple, setRipple] = useState(0)
  const [generating, setGenerating] = useState(false)
  const plateRef = useRef<HTMLDivElement>(null)
  const items = dishData.biteItems

  const add = (id: string) => {
    if (generating || picked.includes(id)) return false
    setPicked((p) => [...p, id])
    setRipple((r) => r + 1)
    sound.select()
    return true
  }
  const remove = (id: string) => {
    if (generating) return
    sound.tap()
    haptic(6)
    setPicked((p) => p.filter((x) => x !== id))
  }

  const generate = () => {
    setGenerating(true)
    sound.reveal()
    haptic([10, 30, 10, 30, 10])
    const chosen = items.filter((i) => picked.includes(i.id))
    setBiteIds(picked)
    setTaste(computeTaste(chosen))
    window.setTimeout(() => {
      sound.success()
      go('profile')
    }, 2300)
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 45% at 50% 44%, rgba(216,176,106,.13), transparent 70%)' }} />

      <div className="absolute inset-x-0 top-[11%] px-8 text-center">
        <motion.div className="eyebrow text-gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Your turn.
        </motion.div>
        <motion.h2 className="display mt-3 text-[40px] text-ivory" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease }}>
          Build the bite
          <br />
          <span className="gold-text italic">you'd choose.</span>
        </motion.h2>
      </div>

      {/* plate */}
      <div ref={plateRef} className="absolute left-1/2 top-[48%] aspect-square w-[66%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 45% 38%, #2f2925, #151210 65%, #0c0a09)',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,.9), inset 0 0 0 1px rgba(216,176,106,.25), inset 0 0 0 14px rgba(0,0,0,.25)',
          }}
          animate={generating ? { rotate: 360, scale: [1, 1.06, 0.96] } : { rotate: 0, scale: 1 + picked.length * 0.012 }}
          transition={generating ? { duration: 2.2, ease: [0.6, 0, 0.2, 1] } : { type: 'spring', stiffness: 150, damping: 15 }}
        />
        <div className="pointer-events-none absolute inset-[7%] rounded-full border border-gold/15" />
        {picked.length === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <span className="font-serif text-[16px] italic text-ivory/35">
              Drop here
              <br />
              or tap below
            </span>
          </div>
        )}
        <AnimatePresence>
          {picked.map((id, i) => {
            const it = items.find((x) => x.id === id)!
            const slot = SLOTS[i]
            return (
              <motion.button
                key={id}
                type="button"
                aria-label={`Remove ${it.label} from your bite`}
                onClick={() => remove(id)}
                className="absolute aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                initial={{ scale: 0, opacity: 0, rotate: -40 }}
                animate={generating ? { left: '50%', top: '50%', scale: 0.2, opacity: 0, rotate: 360 } : { scale: slot.s, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={generating ? { duration: 1.6, delay: i * 0.08, ease: [0.6, 0, 0.3, 1] } : { type: 'spring', stiffness: 260, damping: 18 }}
              >
                <span className="absolute inset-[10%] rounded-full bg-gold/10 blur-md" />
                <IngredientIcon icon={it.icon} className="relative h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,.6)]" />
              </motion.button>
            )
          })}
        </AnimatePresence>
        <Ripple trigger={ripple} />
        <AnimatePresence>
          {generating && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,236,200,.9), rgba(216,176,106,.4) 35%, transparent 65%)' }}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 1.4, 2.4], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, delay: 0.9, ease }}
            />
          )}
        </AnimatePresence>
      </div>
      {generating && <Particles count={28} />}

      {/* tray + CTA */}
      <div className="absolute inset-x-0 bottom-[5%] px-4">
        <div className="mb-5 flex h-12 items-center justify-center">
          <AnimatePresence mode="wait">
            {picked.length >= MIN_ITEMS && !generating ? (
              <motion.div key="cta" initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <MagneticButton onClick={generate} className="shimmer">
                  <Sparkles className="h-4 w-4" aria-hidden="true" /> Generate my bite
                </MagneticButton>
              </motion.div>
            ) : generating ? (
              <motion.p key="gen" className="eyebrow text-gold" initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
                Reading your taste…
              </motion.p>
            ) : (
              <motion.p key="count" className="eyebrow text-ivory/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {picked.length === 0 ? `Pick at least ${MIN_ITEMS}` : `${MIN_ITEMS - picked.length} more to go`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <motion.div className="flex justify-between" animate={{ opacity: generating ? 0 : 1, y: generating ? 20 : 0 }}>
          {items.map((it, i) => (
            <DragToken
              key={it.id}
              label={it.label}
              icon={it.icon}
              size={58}
              floatDelay={i * 0.9}
              hidden={picked.includes(it.id)}
              onActivate={() => add(it.id)}
              onDrop={(x, y) => (pointInside(plateRef.current, x, y, 10) ? add(it.id) : false)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
