import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, X } from 'lucide-react'
import DishArt from '../ui/DishArt'
import DragToken from '../ui/DragToken'
import IngredientIcon from '../ui/IngredientIcon'
import { MagneticButton, Particles, Ripple, Steam } from '../ui/Effects'
import { kitchenGame, menu } from '../data/restaurant'
import type { IconKey } from '../data/types'
import { useStore } from '../state/store'
import { pointInside, useAfter } from '../lib/hooks'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const
type Phase = 'find' | 'add' | 'heat' | 'cooking' | 'ready'

// Decoys hidden in the kitchen alongside the real ingredients.
const DECOYS: { id: string; label: string; icon: IconKey }[] = [
  { id: 'tomato', label: 'Tomato', icon: 'tomato' },
  { id: 'butter', label: 'Butter', icon: 'butter' },
]
// Where items float around the pan during "find" (% of screen).
const SPOTS = [
  { x: 16, y: 30 }, { x: 84, y: 28 }, { x: 12, y: 58 }, { x: 88, y: 60 }, { x: 30, y: 76 }, { x: 70, y: 77 },
]

const TITLES: Record<Phase, [string, string]> = {
  find: ['Find the', 'ingredients.'],
  add: ['Into the', 'pan.'],
  heat: ['Find the', 'perfect heat.'],
  cooking: ['Let it', 'simmer.'],
  ready: ['Your dish', 'is ready.'],
}

