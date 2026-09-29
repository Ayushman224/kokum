import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsUp } from 'lucide-react'
import DishArt from '../ui/DishArt'
import IngredientIcon from '../ui/IngredientIcon'
import { Particles, Steam } from '../ui/Effects'
import { menu, secretIngredients } from '../data/restaurant'
import { useStore } from '../state/store'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const

/** The dish and its secret ingredients. Tap to uncover each; swipe up to continue. */
export default function StoryScreen() {
  const { dishId, go } = useStore()
  const dish = menu.find((d) => d.id === dishId)!
  const [open, setOpen] = useState<string[]>([])
  const [active, setActive] = useState<string | null>(null)
  const current = secretIngredients.find((s) => s.id === active)
  const enough = open.length >= 2

  const reveal = (id: string) => {
    sound.select()
    haptic(10)
    setActive(id)
    setOpen((o) => (o.includes(id) ? o : [...o, id]))
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 45% at 50% 28%, rgba(216,150,80,.2), transparent 70%)' }} />
      <Particles count={12} />

      {/* hero */}
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: 'calc(var(--top) + 40px)' }}>
        <motion.div className="relative w-[64%]" initial={{ scale: 1.15, opacity: 0, filter: 'blur(12px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.4, ease }}>
          <DishArt className="w-full" image={dish.image} glow={open.length / 4} />
          <Steam className="absolute left-[45%] top-[-22%] w-[45%]" />
        </motion.div>
        <motion.div className="eyebrow mt-2 text-gold" initial={{ opacity: 0, letterSpacing: '0.7em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ delay: 0.4, duration: 1.2 }}>
          Story {dish.storyNumber}
        </motion.div>
        <motion.h1 className="display mt-1 px-6 text-center text-[36px] text-ivory" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease }}>
          {dish.name.split(' & ')[0]} <span className="gold-text italic">&amp;</span> {dish.name.split(' & ')[1]}
        </motion.h1>
      </div>

      {/* secret ingredients */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="eyebrow text-[10px] text-ivory/60">The secret ingredients</span>
          <span className="text-[11px] tabular-nums text-gold">
            {open.length}/{secretIngredients.length} uncovered
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {secretIngredients.map((s, i) => {
            const isOpen = open.includes(s.id)
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => reveal(s.id)}
                aria-label={isOpen ? s.label : `Secret ingredient ${i + 1} — tap to reveal`}
                className={`relative aspect-[3/4] overflow-hidden rounded-2xl border ${active === s.id ? 'border-gold/80' : 'border-gold/25'}`}
                style={{ perspective: 600 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08, ease }}
                whileTap={{ scale: 0.94 }}
              >
                <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: isOpen ? 180 : 0 }} transition={{ duration: 0.7, ease: [0.6, 0, 0.2, 1] }}>
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#2a1d17] to-[#140f0c]" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle, rgba(216,176,106,.8) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }} />
                    <span className="relative font-serif text-[26px] italic text-gold">?</span>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#241b16] to-[#120e0b] p-1.5" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <IngredientIcon icon={s.icon} className="h-[55%] w-[70%]" />
                    <span className="mt-1 text-center text-[8.5px] font-bold uppercase leading-tight tracking-[0.08em] text-ivory/85">{s.label}</span>
                  </div>
                </motion.div>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-3 flex min-h-[62px] items-center justify-center text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.p key={current.id} className="font-serif text-[17px] italic leading-snug text-ivory/80" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {current.note}
              </motion.p>
            ) : (
              <motion.p key="hint" className="text-[13px] text-ivory/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Tap a card to uncover what makes this dish special.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* swipe up to continue */}
        <motion.button
          type="button"
          onClick={() => go('gate')}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.6, bottom: 0 }}
          onDragEnd={(_, info) => info.offset.y < -50 && go('gate')}
          className="mx-auto mt-2 flex min-h-14 w-full touch-none flex-col items-center justify-center rounded-2xl"
          animate={{ opacity: enough ? 1 : 0.45 }}
          aria-label="Continue: make the dish"
        >
          <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronsUp className="h-5 w-5 text-gold" />
          </motion.span>
          <span className="eyebrow text-[9.5px] text-gold/90">Swipe up to make this dish</span>
        </motion.button>
      </div>
    </div>
  )
}
