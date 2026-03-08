
import { FmRatioTool } from '../../tools/fm-ratio/FmRatioTool'
import { SidebandTool } from '../../tools/fm-sidebands/SidebandTool'
import { ModIndexTool } from '../../tools/fm-index/ModIndexTool'
import { EnvelopeTool } from '../../tools/fm-envelope/EnvelopeTool'

export function FmSection() {
  return (
    <div className="space-y-4">
      <FmRatioTool />
      <SidebandTool />
      <ModIndexTool />
      <EnvelopeTool />
    </div>
  )
}
