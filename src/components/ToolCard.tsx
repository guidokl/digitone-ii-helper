

interface ToolCardProps {
  id: string
  title: string
  children: React.ReactNode
  accent?: 'blue' | 'magenta' | 'cyan' | 'amber'
}

const ACCENT_HEADER = {
  blue: 'text-blue-400',
  magenta: 'text-pink-400',
  cyan: 'text-cyan-400',
  amber: 'text-amber-400',
}

export function ToolCard({ id, title, children, accent = 'blue' }: ToolCardProps) {
  return (
    <section
      id={id}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 scroll-mt-20"
    >
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${ACCENT_HEADER[accent]}`}>
        {title}
      </h2>
      {children}
    </section>
  )
}
