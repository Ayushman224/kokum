import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MagneticButton, Particles } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { prototypeRewardService } from '../../lib/reward'
import { copyText } from '../../lib/share'
import { Check, ChevronDown, Copy, UtensilsCrossed, X } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

/** SCENE 12 — the digital coupon. Structured so a backend can issue + validate it later (see lib/reward.ts). */
export default function Reward() {
  const { reward, setReward, go, showToast } = useExperience()
  const [copied, setCopied] = useState(false)
  const [staff, setStaff] = useState(false)
  const rs = dishData.rewardSettings

  // Arriving directly (presenter jump) — issue a code so the scene is never empty.
  useEffect(() => {
    if (!reward) prototypeRewardService.issue(rs).then(setReward)
  }, [reward, rs, setReward])

  const copy = async () => {
    if (!reward) return
    const ok = await copyText(reward.code)
    setCopied(ok)
    showToast(ok ? 'Code copied' : 'Could not copy on this device')
  }

  return (
    <div className="absolute inset-0 overflow-clip bg-ink">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 45% at 50% 40%, rgba(216,176,106,.18), transparent 70%)' }} />
      <Particles count={16} />

      <div className="relative flex h-full flex-col items-center px-7 pb-[28px] pt-[84px]">
        {/* ticket */}
        <motion.div
          className="relative w-full max-w-[320px]"
          initial={{ y: 80, opacity: 0, rotateX: 40 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1.2, ease }}
          style={{ perspective: 800 }}
        >
          <div
            className="shimmer relative overflow-hidden rounded-[22px] bg-gradient-to-b from-[#f5ecdc] to-[#e6d5b8] px-6 pb-6 pt-8 text-center text-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)]"
            style={{
              WebkitMask: 'radial-gradient(circle 14px at 0 62%, transparent 98%, black) left / 51% 100% no-repeat, radial-gradient(circle 14px at 100% 62%, transparent 98%, black) right / 51% 100% no-repeat',
              mask: 'radial-gradient(circle 14px at 0 62%, transparent 98%, black) left / 51% 100% no-repeat, radial-gradient(circle 14px at 100% 62%, transparent 98%, black) right / 51% 100% no-repeat',
            }}
          >
            <div className="font-serif text-[15px] tracking-[0.5em] text-ink/80">KOKUM</div>
            <div className="eyebrow mt-4 text-[9px] text-kokum">You've unlocked</div>
            <div className="display mt-1 text-[88px] italic leading-none text-ink">
              {rs.percentOff}%<span className="ml-2 align-top text-[34px] not-italic">off</span>
            </div>
            <div className="mt-1 text-[12px] text-ink/60">on your bill today</div>
            {/* perforation */}
            <div className="my-6 border-t-2 border-dashed border-ink/20" />
            <div className="eyebrow text-[9px] text-ink/50">Your code</div>
            <div className="mt-2 font-mono text-[24px] font-semibold tracking-[0.12em] text-ink" aria-live="polite">
              {reward?.code ?? '······'}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/25 text-[11px] font-bold uppercase tracking-[0.16em] text-ink"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy code'}
              </button>
              <button
                type="button"
                onClick={() => setStaff(true)}
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink text-[11px] font-bold uppercase tracking-[0.16em] text-ivory"
              >
                <UtensilsCrossed className="h-4 w-4" aria-hidden="true" /> Show staff
              </button>
            </div>
            <p className="mt-4 text-[10px] text-ink/45">Prototype reward code.</p>
          </div>
        </motion.div>

        <motion.div className="mt-auto flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          <p className="font-serif text-[18px] italic text-ivory/70">Before you go — one small thing.</p>
          <MagneticButton variant="ghost" onClick={() => go('feedback')}>
            Rate your experience <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* show-to-staff: high-contrast, live (animated) so a screenshot is obvious */}
      <AnimatePresence>
        {staff && reward && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-ivory px-8 text-center text-ink"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Reward code for staff"
          >
            <button type="button" onClick={() => setStaff(false)} className="absolute right-4 top-14 grid h-11 w-11 place-items-center rounded-full border border-ink/20" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <div className="font-serif text-[16px] tracking-[0.5em]">KOKUM</div>
            <div className="eyebrow mt-8 text-kokum">Staff: apply {rs.percentOff}% off</div>
            <div className="mt-4 font-mono text-[34px] font-bold tracking-[0.1em]">{reward.code}</div>
            <div className="mt-6 flex items-center gap-2 text-[12px] text-ink/60">
              <motion.span className="h-2.5 w-2.5 rounded-full bg-emerald-600" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              Live · issued {new Date(reward.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="mt-8 max-w-[260px] text-[11px] leading-snug text-ink/50">{rs.terms}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
