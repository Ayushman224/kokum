import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, Download, Heart, Link2, MessageCircle } from 'lucide-react'
import StoryCard from '../ui/StoryCard'
import { MagneticButton } from '../ui/Effects'
import { menu, restaurant, rewardRules } from '../data/restaurant'
import { useStore } from '../state/store'
import { renderStoryPng } from '../lib/storyImage'
import { copyText, downloadDataUrl, nativeShareImage, shareText, storyUrl, whatsappUrl } from '../lib/share'
import { sound, haptic } from '../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const
const SHARE = rewardRules.find((r) => r.id === 'share')!
const LIKES = rewardRules.find((r) => r.id === 'likes')!

/**
 * Share the card. The share bonus is claimed here and verified by staff (show your post);
 * the 10-likes bonus is NOT simulated — the counter is a placeholder for future verified tracking.
 */
export default function ShareScreen() {
  const { dishId, photo, layout, rewards, setReward, rewardCode, go, showToast } = useStore()
  const dish = menu.find((d) => d.id === dishId)!
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const text = shareText(dish.shortName)
  const url = storyUrl(dish.id, rewardCode)
  const shared = rewards.share !== 'locked'

  const claim = () => {
    if (!shared) {
      setReward('share', 'pending')
      setReward('likes', 'pending')
    }
  }
  const png = () => renderStoryPng(layout, photo, dish, cardRef.current?.querySelector('svg[role="img"]') ?? null)

  const instagram = async () => {
    setBusy(true)
    const img = await png()
    const ok = await nativeShareImage(img, text)
    if (!ok) {
      downloadDataUrl(img)
      showToast(`Card saved. Open Instagram, add it to your Story and tag ${restaurant.instagramHandle}.`)
    }
    setBusy(false)
    claim()
  }
  const download = async () => {
    setBusy(true)
    downloadDataUrl(await png())
    setBusy(false)
    showToast('Story card saved.')
    claim()
  }
  const copy = async () => {
    const ok = await copyText(`${text}\n${url}`)
    showToast(ok ? 'Link copied — paste it anywhere.' : 'Could not copy on this device.')
    if (ok) claim()
  }

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-ink no-scrollbar">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 30% at 50% 18%, rgba(138,39,72,.25), transparent 70%)' }} />
      <div className="relative flex min-h-full flex-col items-center px-5 pb-6" style={{ paddingTop: 'calc(var(--top) + 46px)' }}>
        <h2 className="display text-center text-[34px] text-ivory">
          Your story <span className="gold-text italic">is ready.</span>
        </h2>

        <motion.div ref={cardRef} className="mt-4 w-[48%]" initial={{ y: 30, rotate: -4, opacity: 0 }} animate={{ y: 0, rotate: -2, opacity: 1 }} transition={{ duration: 1, ease }}>
          <StoryCard layout={layout} photo={photo} dish={dish} className="shadow-[0_30px_70px_-20px_rgba(0,0,0,.95)]" />
        </motion.div>

        <p className="mt-4 font-serif text-[18px] italic text-ivory/75">Share it with your friends.</p>
        <div className="mt-3 grid w-full grid-cols-4 gap-2">
          <a
            href={whatsappUrl(text, url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              sound.tap()
              haptic()
              claim()
            }}
            className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/10 text-[9px] font-bold uppercase tracking-[0.1em] text-ivory"
          >
            <MessageCircle className="h-5 w-5 text-[#25d366]" />
            WhatsApp
          </a>
          <ShareBtn onClick={instagram} disabled={busy} tone="#e1306c" label="Instagram" icon={<InstagramGlyph />} />
          <ShareBtn onClick={download} disabled={busy} tone="#d8b06a" label="Download" icon={<Download className="h-5 w-5 text-gold" />} />
          <ShareBtn onClick={copy} tone="#d8b06a" label="Copy link" icon={<Link2 className="h-5 w-5 text-gold" />} />
        </div>
        <p className="mt-2 text-center text-[10.5px] text-ivory/40">Instagram opens your phone's share sheet or saves the card — post it and tag {restaurant.instagramHandle}.</p>

        {/* reward panel */}
        <div className="mt-5 w-full space-y-2.5">
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${shared ? 'border-gold/60 bg-gold/10' : 'border-white/10 bg-white/[0.03]'}`}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">{shared ? <Check className="h-5 w-5" /> : <span className="text-[13px] font-bold">+{SHARE.percent}%</span>}</div>
            <div className="text-left">
              <div className="text-[13.5px] font-semibold text-ivory">Share &amp; tag {restaurant.instagramHandle}</div>
              <div className="text-[11.5px] text-ivory/55">{shared ? `+${SHARE.percent}% — show your post to our staff.` : `Post your card to unlock +${SHARE.percent}% off.`}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-kokum/50 bg-kokum/10 p-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-[#e56b8f] text-[#e56b8f]" />
                <span className="eyebrow text-[10px] text-[#f0a6bd]">Get 10 likes</span>
              </div>
              <span className="display text-[26px] italic text-ivory">+{LIKES.percent}%</span>
            </div>
            <p className="mt-1 text-[12.5px] leading-snug text-ivory/70">Get 10 likes on your Kokum story <b className="text-ivory">before you finish your meal</b>.</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex flex-1 gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="h-1.5 flex-1 rounded-full bg-white/12" />
                ))}
              </div>
              <span className="text-[12px] tabular-nums text-ivory/60">0 / 10</span>
            </div>
            <p className="mt-2 text-[10.5px] leading-snug text-ivory/45">Likes will appear here after your story is shared. Demo — social verification is connected in production; until then staff check your post before you pay.</p>
          </div>
        </div>

        <div className="mt-6 w-full">
          <MagneticButton className="w-full" variant={shared ? 'primary' : 'ghost'} onClick={() => go('review')}>
            {shared ? 'Continue' : 'Continue without sharing'}
          </MagneticButton>
        </div>
      </div>
    </div>
  )
}

function ShareBtn({ onClick, disabled, tone, label, icon }: { onClick: () => void; disabled?: boolean; tone: string; label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {
        sound.tap()
        haptic()
        onClick()
      }}
      disabled={disabled}
      className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl border text-[9px] font-bold uppercase tracking-[0.1em] text-ivory disabled:opacity-50"
      style={{ borderColor: `${tone}4d`, background: `${tone}1a` }}
    >
      {icon}
      {label}
    </button>
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
