import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { dishData } from '../data/dishData'
import { DragToken } from './DragToken'
import { Screen } from './Screen'
import { StoryImage } from './StoryImage'

type SecretIngredientProps = {
  onComplete: () => void
}

export function SecretIngredient({ onComplete }: SecretIngredientProps) {
  const reduce = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'miss' | 'hit'>('idle')

  useEffect(() => {
    if (status !== 'hit') return
    const timer = window.setTimeout(onComplete, reduce ? 250 : 1400)
    return () => window.clearTimeout(timer)
  }, [status, onComplete, reduce])

  return (
    <Screen className="bg-charcoal">
      <div className="flex h-full flex-col px-6 pt-16 pb-8">
        <p className="font-serif text-lg text-ivory-muted italic">
          {dishData.secretLead}
        </p>
        <h2 className="mt-3 font-serif text-5xl tracking-tight text-ivory">
          {dishData.secretTitle}
        </h2>
        <p className="mt-3 text-[11px] tracking-[0.2em] text-ivory-muted uppercase">
          Drag the secret onto the dish
        </p>

        <div
          id="secret-dish"
          data-drop="secret-dish"
          className="relative mx-auto mt-8 h-40 w-40 overflow-hidden rounded-full ring-1 ring-copper/40"
        >
          <StoryImage
            src={dishData.heroImage}
            alt={dishData.heroImageAlt}
            className="h-full w-full"
          />
          {status === 'hit' ? (
            <motion.div
              className="absolute inset-0 bg-copper/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.3] }}
            />
          ) : null}
        </div>

        <div className="mt-10 flex justify-center gap-6">
          {dishData.secretIngredient.options.map((option) => (
            <DragToken
              key={option.id}
              ariaLabel={`Drag ${option.name}`}
              dropSelector="[data-drop='secret-dish']"
              disabled={status === 'hit'}
              onHit={() => {
                if (option.correct) setStatus('hit')
                else setStatus('miss')
              }}
              onMiss={() => setStatus('miss')}
            >
              <motion.span
                animate={status === 'miss' && !option.correct ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
                className="flex w-20 flex-col items-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-soft text-2xl ring-1 ring-copper/30">
                  {option.symbol}
                </span>
                <span className="mt-2 text-[10px] tracking-[0.16em] text-ivory-muted uppercase">
                  {option.name}
                </span>
              </motion.span>
            </DragToken>
          ))}
        </div>

        <p className="mt-auto pb-4 text-center font-serif text-xl text-ivory italic">
          {status === 'hit'
            ? dishData.secretSuccess
            : status === 'miss'
              ? dishData.secretFail
              : ' '}
        </p>
      </div>
    </Screen>
  )
}
