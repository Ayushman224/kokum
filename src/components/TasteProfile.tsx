import { motion, useReducedMotion } from 'framer-motion'
import type { TasteProfile } from '../data/dishData'
import { dishData } from '../data/dishData'
import { Dust } from './Atmosphere'
import { Screen } from './Screen'

type TasteProfileSceneProps = {
  profile: TasteProfile
  onCreate: () => void
}

export function TasteProfileScene({ profile, onCreate }: TasteProfileSceneProps) {
  const reduce = useReducedMotion()

  return (
    <Screen className="bg-charcoal">
      <Dust />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="text-[10px] tracking-[0.34em] text-copper uppercase">
          {dishData.tasteHeading}
        </p>
        <motion.h2
          className="mt-6 font-serif text-[44px] leading-[0.92] text-ivory"
          initial={reduce ? false : { opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
        >
          {profile.name}
        </motion.h2>
        <div className="mt-8 flex flex-col gap-2">
          {profile.notes.map((note) => (
            <p key={note.label} className="text-[12px] tracking-[0.22em] text-ivory-soft uppercase">
              {note.symbol} {note.label}
            </p>
          ))}
        </div>
        <p className="mt-8 max-w-xs font-serif text-lg text-ivory-muted italic">
          “{profile.aftertaste}”
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="mt-12 text-[11px] tracking-[0.28em] text-copper uppercase"
        >
          {dishData.tasteCta}
        </button>
      </div>
    </Screen>
  )
}
