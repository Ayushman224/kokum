import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DishArt from '../ui/DishArt'
import { Particles, Steam } from '../ui/Effects'
import { dishData } from '../../data/dishData'
import { useExperience } from '../../experience/store'
import { useAfter } from '../../experience/hooks'
import { sound, haptic } from '../../lib/sound'

const ease = [0.16, 1, 0.3, 1] as const
const AUTO_COMPLETE = 0.5 // once half the veil is gone, the rest dissolves

/** SCENE 02 — the dish sits under a velvet veil; the guest wipes it away with a finger. */
export default function DishReveal() {
  const { next } = useExperience()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const strokes = useRef(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState(false)
  const doneRef = useRef(false)

  // Paint the veil
  useEffect(() => {
    const canvas = canvasRef.current!
    const wrap = wrapRef.current!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { width, height } = wrap.getBoundingClientRect()
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    const c = canvas.getContext('2d')!
    c.scale(dpr, dpr)

    const g = c.createRadialGradient(width / 2, height * 0.42, 10, width / 2, height * 0.42, height * 0.8)
    g.addColorStop(0, '#2a211d')
    g.addColorStop(0.5, '#171210')
    g.addColorStop(1, '#0b0908')
    c.fillStyle = g
    c.fillRect(0, 0, width, height)

    // velvet grain
    const img = c.getImageData(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14
      img.data[i] += n
      img.data[i + 1] += n
      img.data[i + 2] += n
    }
    c.putImageData(img, 0, 0)

    // engraved gold rings where the plate hides
    const cx = width / 2
    const cy = height * 0.42
    c.strokeStyle = 'rgba(216,176,106,.35)'
    c.lineWidth = 1
    for (const r of [width * 0.36, width * 0.34, width * 0.2]) {
      c.beginPath()
      c.arc(cx, cy, r, 0, Math.PI * 2)
      c.stroke()
    }
    c.fillStyle = 'rgba(216,176,106,.55)'
    c.font = '500 11px Manrope, sans-serif'
    c.textAlign = 'center'
    c.fillText('K  O  K  U  M', cx, cy + 4)
    // hairline rays
    c.strokeStyle = 'rgba(216,176,106,.08)'
    for (let a = 0; a < 48; a++) {
      const t = (a / 48) * Math.PI * 2
      c.beginPath()
      c.moveTo(cx + Math.cos(t) * width * 0.38, cy + Math.sin(t) * width * 0.38)
      c.lineTo(cx + Math.cos(t) * width * 0.6, cy + Math.sin(t) * width * 0.6)
      c.stroke()
    }
  }, [])

  const measure = useCallback(() => {
    const canvas = canvasRef.current!
    const c = canvas.getContext('2d')!
    const { width, height } = canvas
    const data = c.getImageData(0, 0, width, height).data
    let clear = 0
    let total = 0
    const step = Math.max(8, Math.floor(width / 40))
    // only measure the central band where the dish lives
    for (let y = Math.floor(height * 0.12); y < height * 0.78; y += step) {
      for (let x = Math.floor(width * 0.06); x < width * 0.94; x += step) {
        total++
        if (data[(y * width + x) * 4 + 3] < 40) clear++
      }
    }
    return clear / total
  }, [])

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width
    const x = (clientX - rect.left) * sx
    const y = (clientY - rect.top) * sx
    const c = canvas.getContext('2d')!
    c.globalCompositeOperation = 'destination-out'
    const radius = 46 * sx
    const from = last.current ?? { x, y }
    const dist = Math.hypot(x - from.x, y - from.y)
    const steps = Math.max(1, Math.ceil(dist / (radius / 3)))
    for (let i = 0; i <= steps; i++) {
      const px = from.x + ((x - from.x) * i) / steps
      const py = from.y + ((y - from.y) * i) / steps
      const g = c.createRadialGradient(px, py, 0, px, py, radius)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.6, 'rgba(0,0,0,.9)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = g
      c.beginPath()
      c.arc(px, py, radius, 0, Math.PI * 2)
      c.fill()
    }
    last.current = { x, y }
    if (++strokes.current % 6 === 0) {
      const p = measure()
      setProgress(p)
      if (p >= AUTO_COMPLETE) finish()
    }
  }

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setDone(true)
    setProgress(1)
    sound.reveal()
    sound.success()
    haptic([12, 30, 12])
  }

  useAfter(done, 3400, next)

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-clip bg-ink">
      {/* the dish, underneath */}
      <motion.div
        className="absolute left-1/2 top-[42%] w-[92%] -translate-x-1/2 -translate-y-1/2"
        animate={done ? { scale: 1.04 } : { scale: 1 }}
        transition={{ duration: 2.4, ease }}
      >
        <DishArt className="w-full" glow={done ? 1 : 0.3} />
        <Steam className="absolute left-[48%] top-[-18%] w-[46%]" />
      </motion.div>
      {done && <Particles count={22} />}

      {/* veil */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        role="img"
        aria-label="A velvet veil covers your dish. Swipe across the screen to reveal it."
        animate={{ opacity: done ? 0 : 1 }}
        transition={{ duration: 1.2, ease }}
        style={{ pointerEvents: done ? 'none' : 'auto' }}
        onPointerDown={(e) => {
          drawing.current = true
          last.current = null
          setTouched(true)
          ;(e.target as Element).setPointerCapture?.(e.pointerId)
          scratch(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => drawing.current && scratch(e.clientX, e.clientY)}
        onPointerUp={() => {
          drawing.current = false
          last.current = null
          const p = measure()
          setProgress(p)
          if (p >= AUTO_COMPLETE) finish()
        }}
      />

      {/* veil copy */}
      <AnimatePresence>
        {!done && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[9%] flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: touched ? Math.max(0, 1 - progress * 2.2) : 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="display text-[44px] text-ivory">
              Your dish
              <br />
              <span className="gold-text italic">is waiting.</span>
            </h2>
            <div className="relative mt-6 h-10 w-44">
              {!touched && (
                <span className="swipe-hint absolute left-1/2 top-1/2 -ml-4 -mt-4 h-8 w-8 rounded-full border border-gold/70 bg-gold/20 shadow-[0_0_20px_rgba(216,176,106,.6)]" />
              )}
              <span className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            </div>
            <p className="eyebrow mt-2 text-ivory/60">Swipe to reveal</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* reveal meter */}
      {!done && touched && (
        <div className="pointer-events-none absolute right-5 top-20 text-right" aria-live="polite">
          <div className="eyebrow text-gold/80">{Math.round((progress / AUTO_COMPLETE) * 100)}%</div>
        </div>
      )}

      {/* keyboard / assistive alternative */}
      {!done && (
        <button type="button" onClick={finish} className="sr-only-focusable absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 px-4 py-2 text-xs text-ivory">
          Reveal the dish
        </button>
      )}

      {/* title */}
      <AnimatePresence>
        {done && (
          <motion.div className="absolute inset-x-0 bottom-[7%] text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <motion.div className="eyebrow mb-3 text-gold" initial={{ opacity: 0, letterSpacing: '0.8em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.4, delay: 0.5 }}>
              {dishData.subtitle}
            </motion.div>
            <h2 className="display text-[46px] text-ivory" aria-label={dishData.name}>
              {dishData.nameLines.map((l, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className={`block ${l === '&' ? 'gold-text my-[-4px] text-[34px] italic' : ''}`}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.7 + i * 0.14, ease }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
