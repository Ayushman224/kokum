import type { ReactNode } from 'react'
import { brand } from '../data/dishData'
import { AmbientToggle } from './AmbientToggle'
import { GrainOverlay } from './GrainOverlay'

type PhoneFrameProps = {
  children: ReactNode
  demoHearts: number
  onDemoHeart: () => void
  onRestart: () => void
}

export function PhoneFrame({
  children,
  demoHearts,
  onDemoHeart,
  onRestart,
}: PhoneFrameProps) {
  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden bg-[#050403]">
      <GrainOverlay />
      <div className="pointer-events-none absolute inset-x-0 top-8 hidden text-center lg:block">
        <p className="text-[10px] tracking-[0.42em] text-copper uppercase">
          {brand.productName}
        </p>
      </div>

      <div className="relative z-10 h-dvh w-full max-w-[430px] overflow-hidden bg-charcoal md:h-[min(844px,92dvh)] md:w-[390px] md:rounded-[28px] md:shadow-[0_40px_140px_rgba(0,0,0,0.72)] md:ring-1 md:ring-ivory/10">
        {children}
        <div className="pointer-events-auto absolute top-3 right-3 z-40 flex items-center gap-1 md:hidden">
          <AmbientToggle />
        </div>
      </div>

      <aside className="relative z-10 ml-14 hidden w-48 flex-col justify-center lg:flex">
        <p className="text-[10px] tracking-[0.32em] text-ivory-muted uppercase">
          Demo mode
        </p>
        <p className="mt-3 text-xs leading-relaxed text-ivory-muted">
          Simulated hearts for the owner walkthrough — not Instagram data.
        </p>
        <button
          type="button"
          onClick={onDemoHeart}
          className="mt-5 text-left text-[11px] tracking-[0.22em] text-copper uppercase"
        >
          +1 Heart · {demoHearts}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 text-left text-[11px] tracking-[0.22em] text-ivory-muted uppercase"
        >
          Restart
        </button>
        <div className="mt-8">
          <AmbientToggle />
        </div>
      </aside>
    </div>
  )
}
