import { AnimatePresence, motion } from 'framer-motion'
import { SCENES, useExperience } from '../experience/store'

// Chapters shown in the progression (the hook and the finale sit outside it).
const CHAPTERS = SCENES.filter((s) => s.id !== 'intro' && s.id !== 'finale')

/** A quiet constellation of dots — story progression, not a carousel. */
export default function ProgressIndicator() {
  const { scene } = useExperience()
  const idx = CHAPTERS.findIndex((c) => c.id === scene)
  const visible = idx >= 0

  return (
    <motion.div className="flex flex-col items-center" animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.6 }} aria-hidden={!visible}>
      <div className="flex items-center gap-[5px]" role="progressbar" aria-valuemin={1} aria-valuemax={CHAPTERS.length} aria-valuenow={Math.max(1, idx + 1)} aria-label="Story progress">
        {CHAPTERS.map((c, i) => (
          <motion.span
            key={c.id}
            className="block rounded-full"
            animate={{
              width: i === idx ? 14 : 4,
              height: 4,
              backgroundColor: i < idx ? 'rgba(216,176,106,.75)' : i === idx ? '#f0d49a' : 'rgba(244,236,223,.18)',
              boxShadow: i === idx ? '0 0 10px rgba(240,212,154,.8)' : '0 0 0 rgba(0,0,0,0)',
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          />
        ))}
      </div>
      <div className="relative mt-2 h-4 w-40 overflow-hidden text-center">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.span
              key={scene}
              className="absolute inset-x-0 text-[8.5px] font-semibold uppercase tracking-[0.28em] text-ivory/45"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { duration: 0.5 }, opacity: { duration: 3.2, times: [0, 0.1, 0.75, 1] } }}
            >
              {String(idx + 1).padStart(2, '0')} · {CHAPTERS[idx].chapter}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
