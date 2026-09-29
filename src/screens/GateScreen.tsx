import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { Particles } from '../ui/Effects'
import { useStore } from '../state/store'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const

/** Play the kitchen mini-game, or skip straight to the first-bite quiz. */
export default function GateScreen() {
  const { go } = useStore()
  return (
    <div className="absolute inset-0 overflow-clip bg-[#0d0a08]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 45% at 50% 48%, rgba(240,150,70,.22), transparent 70%)' }} />
      <div className="absolute inset-x-0 top-0 h-1/2 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(244,236,223,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,236,223,1) 1px, transparent 1px)', backgroundSize: '34px 22px', maskImage: 'linear-gradient(to bottom, black, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)' }} />
      <Particles count={14} color="#f0a050" />

      <div className="relative flex h-full flex-col items-center px-8 text-center" style={{ paddingTop: 'calc(var(--top) + 70px)' }}>
        <motion.div className="eyebrow text-gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          The kitchen is ready
        </motion.div>
        <motion.h2 className="display mt-3 text-[48px] text-ivory" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 1, ease }}>
          Make
          <br />
          <span className="gold-text italic">the dish.</span>
        </motion.h2>
        <motion.p className="mt-3 max-w-[270px] text-[14px] leading-relaxed text-ivory/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          Find the ingredients, drop them in the pan and find the perfect heat. About 30 seconds.
        </motion.p>

        <motion.button
          type="button"
          onClick={() => {
            sound.select()
            haptic([10, 30, 10])
            go('kitchen')
          }}
          className="relative mt-12 grid h-[132px] w-[132px] place-items-center rounded-full"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 160, damping: 14 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Play the kitchen game"
        >
          <span className="ring-pulse absolute inset-0 rounded-full border border-[#f0a050]/60" />
          <span className="ring-pulse absolute inset-0 rounded-full border border-[#f0a050]/40" style={{ animationDelay: '1.3s' }} />
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f1d9a4] via-[#d8b06a] to-[#a8763f] shadow-[0_0_60px_rgba(240,160,80,.55)]" />
          <span className="relative flex flex-col items-center text-ink">
            <Play className="h-8 w-8 fill-ink" />
            <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em]">Play</span>
          </span>
        </motion.button>

        <motion.button type="button" onClick={() => go('quiz')} className="eyebrow mt-auto mb-10 min-h-12 px-6 text-ivory/50 hover:text-ivory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          Skip the game →
        </motion.button>
      </div>
    </div>
  )
}
