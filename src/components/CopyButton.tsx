import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // fallback: ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors min-h-[32px] ${className}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}
