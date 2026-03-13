import { useEffect, useRef } from 'react'
import shortcutsRaw from '../../../markdown/shortcuts.md?raw'
import { renderMarkdown, applyHeadingNumbers } from '../../lib/markdownUtils'

export function ShortcutsSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = renderMarkdown(shortcutsRaw, 'hky')
    applyHeadingNumbers(ref.current, 0)
  }, [])

  return <div ref={ref} className="md-content" />
}
