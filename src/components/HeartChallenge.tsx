import confetti from 'canvas-confetti'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { dishData } from '../data/dishData'
import { Screen } from './Screen'

type HeartChallengeProps = {
  hearts: number
  onDemoHeart: () => void
  onComplete: () => void
}

export function HeartChallenge({ hearts, onDemoHeart, onComplete }: HeartChallengeProps) {
  const reduce = useReducedMotion()
  const target = dishData.heartTarget
  const unlocked = hearts >= target
  const fired = useRef(false)

  useEffect(() => {
    if (!unlocked || fired.current) return
    fired.current = true
    if (!reduce) {
      void confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#c8a56a', '#f4ede1', '#a8844a', '#7a1e2c'],
      })
    }
    const timer = window.setTimeout(onComplete, reduce ? 400 : 1800)
    return () => window.clearTimeout(timer)
  }, [unlocked, onComplete, reduce])

  return (
    <Screen className="bg-charcoal">
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="text-[10px] tracking-[0.34em] text-copper uppercase">
          {dishData.heartHeading}
        </p>
        <motion.div
          className="mt-8 text-8xl"
          animate={!reduce && unlocked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          aria-hidden
        >
          ❤️
        </motion.div>
        <p className="mt-6 font-serif text-lg text-ivory-muted italic">
          “{dishData.heartPrompt}”
        </p>
        <p className="mt-8 font-serif text-4xl text-ivory">
          {Math.min(hearts, target)} / {target}
        </p>
        <p className="mt-3 text-[10px] tracking-wide text-ivory-muted">
          {dishData.heartDisclaimer}
        </p>

        {unlocked ? (
          <p className="mt-10 font-serif text-3xl text-ivory">{dishData.heartUnlock}</p>
        ) : (
          <button
            type="button"
            onClick={onDemoHeart}
            className="mt-12 text-[10px] tracking-[0.24em] text-ivory-muted uppercase"
          >
            Demo mode · +1 heart
          </button>
        )}
      </div>
    </Screen>
  )
}
