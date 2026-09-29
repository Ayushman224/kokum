import { useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import IngredientIcon from './IngredientIcon'
import type { IconKey } from '../data/types'
import { sound, haptic } from '../lib/sound'

interface Props {
  label: string
  icon: IconKey
  /** Return true if the drop was accepted (token then hides). */
  onDrop: (x: number, y: number) => boolean | 'wrong'
  /** Keyboard / tap alternative to dragging. */
  onActivate: () => boolean | 'wrong'
  size?: number
  disabled?: boolean
  hidden?: boolean
  floatDelay?: number
}

/**
 * A draggable ingredient. Drag onto a target; tap/Enter works too so the game is
 * never gesture-only (accessibility + impatient guests).
 */
export default function DragToken({ label, icon, onDrop, onActivate, size = 72, disabled, hidden, floatDelay = 0 }: Props) {
  const controls = useAnimationControls()
  const [dragging, setDragging] = useState(false)
  const lastDragEnd = useRef(0)

  const reject = async () => {
    sound.wrong()
    haptic([20, 40, 20])
    await controls.start({ x: [0, -10, 10, -7, 7, 0], transition: { duration: 0.45 } })
  }

  const handle = (res: boolean | 'wrong') => {
    if (res === 'wrong') reject()
    else if (res) haptic(15)
  }

  return (
    <motion.div
      className="flex flex-col items-center"
      animate={hidden ? { opacity: 0, scale: 0.2 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: hidden ? 'none' : 'auto' }}
    >
      <motion.button
        type="button"
        aria-label={`${label}. Drag onto the target, or press to choose.`}
        disabled={disabled || hidden}
        drag={!disabled}
        dragSnapToOrigin
        dragElastic={0.9}
        dragMomentum={false}
        animate={controls}
        whileDrag={{ scale: 1.15, zIndex: 40 }}
        whileTap={{ scale: 1.06 }}
        onDragStart={() => {
          setDragging(true)
          sound.tap()
        }}
        onDragEnd={(_, info) => {
          setDragging(false)
          lastDragEnd.current = performance.now()
          handle(onDrop(info.point.x - window.scrollX, info.point.y - window.scrollY))
        }}
        onClick={() => {
          // a drag release also emits a click — ignore it
          if (!dragging && performance.now() - lastDragEnd.current > 300) handle(onActivate())
        }}
        className="relative z-10 touch-none rounded-full"
        style={{ width: size, height: size }}
      >
        <span className="floaty absolute inset-0 grid place-items-center rounded-full border border-gold/35 bg-gradient-to-b from-white/[0.09] to-white/[0.01] shadow-[0_12px_30px_-10px_rgba(0,0,0,.8)] backdrop-blur-md" style={{ ['--fdelay' as string]: `${-floatDelay}s` }}>
          <IngredientIcon icon={icon} className="h-[68%] w-[68%]" />
        </span>
      </motion.button>
      <span className="mt-2.5 whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ivory/75">{label}</span>
    </motion.div>
  )
}