export default function KitchenScreen() {
  const { go, dishId } = useStore()
  const dish = menu.find((d) => d.id === dishId)!
  const real = kitchenGame.ingredients
  const items = useRef([...real, ...DECOYS].sort((a, b) => (a.id > b.id ? 1 : -1))).current
  const [phase, setPhase] = useState<Phase>('find')
  const [found, setFound] = useState<string[]>([])
  const [added, setAdded] = useState<string[]>([])
  const [shake, setShake] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [heat, setHeat] = useState(10)
  const [ripple, setRipple] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const panRef = useRef<HTMLDivElement>(null)
  const [lo, hi] = kitchenGame.sweetSpot
  const inZone = heat >= lo && heat <= hi

  const say = (m: string) => {
    setMsg(m)
    window.setTimeout(() => setMsg((cur) => (cur === m ? null : cur)), 1600)
  }

  // STEP 1 — find
  const pick = (id: string) => {
    if (phase !== 'find' || found.includes(id)) return
    if (!real.some((r) => r.id === id)) {
      sound.wrong()
      haptic([20, 40, 20])
      setShake(id)
      say('Not in this dish.')
      window.setTimeout(() => setShake(null), 450)
      return
    }
    sound.select()
    haptic(10)
    const next = [...found, id]
    setFound(next)
    if (next.length === real.length) {
      say('All four. Now cook.')
      window.setTimeout(() => setPhase('add'), 900)
    }
  }

  // STEP 2 — drag into pan
  const drop = (id: string) => {
    if (phase !== 'add' || added.includes(id)) return false
    sound.sizzle()
    haptic([8, 20, 8])
    setRipple((r) => r + 1)
    const next = [...added, id]
    setAdded(next)
    if (next.length === real.length) window.setTimeout(() => setPhase('heat'), 900)
    return true
  }

  // STEP 3 — hold heat in the sweet spot
  useEffect(() => {
    if (phase !== 'heat' || !inZone) return
    const t = window.setTimeout(() => {
      sound.success()
      haptic([15, 30, 15, 30, 60])
      setPhase('cooking')
    }, 900)
    return () => clearTimeout(t)
  }, [inZone, phase])

  // STEP 4 — short cinematic, then the plated dish
  useAfter(phase === 'cooking', 4200, () => {
    sound.reveal()
    setPhase('ready')
  })

  const flame = phase === 'find' ? 0.3 : phase === 'add' ? 0.5 : phase === 'heat' ? 0.3 + (heat / 100) * 1.1 : 1
  const heatMsg = heat < lo ? kitchenGame.tooLow : heat > hi ? kitchenGame.tooHigh : 'Hold it there…'
  const [t1, t2] = TITLES[phase]

  return (
    <div className="absolute inset-0 overflow-clip bg-[#0d0a08]">
      {/* kitchen backdrop */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 50% at 80% 0%, rgba(240,170,90,.18), transparent 70%), radial-gradient(70% 45% at 50% 52%, rgba(192,122,76,.2), transparent 70%)' }} />
      <div className="absolute inset-x-0 top-0 h-[44%] opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(244,236,223,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,236,223,1) 1px, transparent 1px)', backgroundSize: '34px 22px', maskImage: 'linear-gradient(to bottom, black, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)' }} />
      {/* wooden counter */}
      <div className="absolute inset-x-0 bottom-0 h-[34%]" style={{ background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 2px, transparent 2px 38px), linear-gradient(180deg, #3a2618, #24170f)', boxShadow: 'inset 0 1px 0 rgba(216,176,106,.25)' }} />

      {/* exit */}
      <button type="button" onClick={() => setLeaving(true)} className="absolute left-3 z-[85] grid h-11 w-11 place-items-center rounded-full text-ivory/60 hover:text-ivory" style={{ top: 'var(--top)' }} aria-label="Leave the kitchen">
        <X className="h-5 w-5" />
      </button>

      {/* title */}
      <div className="absolute inset-x-0 px-8 text-center" style={{ top: 'calc(var(--top) + 46px)' }}>
        <AnimatePresence mode="wait">
          <motion.h2 key={phase} className="display text-[38px] text-ivory" initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease }}>
            {t1} <span className="gold-text italic">{t2}</span>
          </motion.h2>
        </AnimatePresence>
        <div className="mt-1 h-5 text-[13px] text-ivory/55" aria-live="polite">
          {msg ??
            (phase === 'find'
              ? `Tap the ${real.length} that belong in this dish · ${found.length}/${real.length}`
              : phase === 'add'
                ? `Drag each one into the pan · ${added.length}/${real.length}`
                : phase === 'heat'
                  ? 'Slide to find the simmer.'
                  : '')}
        </div>
      </div>

      {/* pan / plate */}
      <div ref={panRef} className="absolute left-1/2 top-[47%] w-[62%] -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait">
          {phase !== 'ready' ? (
            <motion.div
              key="pan"
              exit={{ scale: 0.6, opacity: 0, filter: 'blur(12px)' }}
              transition={{ duration: 0.8 }}
              animate={phase === 'cooking' ? { rotate: [0, -2, 2, -1, 0], y: [0, -3, 0] } : {}}
            >
              <Pan flame={flame} added={added} lively={phase === 'cooking' || (phase === 'heat' && inZone)} glow={phase === 'cooking' ? 1 : phase === 'heat' ? heat / 120 : 0.1} />
            </motion.div>
          ) : (
            <motion.div key="plate" initial={{ scale: 1.3, opacity: 0, filter: 'blur(14px)' }} animate={{ scale: 1.12, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.4, ease }}>
              <DishArt className="w-full" image={dish.image} glow={1} />
            </motion.div>
          )}
        </AnimatePresence>
        {added.length > 0 && phase !== 'ready' && <Steam className="absolute left-[18%] top-[-55%] w-[60%]" intensity={phase === 'cooking' ? 1.2 : 0.3 + added.length * 0.15} />}
        <Ripple trigger={ripple} color="#f4ecdf" />
        {/* cooking progress ring */}
        {phase === 'cooking' && (
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-[-10%] h-[120%] w-[120%] -rotate-90" aria-hidden="true">
            <motion.circle cx="50" cy="50" r="48" fill="none" stroke="#f0d49a" strokeWidth=".8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, ease: 'linear' }} />
          </svg>
        )}
      </div>
      {(phase === 'cooking' || phase === 'ready') && <Particles count={22} color="#f0a050" />}

      {/* STEP 1 — floating ingredients to find */}
      {items.map((it, i) => {
        const s = SPOTS[i % SPOTS.length]
        const isFound = found.includes(it.id)
        const slot = found.indexOf(it.id)
        return (
          <motion.button
            key={it.id}
            type="button"
            onClick={() => pick(it.id)}
            disabled={phase !== 'find' || isFound}
            aria-label={it.label}
            className="absolute z-20 flex w-[76px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            initial={{ left: `${s.x}%`, top: `${s.y}%`, opacity: 0, scale: 0.5 }}
            animate={
              phase !== 'find'
                ? { opacity: 0, scale: 0.5, pointerEvents: 'none' }
                : isFound
                  ? { left: `${20 + slot * 20}%`, top: '91%', scale: 0.7, opacity: 1 }
                  : { left: `${s.x}%`, top: `${s.y}%`, opacity: 1, scale: 1, x: shake === it.id ? [0, -8, 8, -5, 0] : 0 }
            }
            transition={{ type: 'spring', stiffness: 170, damping: 18, delay: phase === 'find' && !isFound && !shake ? i * 0.06 : 0 }}
          >
            <span className={`relative grid h-[62px] w-[62px] place-items-center rounded-full border backdrop-blur-sm ${isFound ? 'border-gold/80 bg-gold/15' : 'border-gold/30 bg-white/[0.05]'}`}>
              <IngredientIcon icon={it.icon} className="h-10 w-10" />
            </span>
            {!isFound && <span className="mt-1.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-ivory/70">{it.label}</span>}
          </motion.button>
        )
      })}

      {/* STEP 2 — tray of found ingredients to drag */}
      <AnimatePresence>
        {phase === 'add' && (
          <motion.div className="absolute inset-x-0 bottom-[6%] z-30 flex justify-around px-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {real.map((r, i) => (
              <DragToken
                key={r.id}
                label={r.label}
                icon={r.icon}
                size={64}
                floatDelay={i}
                hidden={added.includes(r.id)}
                onActivate={() => drop(r.id)}
                onDrop={(x, y) => {
                  if (pointInside(panRef.current, x, y, 12)) return drop(r.id)
                  say('Not here — into the pan.')
                  return false
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3 — heat */}
      <AnimatePresence>
        {phase === 'heat' && (
          <motion.div className="absolute inset-x-0 bottom-[7%] z-30 px-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mb-1 flex h-6 items-center justify-center gap-2 font-serif text-[18px] italic text-ivory/80">
              {inZone && <Flame className="h-4 w-4 text-[#f0a050]" />}
              {heatMsg}
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute top-1/2 h-5 -translate-y-1/2 rounded-full border border-gold/50 bg-gold/10" style={{ left: `calc(15px + ${lo / 100} * (100% - 30px))`, width: `calc(${(hi - lo) / 100} * (100% - 30px))`, opacity: inZone ? 1 : 0.5 }} />
              <input
                type="range"
                min={0}
                max={100}
                value={heat}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Math.floor(v / 10) !== Math.floor(heat / 10)) haptic(4)
                  setHeat(v)
                }}
                aria-label="Cooking heat"
                aria-valuetext={`${heat}% — ${heatMsg}`}
                className="heat-range relative"
              />
            </div>
            <div className="eyebrow flex justify-between text-[9.5px] text-ivory/45">
              <span>Low</span>
              <span>High</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 4 — ready */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.div className="absolute inset-x-0 bottom-[7%] z-30 flex flex-col items-center px-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <p className="mb-5 font-serif text-[18px] italic text-ivory/70">Now taste the real one in front of you.</p>
            <MagneticButton onClick={() => go('quiz')} className="shimmer">
              Take the first bite
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* leave dialog */}
      <AnimatePresence>
        {leaving && (
          <motion.div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/70 px-8 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Leave the kitchen?">
            <motion.div className="w-full rounded-3xl border border-gold/25 bg-[#17120f] p-6 text-center" initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }}>
              <div className="display text-[30px] text-ivory">Leave the kitchen?</div>
              <p className="mt-2 text-[13px] text-ivory/55">You can still take the quiz and collect your savings.</p>
              <div className="mt-5 flex flex-col gap-2.5">
                <MagneticButton onClick={() => setLeaving(false)}>Continue cooking</MagneticButton>
                <MagneticButton variant="ghost" onClick={() => go('quiz')}>
                  Skip to the quiz
                </MagneticButton>
                <button type="button" onClick={() => go('story')} className="eyebrow min-h-11 text-ivory/50">
                  Back to the dish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Top-down pan on the burner. Fills visibly as ingredients go in. */
function Pan({ flame, added, lively, glow }: { flame: number; added: string[]; lively: boolean; glow: number }) {
  const has = (id: string) => added.includes(id)
  const bob = lively ? { y: [0, -1.5, 0, 1.5, 0] } : {}
  return (
    <svg viewBox="-20 -20 340 260" className="w-full overflow-visible" role="img" aria-label={`Pan with ${added.length} ingredients`}>
      <defs>
        <radialGradient id="k-in" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#2c2622" />
          <stop offset="1" stopColor="#0c0a09" />
        </radialGradient>
        <radialGradient id="k-milk" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#fbf0d8" />
          <stop offset="1" stopColor="#dcbf88" />
        </radialGradient>
        <radialGradient id="k-flame" cx="50%" cy="100%" r="100%">
          <stop offset="0" stopColor="#fff2c8" />
          <stop offset=".35" stopColor="#f4a24a" />
          <stop offset=".8" stopColor="#c44a1e" />
          <stop offset="1" stopColor="#c44a1e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="k-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f08a3c" stopOpacity=".75" />
          <stop offset="1" stopColor="#f08a3c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="110" r="150" fill="url(#k-glow)" opacity={glow} />
      <g transform="translate(120 110)">
        {Array.from({ length: 18 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 20}) translate(0 -104)`}>
            <motion.g animate={{ scale: flame }} style={{ originX: 0.5, originY: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
              <path className="flicker" style={{ animationDelay: `${(i % 5) * -0.09}s` }} d="M0 0 C -7 -8, -4 -18, 0 -26 C 4 -18, 7 -8, 0 0 Z" fill="url(#k-flame)" />
            </motion.g>
          </g>
        ))}
      </g>
      <rect x="205" y="98" width="110" height="24" rx="12" fill="#1b1714" stroke="#d8b06a" strokeOpacity=".25" />
      <circle cx="120" cy="110" r="104" fill="#161311" stroke="#d8b06a" strokeOpacity=".3" />
      <circle cx="120" cy="110" r="92" fill="url(#k-in)" />
      <ellipse cx="95" cy="80" rx="34" ry="10" fill="#fff" opacity=".05" transform="rotate(-30 95 80)" />

      <AnimatePresence>
        {has('coconut-milk') && (
          <motion.circle key="milk" cx="120" cy="110" fill="url(#k-milk)" initial={{ r: 10, opacity: 0 }} animate={{ r: 86, opacity: 1 }} transition={{ duration: 1.2, ease }} />
        )}
      </AnimatePresence>
      <motion.g animate={bob} transition={{ duration: 1.2, repeat: Infinity }}>
        {has('carrot') &&
          [[88, 88], [150, 82], [132, 142], [82, 132], [160, 124], [110, 110]].map(([x, y], i) => (
            <motion.g key={`c${i}`} initial={{ y: -60, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: i * 0.05 }}>
              <circle cx={x} cy={y} r="8" fill="#e07b35" />
              <circle cx={x} cy={y} r="4.5" fill="#f09a4d" />
            </motion.g>
          ))}
        {has('curry-leaves') &&
          [[104, 96, -20], [140, 104, 40], [96, 146, 10], [160, 146, -50], [124, 72, 70]].map(([x, y, r], i) => (
            <g key={`l${i}`} transform={`translate(${x} ${y}) rotate(${r})`}>
              <motion.path d="M0 0 C 5 -6, 16 -6, 22 0 C 16 6, 5 6, 0 0 Z" fill="#3b6128" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 12, delay: i * 0.05 }} />
            </g>
          ))}
        {has('chilli') &&
          [[70, 104, 30], [150, 60, -20], [118, 150, 80]].map(([x, y, r], i) => (
            <g key={`h${i}`} transform={`translate(${x} ${y}) rotate(${r})`}>
              <motion.rect x="-10" y="-3" width="20" height="6" rx="3" fill="#5f8a33" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: i * 0.06 }} />
            </g>
          ))}
      </motion.g>
      {added.length === 0 && <circle cx="120" cy="110" r="34" fill="none" stroke="#d8b06a" strokeOpacity=".35" strokeDasharray="4 6" />}
    </svg>
  )
}
