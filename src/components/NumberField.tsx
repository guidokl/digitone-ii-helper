
import { ErrorText } from './ErrorText'

interface NumberFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  step?: number
  error?: string
  unit?: string
  className?: string
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  error,
  unit,
  className = '',
}: NumberFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm mono text-zinc-100 focus:outline-none focus:border-zinc-500 min-h-[44px]"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {unit && <span className="text-zinc-500 text-xs whitespace-nowrap">{unit}</span>}
      </div>
      <ErrorText message={error} />
    </div>
  )
}
