import { LfoTool } from '../../tools/lfo/LfoTool'
import { PatternTool } from '../../tools/pattern/PatternTool'
import { MicrotimingTool } from '../../tools/microtiming/MicrotimingTool'
import { RetrigTool } from '../../tools/retrig/RetrigTool'
import { ArpTool } from '../../tools/arp/ArpTool'

const h2 = 'text-[17px] font-semibold text-zinc-200 border-b border-zinc-800 pb-1.5'

export function TimingSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-200 mt-1">Clock &amp; Timing</h1>

      <div className="space-y-4">
        <h2 className={h2}>LFO &amp; Pattern</h2>
        <LfoTool />
        <PatternTool />
      </div>

      <div className="space-y-4">
        <h2 className={h2}>Step &amp; Gate Timing</h2>
        <MicrotimingTool />
        <RetrigTool />
      </div>

      <div className="space-y-4">
        <h2 className={h2}>Arpeggiator</h2>
        <ArpTool />
      </div>
    </div>
  )
}
