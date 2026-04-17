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

type GoogleSheetsResponse<T> = {
  ok: boolean
  data: T
  error?: string
}

const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ?? ''

export const isGoogleSheetsConfigured = Boolean(GOOGLE_APPS_SCRIPT_URL)

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

export async function fetchSheetUsers() {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    return [] as SheetUserSummary[]
  }

  const url = new URL(GOOGLE_APPS_SCRIPT_URL)
  url.searchParams.set('action', 'listUsers')

  const response = await fetch(url.toString(), { method: 'GET' })
  return parseResponse<SheetUserSummary[]>(response)
}

export async function fetchPaymentHistory(email: string) {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured.')
  }

  const url = new URL(GOOGLE_APPS_SCRIPT_URL)
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
  if (!GOOGLE_APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured.')
  }

  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
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
