import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { prototypeRewardService } from '../../lib/reward'
import { sound, haptic } from '../../lib/sound'
import { FlaskConical, Plus } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const
const HEART = 'M50 88 C 20 66, 4 48, 4 30 C 4 16, 15 6, 28 6 C 38 6, 45 12, 50 20 C 55 12, 62 6, 72 6 C 85 6, 96 16, 96 30 C 96 48, 80 66, 50 88 Z'

/**
 * SCENE 11 — 10 HEARTS.
 * Production: hearts come from verified opens/likes on the guest's signed share link.
 * Prototype: a clearly-labelled DEMO control adds hearts. Nothing here claims to be real social data.
 */
export default function HeartChallenge() {
  const { hearts, setHearts, setReward, go } = useExperience()
  const goal = dishData.rewardSettings.heartsGoal
  const [bursts, setBursts] = useState<number[]>([])
  const [unlocked, setUnlocked] = useState(hearts >= goal)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const pct = Math.min(1, hearts / goal)

  const addHeart = () => {
    if (hearts >= goal) return
    const n = hearts + 1
    setHearts(n)
    setBursts((b) => [...b.slice(-6), Date.now()])
    sound.heart()
    haptic(10)
    if (n >= goal) window.setTimeout(unlock, 700)
  }

  const unlock = async () => {
    setUnlocked(true)
    sound.reward()
    haptic([30, 60, 30, 60, 120])
    const r = await prototypeRewardService.issue(dishData.rewardSettings)
    setReward(r)
  }

  // premium confetti burst inside the phone frame
  useEffect(() => {
    if (!unlocked || reduce || !canvasRef.current) return
    const fire = confetti.create(canvasRef.current, { resize: true })
    const colors = ['#d8b06a', '#f0d49a', '#c07a4c', '#f4ecdf', '#8a2748']
    const t = window.setTimeout(() => {
      fire({ particleCount: 90, spread: 80, startVelocity: 42, origin: { y: 0.55 }, colors, scalar: 0.9, ticks: 220 })
      fire({ particleCount: 40, spread: 120, startVelocity: 28, origin: { y: 0.5 }, colors, shapes: ['circle'], scalar: 0.6 })
    }, 900)
    return () => {
      clearTimeout(t)
      fire.reset()
    }
  }, [unlocked, reduce])

  useEffect(() => {
    if (!unlocked) return
    const t = window.setTimeout(() => go('reward'), 5200)
    return () => clearTimeout(t)
  }, [unlocked, go])

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(70% 45% at 50% 45%, rgba(138,39,72,.35), transparent 70%)' }}
        animate={{ opacity: 0.4 + pct * 0.6 }}
      />

      <AnimatePresence>
        {!unlocked && (
          <motion.div className="relative flex h-full flex-col items-center px-7 pb-[28px] pt-[84px] text-center" exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.6 }}>
            <motion.h2 className="display text-[64px] text-ivory" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }}>
              10 <span className="gold-text italic">hearts.</span>
            </motion.h2>
            <motion.p className="mt-2 max-w-[270px] text-[14px] leading-relaxed text-ivory/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Get {goal} people to like your Kokum Story and unlock a reward on your bill.
            </motion.p>

            {/* the heart — fills like liquid as hearts arrive */}
            <div className="relative mt-6 aspect-square w-[62%]">
              <motion.svg viewBox="0 0 100 94" className="h-full w-full overflow-visible" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}>
                <defs>
                  <clipPath id="heart-clip">
                    <path d={HEART} />
                  </clipPath>
                  <linearGradient id="heart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#e56b8f" />
                    <stop offset="1" stopColor="#7a1f3d" />
                  </linearGradient>
                </defs>
                <path d={HEART} fill="rgba(138,39,72,.12)" stroke="#e56b8f" strokeOpacity=".6" strokeWidth=".8" />
                <g clipPath="url(#heart-clip)">
                  <motion.g animate={{ y: 94 - pct * 90 }} transition={{ type: 'spring', stiffness: 80, damping: 14 }}>
                    <motion.path
                      d="M-50 4 Q -37.5 0 -25 4 T 0 4 T 25 4 T 50 4 T 75 4 T 100 4 T 125 4 T 150 4 V 120 H -50 Z"
                      fill="url(#heart-fill)"
                      animate={{ x: [0, 50] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.g>
                </g>
                <path d="M22 18 C 16 20, 12 26, 12 32" stroke="#fff" strokeOpacity=".4" strokeWidth="2" fill="none" strokeLinecap="round" />
              </motion.svg>
              {/* heart particles */}
              {bursts.map((b) => (
                <HeartBurst key={b} />
              ))}
            </div>

            <div className="mt-4 flex items-baseline gap-2" aria-live="polite">
              <motion.span key={hearts} className="display text-[54px] text-ivory" initial={{ scale: 1.4, color: '#e56b8f' }} animate={{ scale: 1, color: '#f4ecdf' }}>
                {hearts}
              </motion.span>
              <span className="font-serif text-[26px] text-ivory/40">/ {goal}</span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {Array.from({ length: goal }).map((_, i) => (
                <motion.span key={i} className="h-1.5 w-4 rounded-full" animate={{ backgroundColor: i < hearts ? '#e56b8f' : 'rgba(244,236,223,.15)' }} />
              ))}
            </div>

            {/* DEMO control — clearly not real */}
            <div className="mt-auto w-full rounded-2xl border border-dashed border-gold/40 bg-gold/[0.05] p-3">
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                <span className="eyebrow text-[9px] text-gold">Demo mode</span>
              </div>
              <motion.button
                type="button"
                onClick={addHeart}
                whileTap={{ scale: 0.94 }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-kokum text-[12px] font-bold uppercase tracking-[0.2em] text-ivory shadow-[0_10px_30px_-10px_rgba(138,39,72,.9)]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> 1 heart
              </motion.button>
              <p className="mt-2 text-[10px] leading-snug text-ivory/45">Simulated for this demo. In production, hearts come from friends opening your shared story.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* unlock moment */}
      <AnimatePresence>
        {unlocked && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.svg
              viewBox="0 0 100 94"
              className="absolute w-[40%]"
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: [0.6, 1, 14], opacity: [1, 1, 0] }}
              transition={{ duration: 1.8, times: [0, 0.35, 1], ease: [0.7, 0, 0.3, 1] }}
            >
              <path d={HEART} fill="#b8456a" />
            </motion.svg>
            <motion.div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(60% 40% at 50% 50%, rgba(216,176,106,.3), transparent 70%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
            />
            <motion.div className="eyebrow relative text-gold" initial={{ opacity: 0, letterSpacing: '0.8em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ delay: 1.4, duration: 1.2 }}>
              You unlocked it.
            </motion.div>
            <motion.div className="display gold-text relative mt-3 text-[110px] italic leading-none" initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ delay: 1.7, duration: 1.2, ease }}>
              {dishData.rewardSettings.percentOff}%
            </motion.div>
            <motion.div className="display relative text-[40px] text-ivory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.9 }}>
              off
            </motion.div>
            <motion.button type="button" onClick={() => go('reward')} className="eyebrow relative mt-10 min-h-11 px-4 text-ivory/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              Claim it
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-40 h-full w-full" aria-hidden="true" />
    </div>
  )
}

function HeartBurst() {
  const parts = Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * Math.PI * 2 + Math.random() * 0.5, d: 60 + Math.random() * 60, s: 0.5 + Math.random() * 0.6 }))
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {parts.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 100 94"
          className="absolute -ml-2.5 -mt-2.5 h-5 w-5"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: Math.cos(p.a) * p.d, y: Math.sin(p.a) * p.d - 40, scale: p.s, opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <path d={HEART} fill="#e56b8f" />
        </motion.svg>
      ))}
    </div>
  )
}
