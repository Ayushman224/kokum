import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { dishData } from '../data/dishData'
import { Screen } from './Screen'
import { StoryImage } from './StoryImage'

type IngredientHuntProps = {
  found: string[]
  onFind: (id: string) => void
  onComplete: () => void
}

const ORBIT = [
  { x: 0, y: -118 },
  { x: 108, y: -28 },
  { x: 72, y: 104 },
  { x: -72, y: 104 },
  { x: -108, y: -28 },
]

export function IngredientHunt({ found, onFind, onComplete }: IngredientHuntProps) {
  const reduce = useReducedMotion()
  const need = dishData.huntNeed
  const complete = found.length >= need

  useEffect(() => {
    if (!complete) return
    const timer = window.setTimeout(onComplete, reduce ? 250 : 1300)
    return () => window.clearTimeout(timer)
  }, [complete, onComplete, reduce])

  return (
    <Screen className="bg-charcoal">
      <div className="flex h-full flex-col px-6 pt-16 pb-10">
        <p className="font-serif text-lg text-ivory-muted italic">
          {dishData.huntPrompt}
        </p>
        <p className="mt-2 text-[11px] tracking-[0.22em] text-copper uppercase">
          {complete ? dishData.huntDone : dishData.huntHint}
        </p>
        <p className="mt-5 font-serif text-3xl text-ivory">
          {Math.min(found.length, need)} / {need} FOUND
        </p>

        <div className="relative mx-auto mt-8 h-[320px] w-[320px] max-w-full">
          <div className="absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-1 ring-copper/35">
            <StoryImage
              src={dishData.heroImage}
              alt={dishData.heroImageAlt}
              className="h-full w-full"
            />
          </div>

          {dishData.ingredients.map((ingredient, index) => {
            const pos = ORBIT[index] ?? { x: 0, y: 0 }
            const isFound = found.includes(ingredient.id)
            return (
              <div
                key={ingredient.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.button
                  type="button"
                  disabled={isFound || complete}
                  onClick={() => {
                    if (!isFound && found.length < need) onFind(ingredient.id)
                  }}
                  className="flex w-20 flex-col items-center"
                  animate={
                    isFound
                      ? { x: -pos.x, y: -pos.y, scale: 0.25, opacity: 0 }
                      : reduce
                        ? { x: 0, y: 0 }
                        : { y: [0, index % 2 === 0 ? -6 : 6, 0] }
                  }
                  transition={
                    isFound
                      ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 4.2 + index * 0.25, repeat: Infinity }
                  }
                  aria-label={`Discover ${ingredient.name}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-soft text-lg ring-1 ring-copper/30">
                    {ingredient.symbol}
                  </span>
                  <span className="mt-1 text-[9px] tracking-[0.12em] text-ivory-muted uppercase">
                    {ingredient.name}
                  </span>
                </motion.button>
              </div>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}
