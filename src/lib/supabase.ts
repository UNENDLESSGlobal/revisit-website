import { readPublicEnv } from './public-env'

export type AuthenticatedSupabaseSession = {
  accessToken: string
  refreshToken: string
  expiresAt: number
  email: string
}

export type AdminAccessResult = {
  isAdmin: boolean
  reason?: 'not_found' | 'forbidden' | 'request_failed'
  message?: string
}

export type ProfileRecord = {
  id: string
  email: string
  plan: string | null
  subscription: string | null
  created_at: string | null
  plan_expires_at: string | null
}

type SupabaseRequestOptions = {
  accessToken?: string
  body?: BodyInit | null
  contentType?: string
  headers?: HeadersInit
  method?: string
}

type AuthResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  user?: {
    email?: string
  }
}

const missingEnvMessage =
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'

export const SUPABASE_URL = readPublicEnv('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL')
export const SUPABASE_ANON_KEY = readPublicEnv('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const assertSupabaseConfig = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(missingEnvMessage)
  }
}

const buildHeaders = (
  accessToken = SUPABASE_ANON_KEY,
  contentType?: string,
  headers?: HeadersInit,
) => {
  const resolvedHeaders = new Headers(headers)
  resolvedHeaders.set('apikey', SUPABASE_ANON_KEY)
  resolvedHeaders.set('Authorization', `Bearer ${accessToken}`)

  if (contentType) {
    resolvedHeaders.set('Content-Type', contentType)
  }

  return resolvedHeaders
}

const parseErrorMessage = async (response: Response) => {
  const fallback = `Supabase request failed with status ${response.status}`
  const raw = await response.text()

  if (!raw) {
    return fallback
  }

  try {
    const parsed = JSON.parse(raw) as { error_description?: string; msg?: string; message?: string }
    return parsed.error_description ?? parsed.msg ?? parsed.message ?? fallback
  } catch {
    return raw
  }
}

async function supabaseFetch(path: string, options: SupabaseRequestOptions = {}) {
  assertSupabaseConfig()

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: buildHeaders(options.accessToken, options.contentType, options.headers),
    body: options.body,
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response
}

const toAuthenticatedSession = (response: AuthResponse) => {
  const email = response.user?.email

  if (!email) {
    throw new Error('Supabase did not return the authenticated user email.')
  }

  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresAt: Date.now() + response.expires_in * 1000,
    email,
  } satisfies AuthenticatedSupabaseSession
}

export async function signInWithPassword(email: string, password: string) {
  const response = await supabaseFetch('/auth/v1/token?grant_type=password', {
    method: 'POST',
    contentType: 'application/json',
    body: JSON.stringify({ email: normalizeEmail(email), password }),
  })

  return toAuthenticatedSession((await response.json()) as AuthResponse)
}

export async function refreshAuthenticatedSession(refreshToken: string) {
  const response = await supabaseFetch('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    contentType: 'application/json',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  return toAuthenticatedSession((await response.json()) as AuthResponse)
}

export async function signOutFromSupabase(accessToken: string) {
  await supabaseFetch('/auth/v1/logout', {
    method: 'POST',
    accessToken,
  })
}

export async function fetchPublicDownloadUrl() {
  const response = await supabaseFetch('/rest/v1/app_config?id=eq.1&select=update_url')
  const rows = (await response.json()) as Array<{ update_url?: string }>
  return rows[0]?.update_url ?? '#'
}

export async function subscribeToNewsletter(email: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/newsletter`, {
    method: 'POST',
    headers: buildHeaders(SUPABASE_ANON_KEY, 'application/json', {
      Prefer: 'return=minimal',
    }),
    body: JSON.stringify({ email: normalizeEmail(email) }),
  })

  return response.status
}

export async function fetchProfiles(accessToken: string) {
  const response = await supabaseFetch(
    '/rest/v1/profiles?select=id,email,plan,subscription,plan_expires_at,created_at&order=created_at.desc.nullslast',
    { accessToken },
  )

  return (await response.json()) as ProfileRecord[]
}

export async function hasAdminAccess(email: string, accessToken: string): Promise<AdminAccessResult> {
  const normalizedEmail = normalizeEmail(email)

  try {
    const response = await supabaseFetch(
      `/rest/v1/admin_dashboard?email=ilike.${encodeURIComponent(normalizedEmail)}&select=email&limit=1`,
      { accessToken },
    )

    const rows = (await response.json()) as Array<{ email: string }>

    if (rows.length > 0) {
      return { isAdmin: true }
    }

    return {
      isAdmin: false,
      reason: 'not_found',
      message: `Password sign-in succeeded, but ${normalizedEmail} was not found in admin_dashboard.`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown admin lookup error.'
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('permission') || lowerMessage.includes('row-level security') || lowerMessage.includes('forbidden')) {
      return {
        isAdmin: false,
        reason: 'forbidden',
        message:
          'Password sign-in succeeded, but admin_dashboard could not be read. Check the RLS policies on admin_dashboard.',
      }
    }

    return {
      isAdmin: false,
      reason: 'request_failed',
      message: `Password sign-in succeeded, but admin_dashboard lookup failed: ${message}`,
    }
  }
}

export async function updateProfilePlan(
  profileId: string,
  accessToken: string,
  updates: Pick<ProfileRecord, 'plan' | 'subscription' | 'plan_expires_at'>,
) {
  const response = await supabaseFetch(`/rest/v1/profiles?id=eq.${profileId}`, {
    method: 'PATCH',
    accessToken,
    contentType: 'application/json',
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify(updates),
  })

  const rows = (await response.json()) as ProfileRecord[]
  return rows[0]
}
