export function formatHz(hz: number): string {
  if (hz < 100) return hz.toFixed(2)
  if (hz < 1000) return hz.toFixed(1)
  return Math.round(hz).toString()
}

export function formatSeconds(sec: number): string {
  if (sec < 1) return sec.toFixed(3)
  if (sec < 10) return sec.toFixed(2)
  return sec.toFixed(2)
}

export function formatMs(ms: number): string {
  return Math.round(ms).toString()
}

export function formatBars(bars: number): string {
  const s = bars.toFixed(4)
  return parseFloat(s).toString()
}

export function formatDuration(sec: number): string {
  if (sec < 0) return `-${formatDuration(-sec)}`
  const totalMs = Math.round(sec * 100)
  const centiseconds = totalMs % 100
  const totalSec = Math.floor(totalMs / 100)
  const seconds = totalSec % 60
  const totalMin = Math.floor(totalSec / 60)
  const minutes = totalMin % 60
  const hours = Math.floor(totalMin / 60)

  const pad2 = (n: number) => n.toString().padStart(2, '0')
  const cs = centiseconds.toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}.${cs}`
  }
  return `${pad2(minutes)}:${pad2(seconds)}.${cs}`
}

export function formatRatio(n: number): string {
  const s = n.toFixed(4)
  return parseFloat(s).toString()
}

export function formatCents(cents: number): string {
  const sign = cents >= 0 ? '+' : ''
  return `${sign}${Math.round(cents)}`
}
