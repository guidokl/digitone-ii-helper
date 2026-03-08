import { useState, useEffect, useMemo } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { ChipGroup } from '../../components/ChipGroup'
import { generateEnvelopeSketch, ENVELOPE_PRESETS } from './envelopeCalc'
import type { AdsrParams, EnvelopePoint } from './envelopeCalc'
import { storageGet, storageSet } from '../../lib/storage'

interface AdsrState {
  attack: string
  decay: string
  sustain: string
  release: string
}

interface State {
  amp: AdsrState
  mod: AdsrState
  baseModIndex: string
  totalDuration: string
  gateDuration: string
}

const toAdsrState = (p: AdsrParams): AdsrState => ({
  attack: String(p.attack),
  decay: String(p.decay),
  sustain: String(p.sustain),
  release: String(p.release),
})

const parseAdsr = (s: AdsrState): AdsrParams | null => {
  const a = parseFloat(s.attack)
  const d = parseFloat(s.decay)
  const su = parseFloat(s.sustain)
  const r = parseFloat(s.release)
  if ([a, d, su, r].some(isNaN)) return null
  if (a < 0 || d < 0 || su < 0 || su > 1 || r < 0) return null
  return { attack: a, decay: d, sustain: su, release: r }
}

const DEFAULT: State = {
  amp: toAdsrState(ENVELOPE_PRESETS.pluck.amp),
  mod: toAdsrState(ENVELOPE_PRESETS.pluck.mod),
  baseModIndex: String(ENVELOPE_PRESETS.pluck.baseModIndex),
  totalDuration: '1',
  gateDuration: '0.7',
}

const PRESET_CHIPS = Object.keys(ENVELOPE_PRESETS)

