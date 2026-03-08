const PREFIX = 'dnt2tools:v1:'

export function storageGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Ignore storage errors
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // Ignore
  }
}
