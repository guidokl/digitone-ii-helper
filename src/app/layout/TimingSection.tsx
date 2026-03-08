
import { LfoTool } from '../../tools/lfo/LfoTool'
import { PatternTool } from '../../tools/pattern/PatternTool'
import { MicrotimingTool } from '../../tools/microtiming/MicrotimingTool'
import { RetrigTool } from '../../tools/retrig/RetrigTool'
import { ArpTool } from '../../tools/arp/ArpTool'

export function TimingSection() {
  return (
    <div className="space-y-4">
      <LfoTool />
      <PatternTool />
      <MicrotimingTool />
      <RetrigTool />
      <ArpTool />
    </div>
  )
}