export function EnvelopeTool() {
  const [state, setState] = useState<State>(() => storageGet('fm-envelope', DEFAULT))

  useEffect(() => { storageSet('fm-envelope', state) }, [state])

  function setAdsr(env: 'amp' | 'mod', field: keyof AdsrState, val: string) {
    setState((s) => ({ ...s, [env]: { ...s[env], [field]: val } }))
  }

  function applyPreset(name: string) {
    const p = ENVELOPE_PRESETS[name]
    if (!p) return
    setState((s) => ({
      ...s,
      amp: toAdsrState(p.amp),
      mod: toAdsrState(p.mod),
      baseModIndex: String(p.baseModIndex),
      totalDuration: String(p.totalDuration),
      gateDuration: String(p.gateDuration),
    }))
  }

  const amp = parseAdsr(state.amp)
  const mod = parseAdsr(state.mod)
  const baseModIndex = parseFloat(state.baseModIndex)
  const totalDuration = parseFloat(state.totalDuration)
  const gateDuration = parseFloat(state.gateDuration)

  const result = useMemo(() => {
    if (!amp || !mod || isNaN(baseModIndex) || isNaN(totalDuration) || totalDuration <= 0) return null
    try {
      return generateEnvelopeSketch({
        amp, mod, baseModIndex,
        totalDuration,
        gateDuration: isNaN(gateDuration) ? totalDuration * 0.7 : gateDuration,
      })
    } catch { return null }
  }, [amp, mod, baseModIndex, totalDuration, gateDuration])

  return (
    <ToolCard id="fm-envelope" title="Envelope Interaction Sketch" accent="magenta">
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="heuristic" label="Conceptual" />
          <span className="text-xs text-zinc-500">Sketch, not a waveform model</span>
        </div>

        <ChipGroup label="Presets" values={PRESET_CHIPS} onSelect={applyPreset} accent="magenta" />

        <div className="grid grid-cols-2 gap-4">
          <AdsrPanel label="Amp Envelope" env="amp" state={state.amp} setField={(f, v) => setAdsr('amp', f, v)} />
          <AdsrPanel label="Mod Envelope" env="mod" state={state.mod} setField={(f, v) => setAdsr('mod', f, v)} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <NumberField id="env-idx" label="Base mod index" value={state.baseModIndex}
            onChange={(v) => setState((s) => ({ ...s, baseModIndex: v }))} min={0} step={0.25} />
          <NumberField id="env-dur" label="Total (sec)" value={state.totalDuration}
            onChange={(v) => setState((s) => ({ ...s, totalDuration: v }))} min={0.01} step={0.1} />
          <NumberField id="env-gate" label="Gate (sec)" value={state.gateDuration}
            onChange={(v) => setState((s) => ({ ...s, gateDuration: v }))} min={0.001} step={0.1} />
        </div>

        {result && <EnvelopeGraph points={result.points} totalDuration={totalDuration} annotations={result.annotations} />}

        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-blue-400" />Amp</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-pink-400" />Mod</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-amber-400" />Brightness</span>
        </div>

        <FormulaBlock>
{`ampEnv(t) = ADSR normalized 0..1
modEnv(t) = ADSR normalized 0..1
brightness(t) = baseModIndex × modEnv(t)
perceived(t) = ampEnv(t) × (0.35 + 0.65 × modEnv(t))

ADSR:
  0..attack        → ramp 0→1
  attack..+decay   → ramp 1→sustain
  sustain phase    → hold
  after gate-off   → ramp sustainLevel→0 across release`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}

function AdsrPanel({
  label, env: _env, state, setField,
}: {
  label: string
  env: string
  state: AdsrState
  setField: (f: keyof AdsrState, v: string) => void
}) {
  const fields: Array<{ key: keyof AdsrState; label: string; step: number; max?: number }> = [
    { key: 'attack', label: 'A', step: 0.01 },
    { key: 'decay', label: 'D', step: 0.01 },
    { key: 'sustain', label: 'S', step: 0.05, max: 1 },
    { key: 'release', label: 'R', step: 0.01 },
  ]

  return (
    <div>
      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="space-y-1">
        {fields.map(({ key, label: fl, step, max }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-4">{fl}</span>
            <input
              type="number"
              value={state[key]}
              onChange={(e) => setField(key, e.target.value)}
              min={0}
              max={max}
              step={step}
              aria-label={`${label} ${fl}`}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs mono text-zinc-100 min-h-[36px] focus:outline-none focus:border-zinc-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function EnvelopeGraph({
  points, totalDuration, annotations,
}: {
  points: EnvelopePoint[]
  totalDuration: number
  annotations: Array<{ t: number; label: string }>
}) {
  const W = 300
  const H = 100
  const PAD = { left: 4, right: 4, top: 8, bottom: 4 }

  function toXY(t: number, v: number): [number, number] {
    const x = PAD.left + (t / totalDuration) * (W - PAD.left - PAD.right)
    const y = H - PAD.bottom - v * (H - PAD.top - PAD.bottom)
    return [x, y]
  }

  function makePath(getValue: (p: EnvelopePoint) => number, color: string) {
    const d = points
      .map((p, i) => {
        const [x, y] = toXY(p.t, getValue(p))
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
    return <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="Envelope interaction sketch showing amp, mod, and brightness curves"
        role="img"
      >
        {/* Background grid */}
        <line x1={PAD.left} y1={H / 2} x2={W - PAD.right} y2={H / 2} stroke="#27272a" strokeWidth="0.5" strokeDasharray="4 4" />
        {makePath((p) => p.amp, '#60a5fa')}
        {makePath((p) => p.mod, '#f472b6')}
        {makePath((p) => Math.min(p.brightness / 10, 1), '#fbbf24')}
        {annotations.map((a, i) => {
          const [x] = toXY(a.t, 0)
          return (
            <g key={i}>
              <line x1={x} y1={PAD.top} x2={x} y2={H - PAD.bottom} stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="2 2" />
              <text x={x + 2} y={PAD.top + 6} fontSize="6" fill="#6b7280">{a.label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
