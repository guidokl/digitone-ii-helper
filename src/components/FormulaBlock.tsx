import { useState } from 'react'

interface FormulaBlockProps {
  children: React.ReactNode
}

export function FormulaBlock({ children }: FormulaBlockProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 py-1"
        aria-expanded={open}
      >
        <span>{open ? '▾' : '▸'}</span>
        How it works
      </button>
      {open && (
        <div className="mt-1 p-3 bg-zinc-900 rounded text-xs mono text-zinc-400 leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      )}
    </div>
  )
}
