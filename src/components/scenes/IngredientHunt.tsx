import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DishArt from '../ui/DishArt'
import IngredientIcon from '../ui/IngredientIcon'
import { Ripple, Steam } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { useAfter, useStages } from '../../experience/hooks'
import { sound, haptic } from '../../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const
// Orbit positions (degrees) around the dish for the floating ingredients.
const ANGLES = [-90, -18, 54, 126, 198]

interface Flight {
  id: string
  dx: number
  dy: number
  from: { x: number; y: number }
  to: { x: number; y: number }
}

/** SCENE 03 — ingredients drift around the plate; tap to pull them into the dish. */
export default function IngredientHunt() {
  const { next } = useExperience()
  const [stage] = useStages([400, 2200])
  const [found, setFound] = useState<string[]>([])
  const [flight, setFlight] = useState<Record<string, Flight>>({})
  const [ripple, setRipple] = useState(0)
  const [shake, setShake] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const dishRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const goal = dishData.ingredientsToFind
  const complete = found.length >= goal
  const latest = dishData.ingredients.find((i) => i.id === found[found.length - 1])

  const pick = (id: string) => {
    if (stage < 2) return
    if (complete || found.includes(id)) {
      setShake(id)
      window.setTimeout(() => setShake(null), 400)
      return
    }
    const root = rootRef.current!.getBoundingClientRect()
    const d = dishRef.current!.getBoundingClientRect()
    const it = itemRefs.current[id]!.getBoundingClientRect()
    const from = { x: it.left + it.width / 2 - root.left, y: it.top + it.height / 2 - root.top }
    const to = { x: d.left + d.width / 2 - root.left, y: d.top + d.height / 2 - root.top }
    setFlight((f) => ({ ...f, [id]: { id, dx: to.x - from.x, dy: to.y - from.y, from, to } }))
    sound.select()
    haptic(12)
    window.setTimeout(() => {
      setFound((f) => (f.includes(id) ? f : [...f, id]))
      setRipple((r) => r + 1)
    }, 650)
  }

  useAfter(complete, 2600, next)

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 46%, rgba(192,122,76,.18), transparent 70%)' }} />

      {/* header */}
      <div className="absolute inset-x-0 top-[12%] px-8 text-center">
        <AnimatePresence mode="wait">
          {!complete ? (
            <motion.div key="q" exit={{ opacity: 0, y: -10 }}>
              <motion.p
                className="font-serif text-[21px] italic leading-tight text-ivory/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: stage >= 1 ? 1 : 0, y: 0 }}
                transition={{ duration: 0.9 }}
              >
                Something here makes this dish special.
              </motion.p>
              <motion.h2
                className="display mt-3 text-[36px] text-ivory"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: stage >= 2 ? 1 : 0, filter: stage >= 2 ? 'blur(0px)' : 'blur(10px)' }}
                transition={{ duration: 0.9 }}
              >
                Find <span className="gold-text italic">{goal}</span> ingredients.
              </motion.h2>
            </motion.div>
          ) : (
            <motion.h2
              key="done"
              className="display text-[46px] text-ivory"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease }}
            >
              You found <span className="gold-text italic">them.</span>
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* dish */}
      <div ref={dishRef} className="absolute left-1/2 top-[52%] w-[50%] -translate-x-1/2 -translate-y-1/2">
        <motion.div animate={complete ? { scale: 1.12 } : { scale: 1 + found.length * 0.025 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          <DishArt className="w-full" glow={found.length / goal} />
        </motion.div>
        <Steam className="absolute left-[40%] top-[-40%] w-[50%]" intensity={0.5 + found.length * 0.2} />
        <Ripple trigger={ripple} />
        {/* attached ingredients sit on the rim */}
        {found.map((id, i) => {
          const ing = dishData.ingredients.find((x) => x.id === id)!
          const a = ((-120 + i * 60) * Math.PI) / 180
          return (
            <motion.div
              key={id}
              className="absolute h-[26%] w-[26%] rounded-full border border-gold/50 bg-coal/80 p-1.5 shadow-[0_0_20px_rgba(216,176,106,.5)] backdrop-blur"
              style={{ left: `${50 + Math.cos(a) * 58 - 13}%`, top: `${50 + Math.sin(a) * 58 - 13}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            >
              <IngredientIcon icon={ing.icon} className="h-full w-full" />
            </motion.div>
          )
        })}
      </div>

      {/* glowing trails */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="trail" x1="0" x2="1">
            <stop offset="0" stopColor="#d8b06a" stopOpacity="0" />
            <stop offset="1" stopColor="#f5dca8" />
          </linearGradient>
          <filter id="trail-glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {Object.values(flight).map((f) => {
          const mx = (f.from.x + f.to.x) / 2 + (f.to.y - f.from.y) * 0.25
          const my = (f.from.y + f.to.y) / 2 - (f.to.x - f.from.x) * 0.25
          return (
            <motion.path
              key={f.id}
              d={`M${f.from.x} ${f.from.y} Q ${mx} ${my} ${f.to.x} ${f.to.y}`}
              stroke="#e9c98c"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              filter="url(#trail-glow)"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 1, 0] }}
              transition={{ pathLength: { duration: 0.6, ease: 'easeInOut' }, opacity: { duration: 1.4, times: [0, 0.5, 1] } }}
            />
          )
        })}
      </svg>

      {/* floating ingredients */}
      {dishData.ingredients.map((ing, i) => {
        const a = (ANGLES[i % ANGLES.length] * Math.PI) / 180
        const f = flight[ing.id]
        const gone = !!f
        return (
          <motion.button
            key={ing.id}
            ref={(el) => {
              itemRefs.current[ing.id] = el
            }}
            type="button"
            aria-label={`${ing.label}${gone ? ' — found' : ''}`}
            disabled={gone || stage < 2}
            onClick={() => pick(ing.id)}
            className="absolute flex w-[84px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${50 + Math.cos(a) * 36}%`, top: `${52 + Math.sin(a) * 24}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              gone
                ? { x: f.dx, y: f.dy, scale: 0.2, opacity: [1, 1, 0] }
                : complete
                  ? { opacity: 0, scale: 0.8, filter: 'blur(6px)' }
                  : { opacity: stage >= 2 ? 1 : 0.0, scale: 1, x: shake === ing.id ? [0, -6, 6, -4, 0] : 0 }
            }
            transition={gone ? { duration: 0.65, ease: [0.5, 0, 0.2, 1] } : { duration: 0.7, delay: stage >= 2 && !complete ? i * 0.08 : 0 }}
          >
            <span className="floaty relative block" style={{ ['--fd' as string]: `${4 + i * 0.6}s`, ['--fdelay' as string]: `${-i}s` }}>
              <span className="absolute inset-0 rounded-full bg-gold/10 blur-xl" />
              <span className="relative grid h-[64px] w-[64px] place-items-center rounded-full border border-gold/30 bg-gradient-to-b from-white/[0.07] to-white/[0.01] backdrop-blur-sm transition-colors hover:border-gold/70">
                <IngredientIcon icon={ing.icon} className="h-11 w-11" />
              </span>
            </span>
            <span className="eyebrow mt-2 text-[9.5px] text-ivory/75">{ing.label}</span>
          </motion.button>
        )
      })}

      {/* progress + note */}
      <div className="absolute inset-x-0 bottom-[7%] flex flex-col items-center px-8 text-center" aria-live="polite">
        <div className="flex items-center gap-2">
          {Array.from({ length: goal }).map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 rounded-full"
              animate={{ width: i < found.length ? 28 : 10, backgroundColor: i < found.length ? '#d8b06a' : 'rgba(244,236,223,.2)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          ))}
        </div>
        <motion.div key={found.length} className="eyebrow mt-3 text-gold" initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          {found.length} / {goal} found
        </motion.div>
        <div className="mt-3 h-10">
          <AnimatePresence mode="wait">
            {latest && (
              <motion.p
                key={latest.id}
                className="max-w-[280px] font-serif text-[16px] italic leading-snug text-ivory/70"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {latest.note}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
