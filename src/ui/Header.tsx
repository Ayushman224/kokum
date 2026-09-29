import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Volume2, VolumeX } from 'lucide-react'
import { JOURNEY, useStore } from '../state/store'
import { sound } from '../lib/sound'

/** Top bar: back to menu, journey dots, live savings wallet, sound. */
export default function Header() {
  const { screen, backToMenu, potential, soundOn, setSoundOn } = useStore()
  const idx = JOURNEY.indexOf(screen)
  const inJourney = idx >= 0

  return (
    <div className="pointer-events-none absolute inset-x-0 z-[80] flex items-center justify-between px-3" style={{ top: 'var(--top)' }}>
      {(screen === 'menu' || screen === 'share' || screen === 'reward') && (
        <div className="absolute inset-x-0 -top-14 -bottom-4 bg-gradient-to-b from-ink via-ink/90 to-transparent" aria-hidden="true" />
      )}
      <div className="relative flex w-[92px] items-center">
        {inJourney && screen !== 'kitchen' && (
          <button type="button" onClick={backToMenu} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full text-ivory/70 hover:text-ivory" aria-label="Back to menu">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {inJourney ? (
        <div className="relative flex items-center gap-[5px]" role="progressbar" aria-label="Your journey" aria-valuemin={1} aria-valuemax={JOURNEY.length} aria-valuenow={idx + 1}>
          {JOURNEY.map((s, i) => (
            <motion.span
              key={s}
              className="block h-1 rounded-full"
              animate={{ width: i === idx ? 14 : 4, backgroundColor: i < idx ? 'rgba(216,176,106,.75)' : i === idx ? '#f0d49a' : 'rgba(244,236,223,.18)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            />
          ))}
        </div>
      ) : (
        <span className="relative font-serif text-[13px] tracking-[0.5em] text-ivory/80">KOKUM</span>
      )}

      <div className="relative flex w-[92px] items-center justify-end gap-1">
        <AnimatePresence>
          {inJourney && potential > 0 && (
            <motion.div
              key={potential}
              className="whitespace-nowrap rounded-full border border-gold/40 bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              aria-label={`Savings so far: ${potential} percent`}
            >
              {potential}% off
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => {
            sound.setEnabled(!soundOn)
            setSoundOn(!soundOn)
          }}
          className="pointer-events-auto grid h-10 w-9 place-items-center text-ivory/55 hover:text-ivory"
          aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          aria-pressed={soundOn}
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
