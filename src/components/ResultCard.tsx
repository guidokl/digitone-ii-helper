

interface ResultRowProps {
  label: string
  value: string
  subValue?: string
}

export function ResultRow({ label, value, subValue }: ResultRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-400 flex-shrink-0">{label}</span>
      <div className="text-right">
        <span className="mono text-sm text-zinc-100 font-medium">{value}</span>
        {subValue && <span className="text-xs text-zinc-500 ml-2">{subValue}</span>}
      </div>
    </div>
  )
}

interface ResultCardProps {
  title?: string
  children: React.ReactNode
  className?: string
  accent?: 'blue' | 'magenta' | 'cyan' | 'amber'
}

const ACCENT_STYLES = {
  blue: 'border-l-blue-500',
  magenta: 'border-l-pink-500',
  cyan: 'border-l-cyan-500',
  amber: 'border-l-amber-500',
}

export function ResultCard({ title, children, className = '', accent }: ResultCardProps) {
  const accentClass = accent ? `border-l-2 ${ACCENT_STYLES[accent]}` : ''
  return (
    <div className={`bg-zinc-900 rounded-lg p-3 ${accentClass} ${className}`}>
      {title && <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">{title}</div>}
      {children}
    </div>
  )
}
