import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import DishArt from '../ui/DishArt'
import BowlArt from '../ui/BowlArt'
import { Particles, Steam } from '../ui/Effects'
import { maxDiscount, menu, restaurant, rewardRules } from '../data/restaurant'
import { useStore } from '../state/store'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const

/** Opened by the restaurant QR. The only screen that scrolls — it's a menu. */
export default function MenuScreen() {
  const { openDish, showToast } = useStore()

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar" style={{ paddingTop: 'calc(var(--top) + 44px)' }}>
      <div className="pointer-events-none fixed inset-0" style={{ background: 'radial-gradient(80% 40% at 50% 0%, rgba(216,150,80,.18), transparent 70%)' }} />
      <Particles count={10} className="fixed" />

      <header className="relative px-6 pt-4 text-center">
        <motion.h1 className="display text-[44px] text-ivory" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
          Every dish
          <br />
          <span className="gold-text italic">has a story.</span>
        </motion.h1>
        <motion.p className="mx-auto mt-3 max-w-[290px] text-[13.5px] leading-relaxed text-ivory/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          Pick your dish. Discover its secret, cook it, share it — and save on today's bill.
        </motion.p>

        {/* savings teaser */}
        <motion.div className="mx-auto mt-5 flex max-w-[340px] items-center justify-between rounded-2xl border border-gold/25 bg-white/[0.03] px-4 py-3 backdrop-blur" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, ease }}>
          <div className="text-left">
            <div className="eyebrow text-[9px] text-gold/80">Play & save</div>
            <div className="display text-[30px] text-ivory">
              up to <span className="gold-text italic">{maxDiscount}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-left">
            {rewardRules.map((r) => (
              <span key={r.id} className="whitespace-nowrap text-[10.5px] text-ivory/65">
                <span className="font-bold text-gold">+{r.percent}%</span> {r.title.replace('Tell us how it was', 'Review').replace('Share your story', 'Share').replace('First-bite quiz', 'Quiz')}
              </span>
            ))}
          </div>
        </motion.div>
      </header>

      <div className="relative mt-7 px-5 pb-10">
        <div className="eyebrow mb-3 flex items-center justify-between text-[9.5px] text-ivory/45">
          <span>Tonight's stories</span>
          <span>{menu.length} dishes</span>
        </div>

        {/* hero (live) dish */}
        {menu
          .filter((d) => d.live)
          .map((d) => (
            <motion.button
              key={d.id}
              type="button"
              onClick={() => {
                sound.select()
                haptic(12)
                openDish(d.id)
              }}
              className="group relative mb-4 block w-full overflow-hidden rounded-[26px] border border-gold/35 text-left"
              style={{ background: 'radial-gradient(90% 70% at 50% 30%, rgba(216,150,80,.22), transparent 70%), linear-gradient(180deg, #1d1612, #0f0c0a)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.9, ease }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Experience ${d.name}`}
            >
              {d.image ? <HeroPhoto src={d.image} credit={d.imageCredit} alt={d.name} /> : (
                <div className="relative mx-auto -mb-6 mt-2 w-[78%]">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}>
                    <DishArt className="w-full" />
                  </motion.div>
                </div>
              )}
              <div className="relative bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-8">
                <div className="flex items-center gap-2">
                  <span className="eyebrow text-[9px] text-gold">Story {d.storyNumber}</span>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
                  </span>
                </div>
                <div className="display mt-1 text-[32px] text-ivory">{d.name}</div>
                <div className="mt-1 text-[12.5px] text-ivory/55">{d.tagline}</div>
                <div className="shimmer relative mt-4 flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-[#f1d9a4] via-[#d8b06a] to-[#a8763f] text-[12px] font-bold uppercase tracking-[0.2em] text-ink">
                  Experience your dish <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.button>
          ))}

        {/* upcoming dishes */}
        <div className="grid grid-cols-2 gap-3">
          {menu
            .filter((d) => !d.live)
            .map((d, i) => (
              <motion.button
                key={d.id}
                type="button"
                onClick={() => {
                  showToast('This story is coming soon. Scan the QR beside this dish when it goes live.')
                }}
                className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-3 text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + i * 0.07, ease }}
                whileTap={{ scale: 0.97 }}
                aria-label={`${d.name} — coming soon`}
              >
                <div className="relative">
                  <BowlArt tone={d.tone} className="w-full opacity-50 blur-[2px] grayscale-[.4]" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory/20 bg-black/50 backdrop-blur">
                      <Lock className="h-4 w-4 text-ivory/70" />
                    </span>
                  </span>
                </div>
                <div className="eyebrow mt-2 text-[8.5px] text-ivory/40">Story {d.storyNumber}</div>
                <div className="mt-0.5 font-serif text-[17px] text-ivory/80">Coming soon</div>
              </motion.button>
            ))}
        </div>
        <p className="mt-8 text-center font-serif text-[15px] italic text-ivory/40">{restaurant.hashtag}</p>
      </div>
    </div>
  )
}

/** Full-bleed, colour-graded hero photo with a slow "Ken Burns" drift. Falls back to the illustration. */
function HeroPhoto({ src, alt, credit }: { src: string; alt: string; credit?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="relative mx-auto -mb-6 mt-2 w-[78%]">
        <DishArt className="w-full" />
      </div>
    )
  }
  return (
    <div className="relative -mb-10 aspect-[4/3.4] w-full overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        decoding="async"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'brightness(.88) contrast(1.15) saturate(1.1) sepia(.12)' }}
        initial={{ scale: 1.18 }}
        animate={{ scale: [1.18, 1.08, 1.18], x: ['0%', '-2%', '0%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* warm light + dark edges so the photo melts into the card */}
      <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(90% 70% at 30% 25%, rgba(255,205,140,.6), rgba(90,40,15,.4) 75%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 35%, transparent 45%, rgba(11,9,8,.7) 100%), linear-gradient(180deg, rgba(11,9,8,.35) 0%, transparent 25%, transparent 55%, #120e0b 100%)' }} />
      <Steam className="absolute left-[52%] top-[18%] w-[34%] opacity-70" />
      {credit && <span className="absolute right-3 top-3 text-[8.5px] tracking-wide text-ivory/35">{credit}</span>}
    </div>
  )
}
