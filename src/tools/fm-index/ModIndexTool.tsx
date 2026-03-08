import { useState, useEffect, useRef } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { calculateModIndex } from './modIndexCalc'
import type { ModIndexResult, ModIndexBand } from './modIndexCalc'
import { validateRange, validatePositive } from '../../lib/validation'
import { storageGet, storageSet } from '../../lib/storage'

interface State {
  mode: 'direct' | 'computed'
  index: string
  deviation: string
  modFreq: string
}

const DEFAULT: State = { mode: 'direct', index: '2', deviation: '1000', modFreq: '500' }

const BAND_COLORS: Record<ModIndexBand, { track: string; label: string }> = {
  'very-mild': { track: 'bg-green-600', label: 'text-green-400' },
  clear: { track: 'bg-blue-600', label: 'text-blue-400' },
  complex: { track: 'bg-orange-500', label: 'text-orange-400' },
  dense: { track: 'bg-red-600', label: 'text-red-400' },
}

const BAND_ORDER: ModIndexBand[] = ['very-mild', 'clear', 'complex', 'dense']
const BAND_THRESHOLDS = [0, 0.5, 2, 5]
const MAX_SCALE = 10

export function ModIndexTool() {
  const [state, setState] = useState<State>(() => storageGet('fm-index', DEFAULT))
  const [result, setResult] = useState<ModIndexResult | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    storageSet('fm-index', state)
    calculate()
  }, [state])

  function set(field: keyof State, val: string) {
    setState((s) => ({ ...s, [field]: val }))
  }

  function calculate() {
    try {
      if (state.mode === 'direct') {
        const v = validateRange(state.index, 0, 1000, 'Index')
        if (v.valid) setResult(calculateModIndex({ index: v.value }))
        else setResult(null)
      } else {
        const dv = validatePositive(state.deviation, 'Deviation')
        const mv = validatePositive(state.modFreq, 'Modulator freq')
        if (dv.valid && mv.valid) {
          setResult(calculateModIndex({ deviation: dv.value, modulatorFrequency: mv.value }))
        } else {
          setResult(null)
        }
      }
    } catch {
      setResult(null)
    }
  }

  // Position of current index on the band scale (0..1 over 0..MAX_SCALE)
  const idx = result?.index ?? 0
  const pct = Math.min((idx / MAX_SCALE) * 100, 100)

  function handleBandPointer(e: React.PointerEvent<HTMLDivElement>) {
    if (e.type === 'pointerdown') {
      e.currentTarget.setPointerCapture(e.pointerId)
    } else if (e.buttons === 0) {
      return
    }
    const bar = barRef.current
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const fraction = Math.max(0, Math.min(1, x / rect.width))
    const newIdx = parseFloat((fraction * MAX_SCALE).toFixed(2))
    setState((s) => ({ ...s, mode: 'direct', index: String(newIdx) }))
  }

  return (
    <ToolCard id="fm-index" title="Modulation Index Helper" accent="magenta">
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="heuristic" />
          <span className="text-xs text-zinc-500">Heuristic, not exact Digitone parameter mapping</span>
        </div>

        <div className="flex rounded overflow-hidden border border-zinc-700 bg-zinc-800">
          {(['direct', 'computed'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set('mode', m)}
              className={`flex-1 py-2 text-xs min-h-[44px] transition-colors ${
                state.mode === m ? 'bg-pink-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {m === 'direct' ? 'Direct index' : 'From deviation'}
            </button>
          ))}
        </div>

        {state.mode === 'direct' ? (
          <NumberField id="mod-idx" label="Modulation index (I)" value={state.index}
            onChange={(v) => set('index', v)} min={0} step={0.1} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="mod-dev" label="Deviation (Hz)" value={state.deviation}
              onChange={(v) => set('deviation', v)} min={0} step={10} />
            <NumberField id="mod-mf" label="Modulator freq (Hz)" value={state.modFreq}
              onChange={(v) => set('modFreq', v)} min={0.01} step={10} />
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm mono text-zinc-100 font-medium">I = {result.index.toFixed(3)}</span>
              <span className={`text-sm font-medium ${BAND_COLORS[result.band].label}`}>
                {result.bandLabel}
              </span>
            </div>

            {/* Draggable color band scale */}
            <div
              ref={barRef}
              onPointerDown={handleBandPointer}
              onPointerMove={handleBandPointer}
              className="cursor-ew-resize touch-none select-none"
              role="slider"
              aria-label="Modulation index scale — drag to set value"
              aria-valuemin={0}
              aria-valuemax={MAX_SCALE}
              aria-valuenow={idx}
            >
              <div className="flex h-3 rounded overflow-hidden w-full">
                {BAND_ORDER.map((b, i) => {
                  const next = i + 1 < BAND_THRESHOLDS.length ? BAND_THRESHOLDS[i + 1] : MAX_SCALE
                  const width = ((Math.min(next, MAX_SCALE) - BAND_THRESHOLDS[i]) / MAX_SCALE) * 100
                  return (
                    <div key={b} className={`${BAND_COLORS[b].track} opacity-60`} style={{ width: `${width}%` }} />
                  )
                })}
              </div>
              {/* Marker */}
              <div className="relative h-3 mt-0.5">
                <div
                  className="absolute w-2 h-3 bg-white rounded-sm shadow"
                  style={{ left: `calc(${pct}% - 4px)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-600 mono mt-1">
                <span>0</span>
                <span>0.5</span>
                <span>2</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300">{result.interpretation}</p>

            <div className="bg-zinc-900 rounded p-2 space-y-1">
              {BAND_ORDER.map((b) => (
                <div key={b} className={`flex items-center gap-2 text-xs ${b === result.band ? BAND_COLORS[b].label : 'text-zinc-600'}`}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: b === result.band ? 'currentColor' : '#3f3f46' }} />
                  <span>{b === 'very-mild' ? '0 – 0.5' : b === 'clear' ? '0.5 – 2' : b === 'complex' ? '2 – 5' : '5+'}</span>
                  <span className="capitalize">{b.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <FormulaBlock>
{`If deviation + modulator freq provided:
  I = deviation / modulatorFrequency

Heuristic bands:
  0 – 0.5: Very mild / almost subtractive
  0.5 – 2: Clear brightness, controlled
  2 – 5:   Complex / metallic territory
  5+:      Dense / noisy / unstable pitch`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}
