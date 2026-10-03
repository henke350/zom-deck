import { useEffect, type ReactNode } from 'react'

interface DialogProps {
  readonly labelledBy: string
  readonly wide?: boolean
  /** Called when the player presses Escape. Leave out for dialogs that must be answered. */
  readonly onEscape?: () => void
  readonly children: ReactNode
}

/** A modal dialog over the game. */
export function Dialog({ labelledBy, wide, onEscape, children }: DialogProps) {
  useEffect(() => {
    if (!onEscape) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onEscape])

  return (
    <div className="overlay">
      <div
        className={`dialog${wide ? ' dialog-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>
  )
}
