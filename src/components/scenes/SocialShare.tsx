import { motion } from 'framer-motion'
import { CardFront } from '../ui/KokumCard'
import { Particles } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { buildShareText, buildShareUrl, copyText, whatsappUrl } from '../../lib/share'
import { sound, haptic } from '../../lib/sound'
import { Heart, Link2, MessageCircle, Send } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

/** SCENE 10 — the social mechanic. Story-style preview + real WhatsApp / copy, Instagram flagged as prototype. */
export default function SocialShare() {
  const { profile, go, showToast } = useExperience()
  const text = buildShareText(profile, dishData.shareHashtag)
  const url = buildShareUrl(dishData.id, profile)

  const copy = async () => {
    sound.tap()
    const ok = await copyText(`${text}\n${url}`)
    showToast(ok ? 'Link copied — paste it anywhere' : 'Could not copy on this device')
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 40% at 50% 38%, rgba(138,39,72,.22), transparent 70%)' }} />
      <Particles count={10} />

      <div className="relative flex h-full flex-col items-center px-6 pb-[28px] pt-[84px]">
        <h2 className="display text-center text-[36px] text-ivory">
          {['Your story', "doesn't have to end here."].map((l, i) => (
            <span key={l} className="block overflow-hidden pb-1">
              <motion.span className={`block ${i ? 'gold-text text-[30px] italic' : ''}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: i * 0.12, ease }}>
                {l}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* story-style preview */}
        <motion.div
          className="relative mt-5 aspect-[9/16] h-[41%] overflow-hidden rounded-[20px] border border-white/10 bg-black p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)]"
          initial={{ opacity: 0, y: 30, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          aria-label="Preview of your story post"
          role="img"
        >
          <div className="absolute inset-x-3 top-3 z-10 flex gap-1">
            <motion.span className="h-[2px] flex-1 origin-left rounded bg-white/90" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5, repeat: Infinity }} />
            <span className="h-[2px] flex-1 rounded bg-white/30" />
          </div>
          <div className="absolute left-3 top-6 z-10 flex items-center gap-1.5">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-gold to-kokum ring-1 ring-white/60" />
            <span className="text-[8px] font-semibold text-white">you</span>
            <span className="text-[8px] text-white/60">now</span>
          </div>
          <div className="h-full w-full pb-9 pt-8">
            <CardFront profile={profile} compact />
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
            <span className="flex-1 rounded-full border border-white/30 px-2.5 py-1 text-[7px] text-white/60">Send message</span>
            <Heart className="h-3 w-3 text-white" aria-hidden="true" />
            <Send className="h-3 w-3 text-white" aria-hidden="true" />
          </div>
        </motion.div>

        <motion.p className="mt-5 font-serif text-[19px] italic text-ivory/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          Share it with your friends.
        </motion.p>

        <motion.div className="mt-4 grid w-full grid-cols-3 gap-2.5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, ease }}>
          <a
            href={whatsappUrl(text, url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              sound.tap()
              haptic()
            }}
            className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/10 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory"
          >
            <MessageCircle className="h-5 w-5 text-[#25d366]" aria-hidden="true" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              sound.tap()
              showToast('Instagram sharing will be connected in the production version.')
            }}
            className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e1306c]/30 bg-[#e1306c]/10 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory"
          >
            <InstagramGlyph />
            Instagram
          </button>
          <button
            type="button"
            onClick={copy}
            className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-gold/30 bg-gold/10 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory"
          >
            <Link2 className="h-5 w-5 text-gold" aria-hidden="true" />
            Copy link
          </button>
        </motion.div>

        {/* teaser into the heart challenge */}
        <motion.button
          type="button"
          onClick={() => go('hearts')}
          className="mt-auto flex items-center gap-3 rounded-full py-2 pl-2 pr-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          aria-label="Continue to the 10 hearts challenge"
        >
          <motion.span className="grid h-11 w-11 place-items-center rounded-full bg-kokum/30 ring-1 ring-kokum" animate={{ scale: [1, 1.15, 1, 1.1, 1] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6 }}>
            <Heart className="h-5 w-5 fill-[#e56b8f] text-[#e56b8f]" aria-hidden="true" />
          </motion.span>
          <span className="text-left">
            <span className="block text-[13px] font-semibold text-ivory">Their hearts unlock something.</span>
            <span className="eyebrow text-[9px] text-gold/80">Tap the heart</span>
          </span>
        </motion.button>
      </div>
    </div>
  )
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#e1306c" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="#e1306c" stroke="none" />
    </svg>
  )
}
