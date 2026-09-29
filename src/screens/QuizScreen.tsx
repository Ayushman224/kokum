import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import DishArt from '../ui/DishArt'
import IngredientIcon from '../ui/IngredientIcon'
import { MagneticButton, Particles } from '../ui/Effects'
import { firstBiteQuiz as Q, menu, rewardRules } from '../data/restaurant'
import { useStore } from '../state/store'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const
const BONUS = rewardRules.find((r) => r.id === 'quiz')!.percent

/** First-bite quiz: two chances to name the first flavour. Correct → +2%. */
export default function QuizScreen() {
  const { go, dishId, setReward } = useStore()
  const dish = menu.find((d) => d.id === dishId)!
  const [tries, setTries] = useState<string[]>([])
  const [result, setResult] = useState<'won' | 'lost' | null>(null)
  const [shake, setShake] = useState<string | null>(null)
  const left = Q.attempts - tries.length

  const answer = (id: string) => {
    if (result || tries.includes(id)) return
    if (id === Q.correctId) {
      setResult('won')
      setReward('quiz', 'earned')
      sound.reward()
      haptic([20, 40, 20, 40, 80])
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.55 }, colors: ['#d8b06a', '#f0d49a', '#c07a4c', '#f4ecdf'], scalar: 0.9, disableForReducedMotion: true })
      return
    }
    sound.wrong()
    haptic([20, 40, 20])
    setShake(id)
    window.setTimeout(() => setShake(null), 450)
    const next = [...tries, id]
    setTries(next)
    if (next.length >= Q.attempts) setResult('lost')
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 40% at 50% 30%, rgba(216,176,106,.18), transparent 70%)' }} />
      {result === 'won' && <Particles count={24} />}

      <div className="relative flex h-full flex-col items-center px-6 text-center" style={{ paddingTop: 'calc(var(--top) + 52px)' }}>
        <motion.div className="relative w-[40%]" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: result === 'won' ? 1.08 : 1, opacity: 1 }} transition={{ duration: 1, ease }}>
          <DishArt className="w-full" image={dish.image} glow={result === 'won' ? 1 : 0.3} />
        </motion.div>
        <div className="eyebrow mt-4 text-gold">Your first bite</div>
        <h2 className="display mt-2 text-[38px] text-ivory">
          What will you
          <br />
          <span className="gold-text italic">taste first?</span>
        </h2>
        <p className="mt-2 text-[13px] text-ivory/55">Take a bite of the real dish. Guess right for +{BONUS}% off.</p>

        <div className="mt-6 grid w-full grid-cols-3 gap-2.5">
          {Q.options.map((o) => {
            const wrong = tries.includes(o.id)
            const isAnswer = result && o.id === Q.correctId
            return (
              <motion.button
                key={o.id}
                type="button"
                onClick={() => answer(o.id)}
                disabled={!!result || wrong}
                className={`flex aspect-[4/5] flex-col items-center justify-center rounded-3xl border ${isAnswer ? 'border-gold bg-gold/15 shadow-[0_0_30px_rgba(216,176,106,.4)]' : wrong ? 'border-white/10 opacity-35' : 'border-gold/30 bg-white/[0.03]'}`}
                animate={{ x: shake === o.id ? [0, -8, 8, -5, 0] : 0, scale: isAnswer ? 1.05 : 1 }}
                whileTap={{ scale: 0.94 }}
                aria-label={o.label}
              >
                <IngredientIcon icon={o.icon} className="h-14 w-14" />
                <span className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ivory/85">{o.label}</span>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-5 min-h-[92px]" aria-live="polite">
          <AnimatePresence mode="wait">
            {result === 'won' ? (
              <motion.div key="won" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <div className="eyebrow text-gold">You got it</div>
                <div className="display gold-text mt-1 text-[48px] italic">+{BONUS}% off</div>
              </motion.div>
            ) : result === 'lost' ? (
              <motion.div key="lost" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="font-serif text-[20px] italic text-ivory/85">Interesting choice.</div>
                <p className="mx-auto mt-1 max-w-[290px] text-[13px] leading-snug text-ivory/55">{Q.explanation}</p>
              </motion.div>
            ) : tries.length > 0 ? (
              <motion.div key="retry" className="font-serif text-[19px] italic text-copper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Not quite — {left} more {left === 1 ? 'try' : 'tries'}.
              </motion.div>
            ) : (
              <motion.div key="chances" className="eyebrow text-[10px] text-ivory/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {Q.attempts} chances
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div className="mt-auto mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, ease }}>
              <MagneticButton onClick={() => go('studio')} className="shimmer">
                Make my story card
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
