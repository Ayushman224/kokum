import { useState } from 'react'
import { brand, dishData } from '../data/dishData'
import { Screen } from './Screen'

type DishExplorerProps = {
  onFinish: () => void
}

const RING = [
  { id: '02', x: 0, y: -120, label: 'STORY 02' },
  { id: '03', x: -110, y: 20, label: 'STORY 03' },
  { id: '04', x: 110, y: 20, label: 'STORY 04' },
]

export function DishExplorer({ onFinish }: DishExplorerProps) {
  const [message, setMessage] = useState<string | null>(null)

  return (
    <Screen className="bg-charcoal">
      <div className="flex h-full flex-col px-6 pt-16 pb-10">
        <h2 className="font-serif text-[34px] leading-[0.95] text-ivory">
          {dishData.explorerHeading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-4 font-serif text-xl text-copper">
          {String(dishData.discoveredCount).padStart(2, '0')} /{' '}
          {String(dishData.totalStories).padStart(2, '0')}
        </p>

        <div className="relative mx-auto mt-8 h-[280px] w-[280px]">
          <button
            type="button"
            onClick={onFinish}
            className="absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-copper/15 ring-1 ring-copper/40"
            aria-label="Close the evening"
          >
            <span className="font-serif text-[11px] tracking-[0.28em] text-ivory">
              {brand.name}
            </span>
            <span className="mt-1 text-[8px] tracking-[0.16em] text-copper uppercase">
              Your dish
            </span>
          </button>

          {RING.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => setMessage(dishData.scanAnother)}
              className="absolute flex w-20 flex-col items-center"
              style={{
                left: `calc(50% + ${node.x}px)`,
                top: `calc(50% + ${node.y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="h-3 w-3 rounded-full border border-copper/50" />
              <span className="mt-2 text-[9px] tracking-[0.14em] text-ivory-muted uppercase">
                {node.label}
              </span>
              <span className="text-[8px] tracking-[0.12em] text-ivory-muted/70 uppercase">
                Coming soon
              </span>
            </button>
          ))}
        </div>

        <p className="mt-auto text-center font-serif text-base text-ivory-muted italic">
          {message ?? dishData.explorerPrompt}
        </p>
      </div>
    </Screen>
  )
}
