/**
 * Click sound only — a soft, synthesised tap (no audio files).
 * Browsers allow audio only after a real tap, so it switches on with the guest's first touch.
 * The speaker icon mutes it; the choice is remembered on this device.
 */
let ctx: AudioContext | null = null
let enabled = false

const MUTE_KEY = 'kokum.muted'

function ac() {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  return ctx
}

function click(pitch = 1180, gain = 0.16) {
  if (!enabled) return
  const c = ac()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(pitch, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(pitch * 0.53, c.currentTime + 0.07)
  g.gain.setValueAtTime(0.0001, c.currentTime)
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.12)
  o.connect(g).connect(c.destination)
  o.start()
  o.stop(c.currentTime + 0.15)
}

export const sound = {
  get enabled() {
    return enabled
  },
  /** Guest muted on a previous visit? */
  get prefersMuted() {
    try {
      return localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      return false
    }
  },
  setEnabled(on: boolean) {
    enabled = on
    try {
      localStorage.setItem(MUTE_KEY, on ? '0' : '1')
    } catch {
      /* ignore */
    }
    if (on) ac().resume()
  },
  tap: () => click(),
  // Every button already clicks (see SoundBoot in App.tsx), so moments stay silent — one quiet sound only.
  select: () => {},
  wrong: () => {},
  reveal: () => {},
  sizzle: () => {},
  success: () => {},
  heart: () => {},
  reward: () => {},
}

/** Haptic-style nudge on devices that support it (Android). Silent elsewhere. */
export function haptic(ms: number | number[] = 8) {
  try {
    // Only after a real tap — browsers block (and log) vibration otherwise.
    if ((navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive === false) return
    navigator.vibrate?.(ms)
  } catch {
    /* unsupported */
  }
}
