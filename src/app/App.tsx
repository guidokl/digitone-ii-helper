import { useState, useEffect, type ComponentType } from 'react'
import { SectionTabs } from '../components/SectionTabs'
import type { SectionId } from '../components/SectionTabs'
import { TimingSection } from './layout/TimingSection'
import { FmSection } from './layout/FmSection'
import { FmPlusSection } from './layout/FmPlusSection'
import { FilterSection } from './layout/FilterSection'
import { ShortcutsSection } from './layout/ShortcutsSection'
import { WorkflowsSection } from './layout/WorkflowsSection'
import { AboutSection } from './layout/AboutSection'
import { storageGet, storageSet } from '../lib/storage'

const SECTION_PANELS: Record<SectionId, ComponentType> = {
  timing:    TimingSection,
  fm:        FmSection,
  fmplus:    FmPlusSection,
  filter:    FilterSection,
  shortcuts: ShortcutsSection,
  workflows: WorkflowsSection,
  about:     AboutSection,
}

function getSectionFromHash(): SectionId {
  const hash = window.location.hash.slice(1)
  const sectionMap: Record<string, SectionId> = {
    timing: 'timing', lfo: 'timing', pattern: 'timing', microtiming: 'timing', retrig: 'timing', arp: 'timing',
    fm: 'fm', 'fm-ratio': 'fm', 'fm-sidebands': 'fm', 'fm-index': 'fm', 'fm-envelope': 'fm',
    fmplus: 'fmplus',
    filter: 'filter',
    shortcuts: 'shortcuts',
    workflows: 'workflows',
    about: 'about',
  }
  return sectionMap[hash] ?? 'timing'
}

export function App() {
  const [section, setSection] = useState<SectionId>(() => {
    const fromHash = getSectionFromHash()
    return fromHash !== 'timing' ? fromHash : storageGet('section', 'timing' as SectionId)
  })

  useEffect(() => {
    storageSet('section', section)
  }, [section])

  useEffect(() => {
    const onHashChange = () => {
      const s = getSectionFromHash()
      setSection(s)
      const hash = window.location.hash.slice(1)
      const el = document.getElementById(hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const Panel = SECTION_PANELS[section]

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <div className="sticky top-0 z-10 bg-zinc-950">
        <header className="px-4 py-3 border-b border-zinc-800">
          <h1 className="text-sm font-semibold text-zinc-200 tracking-wide">
            Digitone 2 <span className="text-blue-400">Helper</span>
          </h1>
        </header>
        <SectionTabs active={section} onChange={setSection} />
      </div>

      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full">
        <div role="tabpanel" id={`section-${section}`}>
          <Panel />
        </div>
      </main>
    </div>
  )
}
