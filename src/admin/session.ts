import {
  type AuthenticatedSupabaseSession,
  refreshAuthenticatedSession,
} from '@/lib/supabase'

const STORAGE_KEY = 'revisit-admin-session'

export function loadAdminSession() {
  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthenticatedSupabaseSession
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveAdminSession(session: AuthenticatedSupabaseSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function clearAdminSession() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export async function ensureFreshAdminSession(session: AuthenticatedSupabaseSession) {
  if (session.expiresAt > Date.now() + 60_000) {
    return session
  }

  const refreshed = await refreshAuthenticatedSession(session.refreshToken)
  return saveAdminSession(refreshed)
}
