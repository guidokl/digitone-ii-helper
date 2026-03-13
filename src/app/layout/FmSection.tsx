import { FmRatioTool } from '../../tools/fm-ratio/FmRatioTool'
import { SidebandTool } from '../../tools/fm-sidebands/SidebandTool'
import { ModIndexTool } from '../../tools/fm-index/ModIndexTool'
import { EnvelopeTool } from '../../tools/fm-envelope/EnvelopeTool'

const h2 = 'text-[17px] font-semibold text-zinc-200 border-b border-zinc-800 pb-1.5'

export function FmSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-200 mt-1">FM Synthesis Calculators</h1>

      <div className="space-y-4">
        <h2 className={h2}>Frequency &amp; Spectrum</h2>
        <FmRatioTool />
        <SidebandTool />
      </div>

      <div className="space-y-4">
        <h2 className={h2}>Modulation Depth &amp; Envelope</h2>
        <ModIndexTool />
        <EnvelopeTool />
      </div>
    </div>
  )
}
