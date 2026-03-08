import { useState, useEffect, useCallback } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { ResultCard, ResultRow } from '../../components/ResultCard'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { ChipGroup } from '../../components/ChipGroup'
import { calculatePatternLoop } from './patternCalc'
import type { PatternLoopResult, TrackInput } from './patternCalc'
import { validateBpm, validatePositiveInt } from '../../lib/validation'
import { formatBars, formatSeconds } from '../../lib/format'
import { storageGet, storageSet } from '../../lib/storage'

const STEP_CHIPS = [16, 32, 48, 64, 96, 128]

interface TrackState {
  id: string
  label: string
  steps: string
}

interface State {
  bpm: string
  tracks: TrackState[]
}

const DEFAULT: State = {
  bpm: '120',
  tracks: [
    { id: '1', label: 'Track 1', steps: '64' },
    { id: '2', label: 'Track 2', steps: '48' },
  ],
}

let nextId = 10

export function PatternTool() {
  const [state, setState] = useState<State>(() => storageGet('pattern', DEFAULT))
  const [result, setResult] = useState<PatternLoopResult | null>(null)
  const [bpmError, setBpmError] = useState('')
  const [trackErrors, setTrackErrors] = useState<Record<string, string>>({})

  const calculate = useCallback(() => {
    const bpmV = validateBpm(state.bpm)
    setBpmError(bpmV.valid ? '' : bpmV.error)

    const errs: Record<string, string> = {}
    const validTracks: TrackInput[] = []

    for (const t of state.tracks) {
      const v = validatePositiveInt(t.steps, 'Steps')
      if (!v.valid) {
        errs[t.id] = v.error
      } else if (v.value > 4096) {
        errs[t.id] = 'Max 4096 steps'
      } else {
        validTracks.push({ id: t.id, label: t.label, steps: v.value })
      }
    }
    setTrackErrors(errs)

    if (bpmV.valid && validTracks.length > 0 && Object.keys(errs).length === 0) {
      try {
        setResult(calculatePatternLoop({ bpm: bpmV.value, tracks: validTracks }))
      } catch {
        setResult(null)
      }
    } else {
      setResult(null)
    }
  }, [state])

  useEffect(() => {
    storageSet('pattern', state)
    calculate()
  }, [state, calculate])

  function addTrack() {
    const id = String(++nextId)
    setState((s) => ({
      ...s,
      tracks: [...s.tracks, { id, label: `Track ${s.tracks.length + 1}`, steps: '32' }],
    }))
  }

  function removeTrack(id: string) {
    setState((s) => ({ ...s, tracks: s.tracks.filter((t) => t.id !== id) }))
  }

  function updateTrack(id: string, field: keyof TrackState, value: string) {
    setState((s) => ({
      ...s,
      tracks: s.tracks.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    }))
  }

  return (
    <ToolCard id="pattern" title="Pattern / Loop Calculator" accent="blue">
      <div className="space-y-4">
        <NumberField id="pat-bpm" label="BPM" value={state.bpm}
          onChange={(v) => setState((s) => ({ ...s, bpm: v }))} min={1} max={999}
          error={bpmError} />

        <div className="space-y-2">
          {state.tracks.map((t) => (
            <div key={t.id} className="flex items-start gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex gap-2">
                  <input
                    aria-label="Track label"
                    value={t.label}
                    onChange={(e) => updateTrack(t.id, 'label', e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 min-h-[36px] focus:outline-none focus:border-zinc-500"
                  />
                  <input
                    aria-label="Steps"
                    type="number"
                    value={t.steps}
                    onChange={(e) => updateTrack(t.id, 'steps', e.target.value)}
                    className="w-20 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm mono text-zinc-100 min-h-[36px] focus:outline-none focus:border-zinc-500"
                    min={1}
                    max={4096}
                  />
                </div>
                <ChipGroup values={STEP_CHIPS} active={t.steps}
                  onSelect={(v) => updateTrack(t.id, 'steps', v)} accent="blue" />
                {trackErrors[t.id] && (
                  <p className="text-red-400 text-xs">{trackErrors[t.id]}</p>
                )}
                {result && (
                  <div className="text-xs mono text-zinc-400">
                    {(() => {
                      const tr = result.tracks.find((r) => r.id === t.id)
                      return tr ? `${formatBars(tr.bars)} bars · ${formatSeconds(tr.seconds)} s` : ''
                    })()}
                  </div>
                )}
              </div>
              {state.tracks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrack(t.id)}
                  className="text-zinc-600 hover:text-red-400 text-sm mt-1 min-w-[24px] min-h-[36px]"
                  aria-label={`Remove ${t.label}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {state.tracks.length < 8 && (
          <button
            type="button"
            onClick={addTrack}
            className="text-xs text-blue-400 hover:text-blue-300 py-1"
          >
            + Add track
          </button>
        )}

        {result && (
          <div className="space-y-2">
            <Badge variant="exact" />
            {state.tracks.length > 1 && (
              <ResultCard title="Full system repeat" accent="blue">
                <ResultRow label="Steps (LCM)" value={String(result.fullRepeatSteps)} />
                <ResultRow label="Bars" value={formatBars(result.fullRepeatBars)} />
                <ResultRow label="Duration" value={result.fullRepeatDuration} />
                <ResultRow label="Seconds" value={`${formatSeconds(result.fullRepeatSeconds)} s`} />
              </ResultCard>
            )}
          </div>
        )}

        <FormulaBlock>
{`For each track:
  bars = steps / 16
  seconds = steps × (15 / BPM)

Full system repeat:
  fullRepeatSteps = LCM(all track step lengths)
  fullRepeatBars = fullRepeatSteps / 16
  fullRepeatSeconds = fullRepeatSteps × (15 / BPM)`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}
