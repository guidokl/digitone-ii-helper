export type SectionId = 'timing' | 'fm' | 'fmplus' | 'filter' | 'about'

interface Tab {
  id: SectionId
  label: string
}

const TABS: Tab[] = [
  { id: 'timing', label: 'CLK' },
  { id: 'fm', label: 'FM' },
  { id: 'fmplus', label: 'FM+' },
  { id: 'filter', label: 'FLT' },
  { id: 'about', label: 'ℹ' },
]

const ACTIVE_STYLES: Record<SectionId, string> = {
  timing: 'text-blue-400 border-blue-500',
  fm: 'text-pink-400 border-pink-500',
  fmplus: 'text-violet-400 border-violet-500',
  filter: 'text-cyan-400 border-cyan-500',
  about: 'text-zinc-300 border-zinc-400',
}

interface SectionTabsProps {
  active: SectionId
  onChange: (id: SectionId) => void
}

export function SectionTabs({ active, onChange }: SectionTabsProps) {
  return (
    <nav
      role="tablist"
      aria-label="Sections"
      className="flex border-b border-zinc-800 bg-zinc-950"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`section-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center py-3 px-1 text-xs font-bold mono tracking-wider border-b-2 transition-colors min-h-[44px] ${
              isActive
                ? ACTIVE_STYLES[tab.id]
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
