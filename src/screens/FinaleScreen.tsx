import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import DishArt from '../ui/DishArt'
import { MagneticButton, Particles } from '../ui/Effects'
import { menu } from '../data/restaurant'
import { useStore } from '../state/store'

const ease = [0.16, 1, 0.3, 1] as const

/** End of the journey: you've only just started — come back for the next dish. */
export default function FinaleScreen() {
  const { backToMenu, dishId } = useStore()
  const total = menu.length
  const R = 42

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 40% at 50% 45%, rgba(216,150,80,.2), transparent 70%)' }} />
      <Particles count={20} />
      <div className="relative flex h-full flex-col items-center px-7 text-center" style={{ paddingTop: 'calc(var(--top) + 56px)' }}>
        <motion.div className="eyebrow text-gold" initial={{ opacity: 0, letterSpacing: '0.8em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.2 }}>
          1 of {total} stories discovered
        </motion.div>
        <motion.h2 className="display mt-3 text-[46px] text-ivory" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1, ease }}>
          You've only
          <br />
          <span className="gold-text italic">just started.</span>
        </motion.h2>

        {/* constellation of stories */}
        <div className="relative my-6 aspect-square w-[80%]">
          <div className="absolute inset-[8%] rounded-full border border-gold/15" />
          <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
            {menu.map((d, i) => {
              const a = ((90 + (i * 360) / total) * Math.PI) / 180
              const mine = d.id === dishId
              return (
                <motion.div key={d.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%` }} animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
                  {mine ? (
                    <span className="block h-[58px] w-[58px] overflow-hidden rounded-full ring-2 ring-gold shadow-[0_0_24px_rgba(216,176,106,.6)]">
                      <DishArt className="h-full w-full scale-110" image={d.image} />
                    </span>
                  ) : (
                    <span className="grid h-[42px] w-[42px] place-items-center rounded-full border border-ivory/15 bg-white/[0.03]">
                      <Lock className="h-3.5 w-3.5 text-ivory/35" />
                    </span>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
          <div className="absolute left-1/2 top-1/2 grid h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-gradient-to-b from-[#1f1814] to-[#0e0b09]">
            <span className="font-serif text-[13px] tracking-[0.4em] text-ivory">KOKUM</span>
          </div>
        </div>

        <p className="max-w-[290px] font-serif text-[19px] italic leading-snug text-ivory/75">Try a new dish next time — every dish has its own story, game and reward.</p>
        <div className="mt-auto mb-8 w-full">
          <MagneticButton className="w-full" onClick={backToMenu}>
            Back to the menu
          </MagneticButton>
        </div>
      </div>
    </div>
  )
}
