import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Star } from 'lucide-react'
import { MagneticButton, Particles } from '../ui/Effects'
import { restaurant, reviewSettings, rewardRules } from '../data/restaurant'
import { useStore } from '../state/store'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const
const LABELS = ['', 'Not for me', 'It was okay', 'Good', 'Really good', 'Unforgettable']
const BONUS = rewardRules.find((r) => r.id === 'review')!.percent

/**
 * In-app review. The bonus is earned for submitting a review here, whatever the rating.
 * Google is offered as an optional extra and is never required for the discount
 * (Google's policy prohibits incentivised reviews).
 */
export default function ReviewScreen() {
  const { go, setReward, dishId } = useStore()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [step, setStep] = useState<'rate' | 'more' | 'write' | 'thanks'>('rate')
  const [text, setText] = useState('')
  const shown = hover || rating

  const rate = (n: number) => {
    setRating(n)
    sound.select()
    haptic(n * 4)
    window.setTimeout(() => setStep((s) => (s === 'rate' ? 'more' : s)), 800)
  }

  const submit = () => {
    try {
      const k = 'kokum.reviews'
      const list = JSON.parse(localStorage.getItem(k) ?? '[]')
      list.push({ dishId, rating, comment: text.trim(), at: new Date().toISOString() })
      localStorage.setItem(k, JSON.stringify(list)) // prototype: stays on this device
    } catch {
      /* storage unavailable */
    }
    setReward('review', 'earned')
    sound.reward()
    setStep('thanks')
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 40% at 50% 30%, rgba(216,176,106,.14), transparent 70%)' }} />
      {step === 'thanks' && <Particles count={18} />}

      <div className="relative flex h-full flex-col items-center px-6 pb-7 text-center" style={{ paddingTop: 'calc(var(--top) + 56px)' }}>
        {step !== 'thanks' ? (
          <>
            <h2 className="display text-[38px] text-ivory">
              How was your
              <br />
              <span className="gold-text italic">Kokum experience?</span>
            </h2>
            <p className="mt-2 text-[13px] text-ivory/55">Leave a quick review for +{BONUS}% off — any rating counts.</p>
            <div className={`flex gap-1 transition-all duration-700 ${step === 'write' ? 'mt-3 scale-75' : 'mt-8'}`} role="radiogroup" aria-label="Rating" onPointerLeave={() => setHover(0)}>
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
                  <Star className="h-11 w-11" strokeWidth={1.2} style={{ color: n <= shown ? '#e9c27a' : 'rgba(244,236,223,.3)', fill: n <= shown ? '#d8b06a' : 'transparent', filter: n <= shown ? 'drop-shadow(0 0 12px rgba(216,176,106,.6))' : 'none' }} />
                </motion.button>
              ))}
            </div>
            <div className="mt-2 h-6 font-serif text-[19px] italic text-gold/90" aria-live="polite">
              {LABELS[shown]}
            </div>
          </>
        ) : (
          <motion.div className="mt-[20%]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }}>
            <h2 className="display text-[48px] text-ivory">
              Thank <span className="gold-text italic">you.</span>
            </h2>
            <div className="display gold-text mt-3 text-[40px] italic">+{BONUS}% off</div>
            <p className="mt-2 text-[13px] text-ivory/55">Your review goes straight to the Kokum team.</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'more' && (
            <motion.div key="more" className="mt-auto w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="font-serif text-[21px] italic text-ivory/80">Want to tell us more?</p>
              <div className="mt-4 flex gap-3">
                <MagneticButton variant="ghost" className="flex-1" onClick={submit}>
                  Just the stars
                </MagneticButton>
                <MagneticButton className="flex-1" onClick={() => setStep('write')}>
                  Write a review
                </MagneticButton>
              </div>
              <button type="button" onClick={() => go('reward')} className="eyebrow mt-3 min-h-11 text-[10px] text-ivory/40">
                Skip (no review bonus)
              </button>
            </motion.div>
          )}
          {step === 'write' && (
            <motion.div key="write" className="mt-3 flex w-full flex-1 flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <label htmlFor="review" className="sr-only">
                Your review
              </label>
              <div className="relative flex-1 rounded-2xl border border-gold/25 bg-white/[0.03] p-4 focus-within:border-gold/60">
                <textarea
                  id="review"
                  value={text}
                  maxLength={reviewSettings.maxLength}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={reviewSettings.placeholder}
                  className="h-full min-h-[120px] w-full resize-none bg-transparent font-serif text-[18px] leading-snug text-ivory placeholder:italic placeholder:text-ivory/35 focus:outline-none"
                />
                <div className="absolute bottom-3 right-4 text-[11px] tabular-nums text-ivory/40">
                  {text.length} / {reviewSettings.maxLength}
                </div>
              </div>
              <MagneticButton className="mt-4 w-full" onClick={submit} disabled={!text.trim()} style={{ opacity: text.trim() ? 1 : 0.45 }}>
                Submit review
              </MagneticButton>
            </motion.div>
          )}
          {step === 'thanks' && (
            <motion.div key="thanks" className="mt-auto flex w-full flex-col gap-2.5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              {restaurant.googleReviewUrl && rating >= 1 && (
                <a href={restaurant.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="eyebrow flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 text-[10.5px] text-ivory/75">
                  Also post on Google (optional) <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <MagneticButton className="shimmer w-full" onClick={() => go('reward')}>
                See my reward
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
