import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'

type DragTokenProps = {
  children: ReactNode
  disabled?: boolean
  className?: string
  ariaLabel: string
  dropSelector: string
  onMiss?: () => void
  onHit: () => void
  onTap?: () => void
}

export function DragToken({
  children,
  disabled,
  className = '',
  ariaLabel,
  dropSelector,
  onMiss,
  onHit,
  onTap,
}: DragTokenProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const origin = useRef({ x: 0, y: 0 })

  function down(event: ReactPointerEvent<HTMLButtonElement>) {
    if (disabled) return
    dragging.current = true
    origin.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function move(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return
    setOffset({
      x: event.clientX - origin.current.x,
      y: event.clientY - origin.current.y,
    })
  }

  function up(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return
    dragging.current = false
    const target = document.querySelector(dropSelector)
    const rect = target?.getBoundingClientRect()
    const hit = Boolean(
      rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom,
    )
    const distance = Math.abs(offset.x) + Math.abs(offset.y)
    if (hit) {
      onHit()
      return
    }
    setOffset({ x: 0, y: 0 })
    if (distance < 12) {
      onTap?.()
      return
    }
    onMiss?.()
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className={`touch-none ${className}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={() => {
        dragging.current = false
        setOffset({ x: 0, y: 0 })
      }}
    >
      {children}
    </button>
  )
}
