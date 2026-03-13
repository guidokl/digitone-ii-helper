import { useEffect, useRef } from 'react'
import workflowsRaw from '../../../markdown/workflows.md?raw'
import { renderMarkdown, applyHeadingNumbers } from '../../lib/markdownUtils'

export function WorkflowsSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = renderMarkdown(workflowsRaw, 'wfl')
    applyHeadingNumbers(ref.current, 1)
  }, [])

  return <div ref={ref} className="md-content md-content--wfl" />
}
