import { motion, useReducedMotion } from 'framer-motion'
import { brand, dishData } from '../data/dishData'

type LoadingScreenProps = {
  progress: number
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const reduce = useReducedMotion()
  const pct = Math.min(100, Math.max(8, Math.round(progress)))

  return (
    <div
      className="flex h-full flex-col items-center justify-center px-8"
      role="status"
      aria-live="polite"
      aria-label={dishData.loadingLine}
    >
      <motion.p
        className="font-serif text-[15px] tracking-[0.48em] text-ivory"
        initial={reduce ? false : { opacity: 0, letterSpacing: '0.7em' }}
        animate={{ opacity: 1, letterSpacing: '0.48em' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {brand.name}
      </motion.p>
      <p className="mt-6 text-[11px] tracking-[0.22em] text-ivory-muted uppercase">
        {dishData.loadingLine}
      </p>
      <div className="mt-10 h-px w-36 overflow-hidden bg-line">
        <motion.div
          className="h-full bg-copper"
          initial={{ width: '8%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0.01 : 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
