import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { dishData } from '../data/dishData'
import { Dust, Steam } from './Atmosphere'
import { Screen } from './Screen'
import { StoryImage } from './StoryImage'

type DishRevealProps = {
  onComplete: () => void
}

export function DishReveal({ onComplete }: DishRevealProps) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(reduce ? 1 : 0)
  const [done, setDone] = useState(reduce === true)
  const progressRef = useRef(reduce ? 1 : 0)
  const lastX = useRef<number | null>(null)
  const finished = useRef(false)

  useEffect(() => {
    if (!reduce || finished.current) return
    finished.current = true
    setProgress(1)
    setDone(true)
    const timer = window.setTimeout(onComplete, 200)
    return () => window.clearTimeout(timer)
  }, [reduce, onComplete])

  function finish() {
    if (finished.current) return
    finished.current = true
    progressRef.current = 1
    setProgress(1)
    setDone(true)
    window.setTimeout(onComplete, reduce ? 200 : 1300)
  }

  function addProgress(amount: number) {
    if (done || finished.current) return
    const nextValue = Math.min(1, progressRef.current + amount)
    progressRef.current = nextValue
    setProgress(nextValue)
    if (nextValue >= 0.92) finish()
  }

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (done) return
    if (lastX.current == null) {
      lastX.current = event.clientX
      return
    }
    const delta = Math.abs(event.clientX - lastX.current) + Math.abs(event.movementY)
    lastX.current = event.clientX
    addProgress(delta / 420)
  }

  return (
    <Screen className="bg-charcoal">
      <div
          className="absolute inset-0 cursor-ew-resize touch-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          lastX.current = event.clientX
        }}
        onPointerMove={move}
        onPointerUp={() => {
          lastX.current = null
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            addProgress(0.2)
          }
        }}
      >
        <StoryImage
          src={dishData.heroImage}
          alt={dishData.heroImageAlt}
          loading="eager"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal via-transparent to-charcoal/20" />
        <Steam active={done} />
        {done ? <Dust /> : null}

        <motion.div
          className="absolute inset-0 bg-[#1a1610]"
          style={{
            clipPath: `inset(0 0 0 ${progress * 100}%)`,
          }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-linear-to-br from-copper/20 via-charcoal to-charcoal" />
          <div className="absolute inset-y-0 left-0 w-px bg-copper/40" style={{ left: `${progress * 100}%` }} />
        </motion.div>
      </div>

      <div className="pointer-events-none relative z-10 mt-auto px-6 pb-16">
        {!done ? (
          <>
            <p className="font-serif text-[40px] leading-[0.92] text-ivory">
              {dishData.revealPrompt.split('\n').map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-4 text-[11px] tracking-[0.28em] text-copper uppercase">
              {dishData.revealHint}
            </p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] tracking-[0.34em] text-copper uppercase">
              {dishData.storyLabel}
            </p>
            <h1 className="mt-3 font-serif text-[46px] leading-[0.9] text-ivory">
              {dishData.nameLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </motion.div>
        )}
      </div>
    </Screen>
  )
}
