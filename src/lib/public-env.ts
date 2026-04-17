export function readPublicEnv(...keys: string[]) {
  for (const key of keys) {
    const value = import.meta.env[key]

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}
