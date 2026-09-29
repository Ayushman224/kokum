import { motion } from 'framer-motion'
import Sigil from './Sigil'
import type { TasteProfile } from '../../data/types'
import { dishData } from '../../data/dishData'

/** The on-screen digital collectible. `reveal` staggers the typography in. */
export function CardFront({ profile, reveal = false, compact = false }: { profile: TasteProfile; reveal?: boolean; compact?: boolean }) {
  const item = (i: number) =>
    reveal
      ? { initial: { opacity: 0, y: 10, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { delay: 0.9 + i * 0.12, duration: 0.7 } }
      : {}
  const words = profile.title.split(' ')
  const last = words.pop()

  return (
    <div
      className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[18px] px-5 text-center"
      style={{
        background: `radial-gradient(90% 55% at 50% 38%, ${profile.accent}40, transparent 70%), linear-gradient(180deg, #1a1411, #0b0908)`,
        boxShadow: `0 30px 80px -20px rgba(0,0,0,.9), 0 0 60px -10px ${profile.accent}55`,
      }}
    >
      <div className="pointer-events-none absolute inset-[8px] rounded-[12px] border border-gold/45" />
      <div className="pointer-events-none absolute inset-[13px] rounded-[9px] border border-gold/15" />
      <motion.div {...item(0)} className={`font-serif tracking-[0.5em] text-ivory ${compact ? 'mt-5 text-[12px]' : 'mt-7 text-[15px]'}`}>
        KOKUM
      </motion.div>
      <motion.div {...item(1)} className={`eyebrow text-gold/90 ${compact ? 'mt-1.5 text-[7px]' : 'mt-2 text-[9px]'}`}>
        My taste
      </motion.div>
      <motion.div {...item(2)} className={`relative ${compact ? 'my-1 w-[42%]' : 'my-2 w-[44%]'} aspect-square`}>
        <Sigil id={profile.id} accent={profile.accent} className="h-full w-full" />
        <span className={`absolute inset-0 grid place-items-center ${compact ? 'text-[20px]' : 'text-[30px]'}`} aria-hidden="true">
          {profile.traits[0].emoji}
        </span>
      </motion.div>
      <motion.div {...item(3)} className={`display text-ivory ${compact ? 'text-[22px]' : 'text-[32px]'}`}>
        {words.join(' ')} <span className="gold-text italic">{last}</span>
      </motion.div>
      <motion.div {...item(4)} className={`flex gap-3 ${compact ? 'mt-2' : 'mt-3'}`}>
        {profile.traits.map((t) => (
          <span key={t.label} className={`font-semibold uppercase tracking-[0.12em] text-ivory/85 ${compact ? 'text-[6.5px]' : 'text-[9px]'}`}>
            <span className="mr-1" aria-hidden="true">
              {t.emoji}
            </span>
            {t.label}
          </span>
        ))}
      </motion.div>
      <motion.div {...item(5)} className={`hairline w-2/3 ${compact ? 'mt-3' : 'mt-4'}`} />
      <motion.div {...item(6)} className={`eyebrow text-ivory/50 ${compact ? 'mt-2 text-[6px]' : 'mt-3 text-[8px]'}`}>
        Dish discovered
      </motion.div>
      <motion.div {...item(7)} className={`font-serif text-ivory ${compact ? 'text-[13px]' : 'mt-1 text-[20px]'}`}>
        Appam &amp; Stew
      </motion.div>
      <motion.div {...item(8)} className={`eyebrow mt-auto text-gold/80 ${compact ? 'mb-4 text-[6px]' : 'mb-6 pt-2 text-[8.5px]'}`}>
        {dishData.shareHashtag}
      </motion.div>
    </div>
  )
}

export function CardBack() {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#2a1d17] via-[#140f0c] to-[#2a1d17] shadow-[0_30px_80px_-20px_rgba(0,0,0,.9)]">
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(216,176,106,.8) 1px, transparent 1.5px)', backgroundSize: '16px 16px' }}
      />
      <div className="pointer-events-none absolute inset-[8px] rounded-[12px] border border-gold/45" />
      <div className="relative grid h-24 w-24 place-items-center rounded-full border border-gold/50">
        <span className="font-serif text-[44px] italic text-gold">K</span>
      </div>
    </div>
  )
}
