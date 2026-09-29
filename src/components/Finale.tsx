import { motion, useReducedMotion } from 'framer-motion'
import { brand } from '../data/dishData'
import { Dust } from './Atmosphere'
import { Screen } from './Screen'

export function Finale() {
  const reduce = useReducedMotion()

  return (
    <Screen className="bg-charcoal">
      <Dust />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <motion.p
          className="font-serif text-sm tracking-[0.52em] text-ivory"
          initial={reduce ? false : { opacity: 0, letterSpacing: '0.8em' }}
          animate={{ opacity: 1, letterSpacing: '0.52em' }}
          transition={{ duration: 1.2 }}
        >
          {brand.name}
        </motion.p>
        <div className="mt-6 text-[11px] tracking-[0.32em] text-copper uppercase">
          {brand.taglineLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-12 font-serif text-xl text-ivory-muted italic">
          {brand.closeLine}
        </p>
      </div>
    </Screen>
  )
}
