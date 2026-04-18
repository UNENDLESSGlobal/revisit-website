import { readPublicEnv } from './public-env'

export type PaymentPlan = 'monthly' | 'yearly'

export type SheetUserSummary = {
  email: string
  currentPlan: PaymentPlan | ''
  currentPlanExpiresAt: string | ''
  lastPaymentDate: string | ''
  daysLeft: number
  paymentCount: number
  updatedAt: string | ''
}

export type PaymentHistoryEntry = {
  paymentId: string
  email: string
  plan: PaymentPlan
  paidOn: string
  daysAdded: number
  carryForwardDays: number
  previousExpiry: string | ''
  newExpiry: string
  recordedAt: string
}

export type FeedbackSheetName = 'Bugs' | 'Features'

export type FeedbackEntry = {
  row: number
  timestamp: string
  title: string
  description: string
  email: string
  status: boolean
}

type GoogleSheetsResponse<T> = {
  ok: boolean
  data: T
  error?: string
}

const PAYMENTS_GOOGLE_APPS_SCRIPT_URL = readPublicEnv(
  'VITE_GOOGLE_APPS_SCRIPT_URL',
  'NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL',
)

const FEEDBACK_GOOGLE_APPS_SCRIPT_URL = readPublicEnv(
  'VITE_FEEDBACK_GOOGLE_APPS_SCRIPT_URL',
  'NEXT_PUBLIC_FEEDBACK_GOOGLE_APPS_SCRIPT_URL',
)

export const isGoogleSheetsConfigured = Boolean(PAYMENTS_GOOGLE_APPS_SCRIPT_URL)
export const isFeedbackGoogleSheetsConfigured = Boolean(FEEDBACK_GOOGLE_APPS_SCRIPT_URL)

export function normalizePaymentDateInput(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error('Paid on date is required.')
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  const slashMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)

  if (slashMatch) {
    const [, day, month, year] = slashMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const parsed = new Date(trimmed)

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Dates must use YYYY-MM-DD format.')
  }

  return parsed.toISOString().slice(0, 10)
}

const parseResponse = async <T>(response: Response) => {
  const raw = await response.text()
  let parsed: GoogleSheetsResponse<T>

  try {
    parsed = JSON.parse(raw) as GoogleSheetsResponse<T>
  } catch {
    throw new Error(raw || 'Google Apps Script returned an invalid response.')
  }

  if (!response.ok || !parsed.ok) {
    throw new Error(parsed.error || `Google Apps Script request failed with status ${response.status}`)
  }

  return parsed.data
}

const parseSheetBoolean = (value: boolean | string | number | null | undefined) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    return value.trim().toLowerCase() === 'true'
  }

  return false
}

const normalizeFeedbackEntry = (entry: Partial<FeedbackEntry> & { row?: number | string; status?: boolean | string | number | null }) => ({
  row: typeof entry.row === 'number' ? entry.row : Number(entry.row || 0),
  timestamp: entry.timestamp?.toString().trim() || '',
  title: entry.title?.toString().trim() || '',
  description: entry.description?.toString().trim() || '',
  email: entry.email?.toString().trim() || '',
  status: parseSheetBoolean(entry.status),
})

export async function fetchSheetUsers() {
  if (!PAYMENTS_GOOGLE_APPS_SCRIPT_URL) {
    return [] as SheetUserSummary[]
  }

  const url = new URL(PAYMENTS_GOOGLE_APPS_SCRIPT_URL)
  url.searchParams.set('action', 'listUsers')

  const response = await fetch(url.toString(), { method: 'GET' })
  return parseResponse<SheetUserSummary[]>(response)
}

export async function fetchPaymentHistory(email: string) {
  if (!PAYMENTS_GOOGLE_APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured.')
  }

  const url = new URL(PAYMENTS_GOOGLE_APPS_SCRIPT_URL)
  url.searchParams.set('action', 'paymentHistory')
  url.searchParams.set('email', email)

  const response = await fetch(url.toString(), { method: 'GET' })
  return parseResponse<PaymentHistoryEntry[]>(response)
}

export async function addPaymentRecord(payload: {
  email: string
  plan: PaymentPlan
  paidOn: string
}) {
  if (!PAYMENTS_GOOGLE_APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured.')
  }

  const response = await fetch(PAYMENTS_GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      action: 'addPayment',
      ...payload,
    }),
  })

  return parseResponse<{
    summary: SheetUserSummary
    payment: PaymentHistoryEntry
  }>(response)
}

export async function fetchFeedbackEntries(sheet: FeedbackSheetName) {
  if (!FEEDBACK_GOOGLE_APPS_SCRIPT_URL) {
    throw new Error('Feedback Google Apps Script URL is not configured.')
  }

  const url = new URL(FEEDBACK_GOOGLE_APPS_SCRIPT_URL)
  url.searchParams.set('action', 'listFeedback')
  url.searchParams.set('sheet', sheet)

  const response = await fetch(url.toString(), { method: 'GET' })
  const data = await parseResponse<Array<Partial<FeedbackEntry> & { row?: number | string; status?: boolean | string | number | null }>>(response)

  return data.map(normalizeFeedbackEntry)
}

export async function updateFeedbackStatus(payload: {
  sheet: FeedbackSheetName
  row: number
  status: boolean
}) {
  if (!FEEDBACK_GOOGLE_APPS_SCRIPT_URL) {
    throw new Error('Feedback Google Apps Script URL is not configured.')
  }

  const response = await fetch(FEEDBACK_GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      action: 'updateFeedbackStatus',
      ...payload,
    }),
  })

  const data = await parseResponse<Partial<FeedbackEntry> & { row?: number | string; status?: boolean | string | number | null }>(response)
  return normalizeFeedbackEntry({
    ...data,
    row: data.row ?? payload.row,
    status: data.status ?? payload.status,
  })
}
