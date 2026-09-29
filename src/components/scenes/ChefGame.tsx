import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DragToken from '../ui/DragToken'
import { Particles, Ripple, Steam } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { pointInside, useAfter } from '../../experience/hooks'
import { sound, haptic } from '../../lib/sound'
import { Flame } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const
type Phase = 'add' | 'placed' | 'heat' | 'sweet'

/** SCENE 05 — a stylised kitchen. Drop the tempering into the pan, then find the right heat. */
export default function ChefGame() {
  const { next } = useExperience()
  const c = dishData.cookingSteps
  const [phase, setPhase] = useState<Phase>('add')
  const [wrong, setWrong] = useState(false)
  const [heat, setHeat] = useState(12)
  const panRef = useRef<HTMLDivElement>(null)
  const holdTimer = useRef<number>(0)
  const inZone = heat >= c.sweetSpot[0] && heat <= c.sweetSpot[1]

  const attempt = (id: string) => {
    if (phase !== 'add') return false
    if (id === c.correctId) {
      setPhase('placed')
      setWrong(false)
      sound.sizzle()
      sound.select()
      haptic([10, 20, 10])
      window.setTimeout(() => setPhase('heat'), 1800)
      return true
    }
    setWrong(true)
    return 'wrong' as const
  }

  // Hold inside the sweet spot briefly to lock it in.
  useEffect(() => {
    if (phase !== 'heat') return
    window.clearTimeout(holdTimer.current)
    if (inZone) {
      holdTimer.current = window.setTimeout(() => {
        setPhase('sweet')
        sound.success()
        haptic([15, 30, 15, 30, 60])
      }, 850)
    }
    return () => window.clearTimeout(holdTimer.current)
  }, [inZone, phase])

  useAfter(phase === 'sweet', 2800, next)

  const flameScale = phase === 'add' ? 0.35 : phase === 'placed' ? 0.6 : 0.3 + (heat / 100) * 1.1
  const heatMsg = heat < c.sweetSpot[0] ? c.tooLow : heat > c.sweetSpot[1] ? c.tooHigh : 'Hold it there…'

  return (
    <div className="absolute inset-0 overflow-clip bg-[#0d0a08]">
      {/* kitchen backdrop: warm window light, tiles, hanging copper */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 50% at 80% 0%, rgba(240,170,90,.22), transparent 70%), radial-gradient(70% 45% at 50% 62%, rgba(192,122,76,.2), transparent 70%)' }} />
      <div
        className="absolute inset-x-0 top-0 h-[46%] opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(rgba(244,236,223,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,236,223,1) 1px, transparent 1px)', backgroundSize: '34px 22px', maskImage: 'linear-gradient(to bottom, black, transparent)' }}
      />
      <HangingPots />
      <div className="absolute inset-x-0 top-[50%] h-px bg-gradient-to-r from-transparent via-copper/30 to-transparent" />

      {/* heading */}
      <div className="absolute inset-x-0 top-[12%] px-8 text-center">
        <AnimatePresence mode="wait">
          {phase === 'add' && (
            <motion.h2 key="h" className="display whitespace-pre-line text-[40px] text-ivory" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.9, ease }}>
              {c.heading.split('\n')[0]}
              {'\n'}
              <span className="gold-text italic">{c.heading.split('\n')[1]}</span>
            </motion.h2>
          )}
          {phase === 'placed' && (
            <motion.h2 key="p" className="display gold-text text-[64px] italic" initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }}>
              Perfect.
            </motion.h2>
          )}
          {phase === 'heat' && (
            <motion.div key="heat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="display text-[38px] text-ivory">
                Now, <span className="gold-text italic">the heat.</span>
              </h2>
              <p className="mt-2 text-[13px] text-ivory/55">Slide to find the simmer.</p>
            </motion.div>
          )}
          {phase === 'sweet' && (
            <motion.div key="sweet" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease }}>
              <motion.div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-copper/20" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <Flame className="h-6 w-6 text-[#f0a050]" aria-hidden="true" />
              </motion.div>
              <h2 className="display text-[40px] text-ivory">
                That's the <span className="gold-text italic">sweet spot.</span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* pan on the flame */}
      <div ref={panRef} className="absolute left-[46%] top-[54%] w-[64%] -translate-x-1/2 -translate-y-1/2">
        <Pan flameScale={flameScale} filled={phase !== 'add'} glow={phase === 'sweet' ? 1 : phase === 'add' ? 0 : 0.35 + heat / 200} />
        {phase !== 'add' && <Steam className="absolute left-[18%] top-[-55%] w-[64%]" intensity={phase === 'heat' ? 0.4 + heat / 100 : 1} />}
        <Ripple trigger={phase === 'placed' ? 1 : phase === 'sweet' ? 2 : 0} color="#f0a050" />
      </div>
      {phase === 'sweet' && <Particles count={20} color="#f0a050" />}

      {/* bottom controls */}
      <div className="absolute inset-x-0 bottom-[7%] px-7">
        <AnimatePresence mode="wait">
          {phase === 'add' && (
            <motion.div key="add" exit={{ opacity: 0, y: 20 }}>
              <p className="mb-4 h-6 text-center" aria-live="polite">
                {wrong ? (
                  <motion.span key="w" className="font-serif text-[19px] italic text-copper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {c.wrongMessage}
                  </motion.span>
                ) : (
                  <span className="eyebrow text-ivory/50">{c.prompt}</span>
                )}
              </p>
              <div className="flex justify-around">
                {c.options.map((o, i) => (
                  <DragToken
                    key={o.id}
                    label={o.label}
                    icon={o.icon}
                    floatDelay={i}
                    onActivate={() => attempt(o.id)}
                    onDrop={(x, y) => (pointInside(panRef.current, x, y, 16) ? attempt(o.id) : false)}
                  />
                ))}
              </div>
            </motion.div>
          )}
          {(phase === 'heat' || phase === 'sweet') && (
            <motion.div key="slider" initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase === 'sweet' ? 0.4 : 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-1 h-6 text-center font-serif text-[18px] italic text-ivory/75" aria-live="polite">
                {phase === 'heat' ? heatMsg : c.sweetMessage}
              </div>
              <div className="relative">
                {/* sweet-spot band */}
                <div
                  className="pointer-events-none absolute top-1/2 h-5 -translate-y-1/2 rounded-full border border-gold/40 bg-gold/10"
                  style={{ left: `${c.sweetSpot[0]}%`, width: `${c.sweetSpot[1] - c.sweetSpot[0]}%`, opacity: inZone ? 1 : 0.45 }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={heat}
                  disabled={phase === 'sweet'}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    if (Math.floor(v / 10) !== Math.floor(heat / 10)) haptic(4)
                    setHeat(v)
                  }}
                  aria-label="Cooking heat"
                  aria-valuetext={`${heat} percent — ${heatMsg}`}
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
      </div>
    </div>
  )
}

