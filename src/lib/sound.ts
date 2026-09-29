/**
 * Tiny synthesised sound kit — no audio files to download, nothing autoplays.
 * Everything is silent until the guest turns sound on.
 */
let ctx: AudioContext | null = null
let master: GainNode | null = null
let ambience: { stop: () => void } | null = null
let enabled = false

function ac() {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  return ctx
}

function tone(freq: number, dur = 0.5, type: OscillatorType = 'sine', gain = 0.12, delay = 0) {
  if (!enabled) return
  const c = ac()
  const t = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master!)
  o.start(t)
  o.stop(t + dur + 0.05)
}

function noise(dur = 0.8, from = 400, to = 2400, gain = 0.08) {
  if (!enabled) return
  const c = ac()
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 0.8
  f.frequency.setValueAtTime(from, c.currentTime)
  f.frequency.exponentialRampToValueAtTime(to, c.currentTime + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0, c.currentTime)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + dur * 0.3)
  g.gain.linearRampToValueAtTime(0, c.currentTime + dur)
  src.connect(f).connect(g).connect(master!)
  src.start()
}

function startAmbience() {
  const c = ac()
  const g = c.createGain()
  g.gain.value = 0
  g.gain.linearRampToValueAtTime(0.035, c.currentTime + 2)
  const oscs = [110, 164.8, 220.5].map((f) => {
    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    o.connect(g)
    o.start()
    return o
  })
  g.connect(master!)
  return {
    stop() {
      g.gain.linearRampToValueAtTime(0, c.currentTime + 0.6)
      oscs.forEach((o) => o.stop(c.currentTime + 0.7))
    },
  }
}

export const sound = {
  get enabled() {
    return enabled
  },
  setEnabled(on: boolean) {
    enabled = on
    if (on) {
      ac().resume()
      ambience ??= startAmbience()
      tone(660, 0.4, 'sine', 0.06)
    } else {
      ambience?.stop()
      ambience = null
    }
  },
  tap: () => tone(880, 0.18, 'sine', 0.06),
  select: () => {
    tone(740, 0.5, 'sine', 0.08)
    tone(1108, 0.6, 'sine', 0.05, 0.06)
  },
  wrong: () => tone(196, 0.3, 'triangle', 0.06),
  reveal: () => noise(1.1, 300, 3200, 0.06),
  sizzle: () => noise(1.4, 2500, 5000, 0.05),
  success: () => [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(f, 0.9, 'sine', 0.07, i * 0.09)),
  heart: () => tone(988, 0.25, 'sine', 0.07),
  reward: () => {
    noise(1.5, 200, 4000, 0.05)
    ;[392, 523.3, 659.3, 784, 1046.5, 1318.5].forEach((f, i) => tone(f, 1.4, 'sine', 0.06, 0.2 + i * 0.11))
  },
}

/** Haptic-style nudge on devices that support it (Android). Silent elsewhere. */
export function haptic(ms: number | number[] = 8) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* unsupported */
  }
}
