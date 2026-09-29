import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MagneticButton, Particles } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { useAfter } from '../../experience/hooks'
import { feedbackService } from '../../lib/services'
import { sound, haptic } from '../../lib/sound'
import { Star } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const
type Step = 'rate' | 'more' | 'write' | 'thanks'
const LABELS = ['', 'Not for me', 'It was okay', 'Good', 'Really good', 'Unforgettable']

/**
 * SCENE 13 — in-app feedback. Never forced, never gated on rating, never redirects
 * to a public review site. (Production: route to the owner's feedback dashboard.)
 */
export default function Feedback() {
  const { go } = useExperience()
  const rs = dishData.reviewSettings
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [step, setStep] = useState<Step>('rate')
  const [text, setText] = useState('')
  const shown = hover || rating

  const rate = (n: number) => {
    setRating(n)
    sound.select()
    haptic(n * 4)
    window.setTimeout(() => setStep((s) => (s === 'rate' ? 'more' : s)), 900)
  }

  const submit = async () => {
    await feedbackService.submit({ dishId: dishData.id, rating, comment: text.trim() || undefined, createdAt: new Date().toISOString() })
    sound.success()
    setStep('thanks')
  }

  useAfter(step === 'thanks', 2600, () => go('explore'))

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 40% at 50% 35%, rgba(216,176,106,.14), transparent 70%)' }} />
      {step === 'thanks' && <Particles count={18} />}

      <div className="relative flex h-full flex-col items-center px-7 pb-[28px] pt-[84px] text-center">
        <AnimatePresence mode="wait">
          {step !== 'thanks' ? (
            <motion.h2 key="h" className="display whitespace-pre-line text-[40px] text-ivory" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }}>
              {rs.heading.split('\n')[0]}
              {'\n'}
              <span className="gold-text italic">{rs.heading.split('\n')[1]}</span>
            </motion.h2>
          ) : (
            <motion.h2 key="t" className="display mt-[30%] text-[46px] text-ivory" initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1, ease }}>
              Thank you
              <br />
              <span className="gold-text italic">for sharing.</span>
            </motion.h2>
          )}
        </AnimatePresence>

        {step !== 'thanks' && (
          <>
            {/* stars */}
            <div className={`flex gap-1.5 transition-all duration-700 ${step === 'write' ? 'mt-5 scale-75' : 'mt-10'}`} role="radiogroup" aria-label="Rate your experience, 1 to 5 stars" onPointerLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(n)}
                  onClick={() => rate(n)}
                  whileTap={{ scale: 0.8 }}
                  animate={n <= rating ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] } : { scale: 1 }}
                  transition={{ delay: n <= rating ? (n - 1) * 0.07 : 0, duration: 0.45 }}
                  className="grid h-[58px] w-[54px] place-items-center"
                >
                  <Star
                    className="h-11 w-11 transition-colors duration-300"
                    strokeWidth={1.2}
                    style={{ color: n <= shown ? '#e9c27a' : 'rgba(244,236,223,.3)', fill: n <= shown ? '#d8b06a' : 'transparent', filter: n <= shown ? 'drop-shadow(0 0 12px rgba(216,176,106,.6))' : 'none' }}
                  />
                </motion.button>
              ))}
            </div>
            <div className="mt-3 h-6 font-serif text-[19px] italic text-gold/90" aria-live="polite">
              {LABELS[shown]}
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {step === 'more' && (
            <motion.div key="more" className="mt-auto flex w-full flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.7, ease }}>
              <p className="font-serif text-[22px] italic text-ivory/80">Want to tell us more?</p>
              <div className="mt-5 flex w-full gap-3">
                <MagneticButton variant="ghost" className="flex-1" onClick={() => go('explore')}>
                  Skip
                </MagneticButton>
                <MagneticButton className="flex-1" onClick={() => setStep('write')}>
                  Write a review
                </MagneticButton>
              </div>
            </motion.div>
          )}
          {step === 'write' && (
            <motion.div key="write" className="mt-4 flex w-full flex-1 flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }}>
              <label htmlFor="review" className="sr-only">
                Your review
              </label>
              <div className="relative flex-1 rounded-2xl border border-gold/25 bg-white/[0.03] p-4 backdrop-blur focus-within:border-gold/60">
                <textarea
                  id="review"
                  value={text}
                  maxLength={rs.maxLength}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={rs.placeholder}
                  className="h-full min-h-[140px] w-full resize-none bg-transparent font-serif text-[19px] leading-snug text-ivory placeholder:italic placeholder:text-ivory/35 focus:outline-none"
                  autoFocus
                />
                <div className="absolute bottom-3 right-4 text-[11px] tabular-nums text-ivory/40">
                  {text.length} / {rs.maxLength}
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <MagneticButton variant="quiet" onClick={() => go('explore')}>
                  Skip
                </MagneticButton>
                <MagneticButton className="flex-1" onClick={submit} disabled={text.trim().length === 0} style={{ opacity: text.trim() ? 1 : 0.4 }}>
                  Submit
                </MagneticButton>
              </div>
              <p className="mt-3 text-[10px] text-ivory/40">Shared privately with the Kokum team. Prototype: stored on this device only.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
