import { motion, useReducedMotion } from 'framer-motion'
import { brand, dishData } from '../data/dishData'
import { Dust } from './Atmosphere'
import { Screen } from './Screen'
import { StoryImage } from './StoryImage'

type IntroSceneProps = {
  onBegin: () => void
}

export function IntroScene({ onBegin }: IntroSceneProps) {
  const reduce = useReducedMotion()

  return (
    <Screen className="bg-charcoal">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { opacity: 0, scale: 1.12, filter: 'blur(22px)' }}
        animate={{ opacity: 0.55, scale: 1.04, filter: 'blur(10px)' }}
        transition={{ duration: reduce ? 0.01 : 3.8, delay: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <StoryImage
          src={dishData.introImage}
          alt={dishData.introImageAlt}
          loading="eager"
          fetchPriority="high"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-b from-charcoal via-charcoal/55 to-charcoal" />
      </motion.div>
      <Dust />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-8 pb-16 text-center">
        <motion.div
          className="pointer-events-none absolute top-[18%] left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-copper/20 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.4 }}
          aria-hidden
        />

        <motion.p
          className="font-serif text-xs tracking-[0.5em] text-ivory"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          {brand.name}
        </motion.p>
        <motion.p
          className="mt-8 font-serif text-lg text-ivory-muted italic"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {dishData.hookWhisper}
        </motion.p>
        <h1 className="mt-10 font-serif text-[42px] leading-[0.92] tracking-tight text-ivory">
          {brand.taglineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-5 font-serif text-base text-ivory-soft italic">
          {dishData.hookInvite}
        </p>

        <button
          type="button"
          onClick={onBegin}
          aria-label={dishData.touchLabel}
          className="group relative mt-12 flex h-24 w-24 items-center justify-center"
        >
          <span className="absolute inset-0 rounded-full bg-copper/15 blur-md" />
          <motion.span
            className="absolute inset-2 rounded-full border border-copper/50"
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="relative text-[9px] tracking-[0.18em] text-ivory uppercase">
            Touch
          </span>
        </button>
        <p className="mt-3 text-[10px] tracking-[0.28em] text-ivory-muted uppercase">
          {dishData.touchLabel}
        </p>
      </div>
    </Screen>
  )
}
