import { SCENES } from '../data/dishData'

type ProgressIndicatorProps = {
  index: number
}

export function ProgressIndicator({ index }: ProgressIndicatorProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center gap-1 px-8 pt-[max(0.85rem,env(safe-area-inset-top))]"
      aria-hidden
    >
      {SCENES.map((scene, i) => (
        <span
          key={scene.id}
          className={`h-1 w-1 rounded-full ${
            i <= index ? 'bg-copper' : 'bg-ivory/20'
          }`}
        />
      ))}
    </div>
  )
}
