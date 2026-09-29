import type { ReactNode } from 'react'

type ScreenProps = {
  children: ReactNode
  className?: string
}

export function Screen({ children, className = '' }: ScreenProps) {
  return (
    <div
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}
