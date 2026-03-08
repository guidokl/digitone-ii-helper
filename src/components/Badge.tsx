

export type BadgeVariant = 'exact' | 'interpolated' | 'extrapolated' | 'estimated' | 'heuristic' | 'warning'

const BADGE_STYLES: Record<BadgeVariant, string> = {
  exact: 'bg-zinc-700 text-zinc-300',
  interpolated: 'bg-blue-900/60 text-blue-300',
  extrapolated: 'bg-amber-900/60 text-amber-300',
  estimated: 'bg-amber-900/60 text-amber-300',
  heuristic: 'bg-purple-900/60 text-purple-300',
  warning: 'bg-red-900/60 text-red-300',
}

const BADGE_LABELS: Record<BadgeVariant, string> = {
  exact: 'Exact',
  interpolated: 'Interpolated',
  extrapolated: 'Extrapolated',
  estimated: 'Estimated',
  heuristic: 'Heuristic',
  warning: 'Warning',
}

interface BadgeProps {
  variant: BadgeVariant
  label?: string
  className?: string
}

export function Badge({ variant, label, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mono ${BADGE_STYLES[variant]} ${className}`}
    >
      {label ?? BADGE_LABELS[variant]}
    </span>
  )
}
