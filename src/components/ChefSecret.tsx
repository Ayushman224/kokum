import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { dishData } from '../data/dishData'
import { Screen } from './Screen'
import { StoryImage } from './StoryImage'

type ChefSecretProps = {
  onComplete: () => void
}

export function ChefSecret({ onComplete }: ChefSecretProps) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(onComplete, reduce ? 400 : 2800)
    return () => window.clearTimeout(timer)
  }, [open, onComplete, reduce])

  return (
    <Screen className="bg-charcoal">
      <div className="absolute inset-0">
        <StoryImage
          src={dishData.chefImage}
          alt={dishData.chefImageAlt}
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16">
        <p className="text-[10px] tracking-[0.32em] text-copper uppercase">
          {dishData.chefStory.sampleLabel}
        </p>
        <h2 className="mt-3 font-serif text-[40px] leading-[0.94] text-ivory">
          {dishData.chefSecretHeading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open the chef's note"
            className="mt-10 w-full"
          >
            <motion.div
              className="relative overflow-hidden bg-[#c4b091] px-6 py-10 text-charcoal shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              <span className="absolute inset-2 border border-charcoal/20" />
              <p className="font-serif text-sm tracking-[0.28em]">SEALED</p>
              <p className="mt-3 font-serif text-2xl italic">Tap to open</p>
            </motion.div>
          </button>
        ) : (
          <motion.div
            initial={reduce ? false : { rotateX: -70, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            className="mt-8 origin-top bg-ivory px-6 py-8 text-charcoal"
          >
            <p className="text-[10px] tracking-[0.28em] text-copper-deep uppercase">
              {dishData.chefNoteLabel}
            </p>
            {dishData.chefStory.paragraphs.map((line) => (
              <p key={line} className="mt-4 font-serif text-xl italic">
                {line}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </Screen>
  )
}