function Pan({ flameScale, filled, glow }: { flameScale: number; filled: boolean; glow: number }) {
  return (
    <svg viewBox="-20 -20 340 260" className="w-full overflow-visible" role="img" aria-label={filled ? 'A pan of stew simmering on the flame' : 'An empty pan on the stove'}>
      <defs>
        <radialGradient id="pan-in" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#2c2622" />
          <stop offset="1" stopColor="#0c0a09" />
        </radialGradient>
        <radialGradient id="pan-stew" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#fbf0d8" />
          <stop offset="1" stopColor="#dcbf88" />
        </radialGradient>
        <radialGradient id="flame-g" cx="50%" cy="100%" r="100%">
          <stop offset="0" stopColor="#fff2c8" />
          <stop offset=".35" stopColor="#f4a24a" />
          <stop offset=".8" stopColor="#c44a1e" />
          <stop offset="1" stopColor="#c44a1e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heat-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f08a3c" stopOpacity=".7" />
          <stop offset="1" stopColor="#f08a3c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="110" r="150" fill="url(#heat-glow)" opacity={glow} />
      {/* flames peeking around the rim */}
      <g transform="translate(120 110)">
        {Array.from({ length: 18 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 20}) translate(0 -${104})`}>
            <motion.g animate={{ scale: flameScale }} style={{ originX: 0.5, originY: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
              <path className="flicker" style={{ animationDelay: `${(i % 5) * -0.09}s` }} d="M0 0 C -7 -8, -4 -18, 0 -26 C 4 -18, 7 -8, 0 0 Z" fill="url(#flame-g)" />
            </motion.g>
          </g>
        ))}
      </g>
      {/* handle */}
      <rect x="205" y="98" width="110" height="24" rx="12" fill="#1b1714" stroke="#d8b06a" strokeOpacity=".25" />
      <circle cx="298" cy="110" r="5" fill="#0b0908" />
      {/* pan */}
      <circle cx="120" cy="110" r="104" fill="#161311" stroke="#d8b06a" strokeOpacity=".3" />
      <circle cx="120" cy="110" r="92" fill="url(#pan-in)" />
      <AnimatePresence>
        {filled && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }} style={{ transformOrigin: '120px 110px' }}>
            <circle cx="120" cy="110" r="86" fill="url(#pan-stew)" />
            {[
              [90, 90], [150, 80], [130, 140], [80, 130], [160, 125],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="6" fill="#e07b35" opacity=".9" />
            ))}
            {[
              [110, 105, -20], [140, 105, 40], [100, 150, 10], [165, 150, -50],
            ].map(([x, y, r], i) => (
              <path key={i} d="M0 0 C 5 -6, 16 -6, 22 0 C 16 6, 5 6, 0 0 Z" fill="#3b6128" transform={`translate(${x} ${y}) rotate(${r})`} />
            ))}
            <ellipse cx="95" cy="80" rx="30" ry="10" fill="#fff" opacity=".2" transform="rotate(-30 95 80)" />
          </motion.g>
        )}
      </AnimatePresence>
      {!filled && (
        <g opacity=".35">
          <IngredientHint />
        </g>
      )}
    </svg>
  )
}

function IngredientHint() {
  return <circle cx="120" cy="110" r="34" fill="none" stroke="#d8b06a" strokeDasharray="4 6" />
}

function HangingPots() {
  return (
    <svg viewBox="0 0 390 120" className="absolute inset-x-0 top-0 w-full opacity-60" aria-hidden="true">
      <path d="M20 22 H370" stroke="#8b5a35" strokeWidth="2" />
      {[
        [70, 70, 22], [150, 90, 16], [250, 78, 26], [320, 60, 14],
      ].map(([x, len, r], i) => (
        <g key={i}>
          <line x1={x} y1="22" x2={x} y2={len} stroke="#6b4428" strokeWidth="1.5" />
          <circle cx={x} cy={len + r} r={r} fill="none" stroke="#c07a4c" strokeWidth="2" opacity=".7" />
          <circle cx={x} cy={len + r} r={r - 4} fill="#1a1411" />
          <path d={`M${x - r * 0.5} ${len + r - r * 0.4} a ${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.6} ${-r * 0.3}`} stroke="#f0c090" strokeWidth="1.5" fill="none" opacity=".6" />
        </g>
      ))}
    </svg>
  )
}
