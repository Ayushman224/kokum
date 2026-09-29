import { dishData } from '../data/dishData'
import { DragToken } from './DragToken'
import { Screen } from './Screen'

type BuildYourBiteProps = {
  selected: string[]
  onDrop: (id: string) => void
  onGenerate: () => void
}

export function BuildYourBite({ selected, onDrop, onGenerate }: BuildYourBiteProps) {
  const ready = selected.length >= dishData.biteNeed

  return (
    <Screen className="bg-charcoal">
      <div className="flex h-full flex-col px-6 pt-16 pb-10">
        <h2 className="font-serif text-5xl tracking-tight text-ivory">
          {dishData.biteHeading}
        </h2>
        <p className="mt-3 font-serif text-lg text-ivory-muted italic">
          {dishData.bitePrompt}
        </p>

        <div
          data-drop="plate"
          className="relative mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full bg-charcoal-soft ring-1 ring-ivory/15"
        >
          <span className="absolute text-[10px] tracking-[0.24em] text-ivory-muted uppercase">
            Plate
          </span>
          <div className="relative flex flex-wrap items-center justify-center gap-1 px-6">
            {selected.map((id) => {
              const item = dishData.biteItems.find((entry) => entry.id === id)
              return (
                <span key={id} className="text-2xl" aria-hidden>
                  {item?.symbol}
                </span>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {dishData.biteItems.map((item) => {
            const used = selected.includes(item.id)
            return (
              <DragToken
                key={item.id}
                ariaLabel={`Add ${item.name} to the plate`}
                dropSelector="[data-drop='plate']"
                disabled={used}
                onHit={() => onDrop(item.id)}
                onTap={() => onDrop(item.id)}
                className={used ? 'opacity-25' : ''}
              >
                <span className="flex w-16 flex-col items-center">
                  <span className="text-2xl">{item.symbol}</span>
                  <span className="mt-1 text-[9px] tracking-[0.14em] text-ivory-muted uppercase">
                    {item.name}
                  </span>
                </span>
              </DragToken>
            )
          })}
        </div>

        <div className="mt-auto min-h-12 text-center">
          {ready ? (
            <button
              type="button"
              onClick={onGenerate}
              className="text-[11px] tracking-[0.28em] text-copper uppercase"
            >
              {dishData.biteCta}
            </button>
          ) : (
            <p className="text-[11px] tracking-[0.18em] text-ivory-muted uppercase">
              Place {dishData.biteNeed} on the plate
            </p>
          )}
        </div>
      </div>
    </Screen>
  )
}
