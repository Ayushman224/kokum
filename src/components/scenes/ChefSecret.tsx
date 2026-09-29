import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Particles, Steam } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { sound, haptic } from '../../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const

/** SCENE 08 — the restaurant's voice. A wax-sealed note from the kitchen. */
export default function ChefSecret() {
  const { go } = useExperience()
  const story = dishData.chefStory
  const [open, setOpen] = useState(false)
  const lines = story.heading.split('\n')

  const openIt = () => {
    if (open) return
    setOpen(true)
    sound.reveal()
    haptic([8, 40, 12])
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-[#0c0908]">
      <KitchenLight />

      <motion.div className="absolute inset-x-0 top-[10%] px-8 text-center" animate={{ opacity: open ? 0 : 1, y: open ? -30 : 0 }} transition={{ duration: 0.8, ease }}>
        <motion.div className="eyebrow text-gold/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          From the kitchen
        </motion.div>
        <h2 className="display mt-3 text-[42px] text-ivory">
          {lines.map((l, i) => (
            <span key={i} className="block overflow-hidden pb-1">
              <motion.span className={`block ${i === 1 ? 'gold-text italic' : ''}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.4 + i * 0.14, ease }}>
                {l}
              </motion.span>
            </span>
          ))}
        </h2>
      </motion.div>

      {/* envelope */}
      <div className="absolute inset-x-0 top-[40%] flex justify-center" style={{ perspective: 1000 }}>
        <motion.button
          type="button"
          onClick={openIt}
          aria-label={open ? "Chef's note opened" : "Tap to open the chef's sealed note"}
          aria-expanded={open}
          className="relative h-[190px] w-[290px] cursor-pointer"
          initial={{ y: 60, opacity: 0, rotate: -4 }}
          animate={{ y: open ? 110 : 0, opacity: 1, rotate: open ? 0 : [-2, 2, -2] }}
          transition={open ? { duration: 1, ease } : { y: { duration: 1.2, delay: 0.8, ease }, opacity: { delay: 0.8 }, rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
        >
          {/* letter */}
          <motion.div
            className="absolute inset-x-4 top-3 z-10 rounded-sm bg-[#f3eadb] px-6 pb-6 pt-7 text-left text-ink shadow-[0_20px_40px_-10px_rgba(0,0,0,.6)]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 27px, rgba(138,39,72,.06) 27px 28px)' }}
            initial={false}
            animate={open ? { y: -250, zIndex: 30, scale: 1.08, opacity: 1 } : { y: 0, zIndex: 10, scale: 1, opacity: 0 }}
            transition={{ duration: 1.1, delay: open ? 0.55 : 0, ease }}
            onClick={(e) => {
              if (!open) return
              e.stopPropagation()
              go('card')
            }}
          >
            <div className="eyebrow text-kokum">Chef's note</div>
            <div className="mt-3 space-y-2 font-serif text-[20px] italic leading-snug">
              {story.note.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>
            <div className="mt-4 font-serif text-[14px] text-ink/60">{story.signature}</div>
            {story.isSample && <div className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/35">Sample content</div>}
          </motion.div>

          {/* envelope body */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-md bg-gradient-to-b from-[#3a2a22] to-[#22160f] shadow-[0_30px_60px_-15px_rgba(0,0,0,.9)]" style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}>
            <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, transparent 49.5%, rgba(216,176,106,.35) 50%, transparent 50.5%), linear-gradient(225deg, transparent 49.5%, rgba(216,176,106,.35) 50%, transparent 50.5%)' }} />
            <div className="eyebrow absolute bottom-4 left-0 right-0 text-center text-[9px] text-gold/60">For the guest at this table</div>
          </div>
          {/* flap */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 h-[58%] origin-top"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: 'linear-gradient(180deg, #4a3529, #2d1f17)', transformStyle: 'preserve-3d' }}
            animate={open ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
            transition={{ duration: 0.8, ease: [0.6, 0, 0.3, 1] }}
          />
          {/* wax seal */}
          <motion.div
            className="absolute left-1/2 top-[50%] z-40 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 30%, #b8456a, #7a1f3d 55%, #4a0f24)', boxShadow: '0 4px 12px rgba(0,0,0,.6), inset 0 -3px 6px rgba(0,0,0,.4), inset 0 2px 4px rgba(255,255,255,.2)' }}
            animate={open ? { scale: [1, 1.2, 0], opacity: [1, 1, 0], rotate: 40 } : { scale: [1, 1.06, 1] }}
            transition={open ? { duration: 0.6 } : { duration: 2, repeat: Infinity }}
          >
            <span className="font-serif text-[24px] italic text-[#f0c9d5]/90">K</span>
          </motion.div>
        </motion.button>
      </div>

      <div className="absolute inset-x-0 bottom-[7%] text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.p key="tap" className="eyebrow text-ivory/55" initial={{ opacity: 0 }} animate={{ opacity: [0.35, 0.9, 0.35] }} exit={{ opacity: 0 }} transition={{ duration: 2.4, repeat: Infinity, delay: 1.6 }}>
              Tap the seal
            </motion.p>
          ) : (
            <motion.button
              key="press"
              type="button"
              onClick={() => go('card')}
              className="eyebrow rounded-full px-5 py-3 text-gold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              Tap the note to seal it into your card
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      {open && <Particles count={12} />}
    </div>
  )
}

/** Illustrated kitchen at night: window light, silhouettes, rising steam. Replace with dishData.chefImage when available. */
function KitchenLight() {
  if (dishData.chefImage) {
    return (
      <>
        <img src={dishData.chefImage} alt="Kokum's kitchen" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink" />
      </>
    )
  }
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 45% at 78% 8%, rgba(245,180,100,.28), transparent 70%)' }} />
      {/* light shafts */}
      <div className="absolute right-[-10%] top-[-5%] h-[80%] w-[70%] opacity-25" style={{ background: 'repeating-linear-gradient(115deg, rgba(255,210,150,.5) 0 18px, transparent 18px 60px)', maskImage: 'linear-gradient(200deg, black 10%, transparent 70%)', WebkitMaskImage: 'linear-gradient(200deg, black 10%, transparent 70%)' }} />
      <svg viewBox="0 0 390 300" className="absolute inset-x-0 bottom-0 w-full opacity-70">
        <rect x="0" y="230" width="390" height="70" fill="#130e0b" />
        <path d="M0 230 H390" stroke="#c07a4c" strokeOpacity=".3" />
        {/* pots on counter */}
        <path d="M40 230 q 0 -40 40 -40 h 30 q 40 0 40 40 z" fill="#1d1511" stroke="#c07a4c" strokeOpacity=".4" />
        <rect x="240" y="176" width="70" height="54" rx="6" fill="#1d1511" stroke="#c07a4c" strokeOpacity=".4" />
        <rect x="232" y="170" width="86" height="8" rx="4" fill="#2a1d16" />
        <path d="M330 230 v -80 M 322 150 h 16" stroke="#6b4428" strokeWidth="3" />
      </svg>
      <Steam className="absolute bottom-[22%] left-[14%] w-[30%]" />
      <Steam className="absolute bottom-[26%] right-[16%] w-[26%]" intensity={0.6} />
      <div className="vignette absolute inset-0" />
    </div>
  )
}
