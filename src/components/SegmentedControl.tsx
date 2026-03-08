

interface Option {
  value: string
  label: string
}

interface SegmentedControlProps {
  id: string
  label?: string
  options: Option[]
  value: string
  onChange: (v: string) => void
  accent?: 'blue' | 'magenta' | 'cyan' | 'amber'
}

const ACTIVE_STYLES = {
  blue: 'bg-blue-700 text-white',
  magenta: 'bg-pink-700 text-white',
  cyan: 'bg-cyan-700 text-white',
  amber: 'bg-amber-700 text-white',
}

export function SegmentedControl({
  id,
  label,
  options,
  value,
  onChange,
  accent = 'blue',
}: SegmentedControlProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
          {label}
        </label>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${id}-label` : undefined}
        className="flex rounded overflow-hidden border border-zinc-700 bg-zinc-800"
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 text-xs font-medium min-h-[44px] transition-colors ${
              value === opt.value
                ? ACTIVE_STYLES[accent]
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
