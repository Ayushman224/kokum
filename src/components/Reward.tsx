import { useState } from 'react'
import { brand, dishData } from '../data/dishData'
import { createRewardCode } from '../lib/reward'
import { Screen } from './Screen'

type RewardProps = {
  code: string
  onContinue: () => void
}

export function Reward({ code, onContinue }: RewardProps) {
  const [issued] = useState(() => code || createRewardCode(dishData.reward.codePrefix))
  const display = code || issued
  const [copied, setCopied] = useState(false)
  const [staff, setStaff] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(display)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Screen className="bg-charcoal">
      <button
        type="button"
        onClick={onContinue}
        className="flex h-full w-full flex-col items-center justify-center px-8 text-center"
        aria-label="Continue after viewing reward"
      >
        <p className="font-serif text-xs tracking-[0.4em] text-ivory">{brand.name}</p>
        <p className="mt-8 text-[10px] tracking-[0.3em] text-copper uppercase">
          {dishData.reward.heading}
        </p>
        <p className={`mt-4 font-serif text-ivory ${staff ? 'text-7xl' : 'text-6xl'}`}>
          {dishData.reward.offerLabel}
        </p>
        <p className={`mt-10 font-serif tracking-[0.18em] text-copper ${staff ? 'text-4xl' : 'text-2xl'}`}>
          {display}
        </p>
        <p className="mt-3 text-[10px] text-ivory-muted">{dishData.reward.prototypeNote}</p>
      </button>

      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => void copy()}
          className="text-[11px] tracking-[0.26em] text-copper uppercase"
        >
          {copied ? 'Copied' : dishData.reward.copyCta}
        </button>
        <button
          type="button"
          onClick={() => setStaff((value) => !value)}
          className="text-[11px] tracking-[0.26em] text-ivory-muted uppercase"
        >
          {dishData.reward.staffCta}
        </button>
      </div>
    </Screen>
  )
}
