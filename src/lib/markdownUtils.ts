// Markdown rendering utilities for HKY and WFL sections.
// Mirrors the post-render pipeline from digitone-ii-reference/main.js.

const ACCENT_KEYS = new Set(['FUNC'])

const TRANSPORT_MAP: Record<string, { icon: string; cls: string }> = {
  PLAY: { icon: '\u25B6', cls: 'key-badge--play' },
  STOP: { icon: '\u25A0', cls: 'key-badge--neutral' },
  REC:  { icon: '\u23FA', cls: 'key-badge--rec' },
}

const DIRECTION_MAP: Record<string, string> = {
  UP:    '\u2191',
  DOWN:  '\u2193',
  LEFT:  '\u2190',
  RIGHT: '\u2192',
}

function stripFences(md: string): string {
  return md
    .replace(/^```markdown\s*\n/, '')
    .replace(/\n```\s*$/, '')
}

export function replaceKeyBadges(html: string): string {
  const parts = html.split(/(<[^>]+>)/g)
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('<')) continue
    parts[i] = parts[i].replace(
      /\[([A-Z][A-Z0-9 /+\-\u2013]*?)\]/g,
      (_match, key: string) => {
        if (TRANSPORT_MAP[key]) {
          const t = TRANSPORT_MAP[key]
          return `<span class="key-badge ${t.cls}">${t.icon}</span>`
        }
        if (DIRECTION_MAP[key]) {
          return `<span class="dir-arrow">${DIRECTION_MAP[key]}</span>`
        }
        if (ACCENT_KEYS.has(key)) {
          return `<span class="key-badge key-badge--accent">${key}</span>`
        }
        return `<span class="key-badge key-badge--neutral">${key}</span>`
      },
    )
  }
  return parts.join('')
}

export function wrapTables(html: string): string {
  return html
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function addHeadingIds(html: string, prefix: string): string {
  const slugCounts: Record<string, number> = {}
  return html.replace(/<(h[234])>(.*?)<\/\1>/gi, (_match, tag: string, content: string) => {
    const textOnly = content.replace(/<[^>]+>/g, '')
    let slug = `${prefix}-${slugify(textOnly)}`
    if (slugCounts[slug]) {
      slugCounts[slug]++
      slug += `-${slugCounts[slug]}`
    } else {
      slugCounts[slug] = 1
    }
    return `<${tag} id="${slug}">${content}</${tag}>`
  })
}

// Applied after the section is in the DOM so querySelectorAll works.
// sectionIndex 0 → prefix "1.", sectionIndex 1 → prefix "2.", etc.
export function applyHeadingNumbers(container: HTMLElement, sectionIndex: number): void {
  const sectionNum = sectionIndex + 1
  let h2Count = 0
  let h3Count = 0
  container.querySelectorAll<HTMLHeadingElement>('h2, h3').forEach(h => {
    const text = (h.textContent ?? '').replace(/^\d+(\.\d+)*\.?\s*/, '')
    if (h.tagName === 'H2') {
      h2Count++
      h3Count = 0
      h.textContent = `${sectionNum}.${h2Count} ${text}`
    } else {
      h3Count++
      h.textContent = `${sectionNum}.${h2Count}.${h3Count} ${text}`
    }
  })
}

export function renderMarkdown(rawMd: string, idPrefix: string): string {
  marked.setOptions({ gfm: true, breaks: false })
  const md = stripFences(rawMd)
  let html = marked.parse(md)
  html = wrapTables(html)
  html = addHeadingIds(html, idPrefix)
  html = replaceKeyBadges(html)
  return html
}
