import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Optional ambient tone. Off by default. The story works fully without sound.
 */
export function AmbientToggle() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    return () => {
      void ctxRef.current?.close()
      ctxRef.current = null
    }
  }, [])

  async function toggle() {
    if (on) {
      await ctxRef.current?.close().catch(() => undefined)
      ctxRef.current = null
      setOn(false)
      return
    }

    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 380

      const gain = ctx.createGain()
      gain.gain.value = 0

      const oscA = ctx.createOscillator()
      oscA.type = 'sine'
      oscA.frequency.value = 110
      const oscB = ctx.createOscillator()
      oscB.type = 'sine'
      oscB.frequency.value = 164.8

      oscA.connect(filter)
      oscB.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      oscA.start()
      oscB.start()
      gain.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 1.4)

      ctxRef.current = ctx
      setOn(true)
    } catch {
      setOn(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'}
      className="flex h-9 w-9 items-center justify-center text-ivory-muted transition-colors duration-300 hover:text-ivory"
    >
      {on ? (
        <Volume2 className="h-4 w-4" strokeWidth={1.4} />
      ) : (
        <VolumeX className="h-4 w-4" strokeWidth={1.4} />
      )}
    </button>
  )
}
