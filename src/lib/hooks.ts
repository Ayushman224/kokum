import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Advances through timed stages: returns 0,1,2… as each delay (ms, cumulative) elapses. */
export function useStages(delays: number[], active = true) {
  const [stage, setStage] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!active) return
    const k = reduce ? 0.35 : 1
    const timers = delays.map((d, i) => window.setTimeout(() => setStage((s) => Math.max(s, i + 1)), d * k))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce])
  return [stage, setStage] as const
}

/** Runs fn once after ms when `when` becomes true. */
export function useAfter(when: boolean, ms: number, fn: () => void) {
  const ref = useRef(fn)
  ref.current = fn
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!when) return
    const t = window.setTimeout(() => ref.current(), reduce ? Math.min(ms, 900) : ms)
    return () => clearTimeout(t)
  }, [when, ms, reduce])
}

/** Is a client point inside an element's box (optionally padded)? */
export function pointInside(el: Element | null, x: number, y: number, pad = 0) {
  if (!el) return false
  const r = el.getBoundingClientRect()
  return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad
}
