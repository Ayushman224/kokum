import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { dishData } from '../data/dishData'
import { Dust, Steam } from './Atmosphere'
import { DragToken } from './DragToken'
import { Screen } from './Screen'

type ChefGameProps = {
  onComplete: () => void
}

export function ChefGame({ onComplete }: ChefGameProps) {
  const reduce = useReducedMotion()
  const [inPan, setInPan] = useState(false)
  const [miss, setMiss] = useState(false)
  const [heat, setHeat] = useState(0.2)
  const sweet =
    inPan && heat >= dishData.cook.sweetMin && heat <= dishData.cook.sweetMax

  useEffect(() => {
    if (!sweet) return
    const timer = window.setTimeout(onComplete, reduce ? 300 : 1500)
    return () => window.clearTimeout(timer)
  }, [sweet, onComplete, reduce])

  return (
    <Screen className="bg-charcoal">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${dishData.kitchenImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-charcoal/75" />
      <Dust />

      <div className="relative z-10 flex h-full flex-col px-6 pt-16 pb-8">
        <h2 className="font-serif text-[36px] leading-[0.95] text-ivory">
          {dishData.chefNeed.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-3 text-[11px] tracking-[0.2em] text-ivory-muted uppercase">
          {inPan ? 'Find the heat' : 'Drag the right ingredient into the pan'}
        </p>

        <div className="mt-8 flex justify-center gap-5">
          {dishData.chefIngredients.map((item) => {
            if (inPan && item.correct) return null
            return (
              <DragToken
                key={item.id}
                ariaLabel={`Drag ${item.name} into the pan`}
                dropSelector="[data-drop='pan']"
                disabled={inPan}
                onHit={() => {
                  if (item.correct) {
                    setInPan(true)
                    setMiss(false)
                  } else setMiss(true)
                }}
                onMiss={() => setMiss(true)}
              >
                <span className="flex w-16 flex-col items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-soft text-xl ring-1 ring-copper/30">
                    {item.symbol}
                  </span>
                  <span className="mt-1 text-[9px] tracking-[0.14em] text-ivory-muted uppercase">
                    {item.name}
                  </span>
                </span>
              </DragToken>
            )
          })}
        </div>

        <div className="relative mx-auto mt-10">
          <div
            data-drop="pan"
            className={`flex h-36 w-56 items-end justify-center rounded-[50%] border ${
              inPan ? 'border-copper bg-copper/10' : 'border-line bg-charcoal-soft/80'
            }`}
          >
            {inPan ? <Steam /> : null}
            <span className="mb-6 text-[10px] tracking-[0.24em] text-copper uppercase">
              Pan
            </span>
          </div>
          {inPan ? (
            <motion.div
              className="absolute -bottom-2 left-1/2 h-8 w-16 -translate-x-1/2 bg-copper/40 blur-md"
              animate={reduce ? undefined : { opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              aria-hidden
            />
          ) : null}
        </div>

        {inPan ? (
          <div className="mt-auto">
            <label className="flex items-center justify-between text-[10px] tracking-[0.22em] text-ivory-muted uppercase">
              <span>{dishData.cook.low}</span>
              <span>{dishData.cook.high}</span>
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={heat}
              onChange={(event) => setHeat(Number(event.target.value))}
              className="mt-3 w-full accent-copper"
              aria-label="Cooking intensity"
            />
            <p className="mt-5 text-center font-serif text-xl text-ivory italic">
              {sweet ? (
                <>
                  🔥 {dishData.chefSweet}
                </>
              ) : miss && !inPan ? (
                dishData.secretFail
              ) : (
                dishData.chefSuccess
              )}
            </p>
          </div>
        ) : (
          <p className="mt-auto text-center font-serif text-lg text-ivory-muted italic">
            {miss ? dishData.secretFail : ' '}
          </p>
        )}
      </div>
    </Screen>
  )
}
