

interface ChipGroupProps {
  label?: string
  values: (string | number)[]
  active?: string | number
  onSelect: (v: string) => void
  accent?: 'blue' | 'magenta' | 'cyan' | 'amber'
}

const CHIP_ACTIVE = {
  blue: 'bg-blue-700 text-white',
  magenta: 'bg-pink-700 text-white',
  cyan: 'bg-cyan-700 text-white',
  amber: 'bg-amber-700 text-white',
}

export function ChipGroup({ label, values, active, onSelect, accent = 'blue' }: ChipGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
      )}
      <div className="flex flex-wrap gap-1">
        {values.map((v) => {
          const isActive = String(v) === String(active)
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelect(String(v))}
              className={`px-2 py-1 rounded text-xs mono min-h-[32px] transition-colors ${
                isActive
                  ? CHIP_ACTIVE[accent]
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}
