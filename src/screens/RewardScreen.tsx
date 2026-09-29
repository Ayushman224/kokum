import { motion } from 'framer-motion'
import { Check, Clock, Lock } from 'lucide-react'
import { MagneticButton, Particles } from '../ui/Effects'
import { maxDiscount, rewardRules } from '../data/restaurant'
import { useStore } from '../state/store'

const ease = [0.16, 1, 0.3, 1] as const

/** Show to staff before paying. Confirmed savings + items staff must verify at the table. */
export default function RewardScreen() {
  const { rewards, confirmed, potential, rewardCode, go } = useStore()
  const pending = potential - confirmed

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-ink no-scrollbar">
      <Particles count={14} />
      <div className="relative flex min-h-full flex-col items-center px-6 pb-7" style={{ paddingTop: 'calc(var(--top) + 58px)' }}>
        <motion.div
          className="shimmer relative w-full overflow-hidden rounded-[26px] bg-gradient-to-b from-[#f5ecdc] to-[#e6d5b8] px-5 pb-5 pt-6 text-center text-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)]"
          initial={{ y: 60, opacity: 0, rotateX: 30 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1.1, ease }}
        >
          <div className="font-serif text-[14px] tracking-[0.5em] text-ink/80">KOKUM</div>
          <div className="eyebrow mt-3 text-[9px] text-kokum">Show this screen to staff</div>
          <div className="display mt-1 text-[84px] italic leading-none">
            {potential}%<span className="ml-1 align-top text-[28px] not-italic">off</span>
          </div>
          <div className="mt-1 text-[12px] text-ink/60">
            {pending > 0 ? `${confirmed}% confirmed · ${pending}% for staff to verify` : `Confirmed on your bill today`}
          </div>

          <div className="my-4 border-t-2 border-dashed border-ink/15" />
          <ul className="space-y-2 text-left">
            {rewardRules.map((r) => {
              const s = rewards[r.id]
              return (
                <li key={r.id} className="flex items-center gap-3">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${s === 'earned' ? 'bg-emerald-600 text-white' : s === 'pending' ? 'bg-amber-500/90 text-white' : 'bg-ink/10 text-ink/40'}`}>
                    {s === 'earned' ? <Check className="h-4 w-4" /> : s === 'pending' ? <Clock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-semibold">{r.title}</span>
                    <span className="block text-[11px] text-ink/55">{s === 'earned' ? 'Confirmed' : s === 'pending' ? (r.id === 'likes' ? 'Staff check 10 likes on your post' : 'Show your post to staff') : r.how}</span>
                  </span>
                  <span className={`text-[14px] font-bold ${s === 'locked' ? 'text-ink/30' : 'text-ink'}`}>+{r.percent}%</span>
                </li>
              )
            })}
          </ul>
          <div className="my-4 border-t-2 border-dashed border-ink/15" />
          <div className="font-mono text-[20px] font-semibold tracking-[0.12em]">{rewardCode}</div>
          <p className="mt-2 text-[10px] text-ink/45">Up to {maxDiscount}% off in total. Valid today, before payment. Prototype code.</p>
        </motion.div>

        <motion.div className="mt-auto w-full pt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <MagneticButton className="w-full" variant="ghost" onClick={() => go('finale')}>
            Done
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  )
}
