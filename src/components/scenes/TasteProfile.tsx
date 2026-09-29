import { motion } from 'framer-motion'
import Sigil from '../ui/Sigil'
import { MagneticButton, Particles } from '../ui/Effects'
import { useExperience } from '../../experience/store'
import { WandSparkles } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

/** SCENE 07 — the guest's taste identity, with a generative emblem. */
export default function TasteProfile() {
  const { profile, go } = useExperience()

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(80% 50% at 50% 36%, ${profile.accent}33, transparent 70%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      <Particles count={14} color={profile.accent} />

      <div className="relative flex h-full flex-col items-center px-7 pb-[28px] pt-[84px] text-center">
        <motion.div className="eyebrow text-ivory/60" initial={{ opacity: 0, letterSpacing: '0.7em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.4 }}>
          Your Kokum taste
        </motion.div>

        <motion.div className="relative my-3 aspect-square w-[64%]" initial={{ scale: 0.6, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1.6, ease }}>
          <Sigil id={profile.id} accent={profile.accent} className="h-full w-full" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-serif text-[46px] italic text-ivory/90" aria-hidden="true">
              {profile.traits[0].emoji}
            </span>
          </div>
        </motion.div>

        <h2 className="display text-[50px] text-ivory" aria-label={profile.title}>
          {profile.title.split(' ').map((w, i, arr) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className={`inline-block ${i === arr.length - 1 ? 'gold-text italic' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.6 + i * 0.12, ease }}
              >
                {w}
                {i < arr.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.p className="mt-2 max-w-[290px] text-[14px] leading-relaxed text-ivory/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          {profile.description}
        </motion.p>

        <ul className="mt-6 flex gap-2.5" aria-label="Your taste traits">
          {profile.traits.map((t, i) => (
            <motion.li
              key={t.label}
              className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-white/[0.03] px-3.5 py-2 backdrop-blur"
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.14, type: 'spring', stiffness: 220, damping: 18 }}
            >
              <span aria-hidden="true">{t.emoji}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory/85">{t.label}</span>
            </motion.li>
          ))}
        </ul>

        <motion.p className="mt-6 font-serif text-[20px] italic text-gold/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 1 }}>
          “{profile.line}”
        </motion.p>

        <motion.div className="mt-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.8, ease }}>
          <MagneticButton onClick={() => go('chefSecret')} className="shimmer">
            <WandSparkles className="h-4 w-4" aria-hidden="true" /> Create my Kokum card
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  )
}
