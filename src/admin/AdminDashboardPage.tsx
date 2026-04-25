import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  CreditCard,
  LoaderCircle,
  LogOut,
  RefreshCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  addPaymentRecord,
  fetchPaymentHistory,
  fetchSheetUsers,
  isGoogleSheetsConfigured,
  normalizePaymentDateInput,
  type PaymentHistoryEntry,
  type PaymentPlan,
  type SheetUserSummary,
} from '@/lib/google-sheets-client'
import {
  fetchProfiles,
  hasAdminAccess,
  signOutFromSupabase,
  updateProfilePlan,
  type AuthenticatedSupabaseSession,
  type ProfileRecord,
} from '@/lib/supabase'
import { clearAdminSession, ensureFreshAdminSession, loadAdminSession } from './session'
import FeedbacksPanel from './FeedbacksPanel'

type DashboardRecord = ProfileRecord & {
  sheetSummary?: SheetUserSummary
}

const normalizeEmail = (value: string) => value.trim().toLowerCase()

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return '—'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

const formatPlan = (value: string | null | undefined) => {
  if (!value) {
    return '—'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

const isExpiringSoon = (value: string | null) => {
  if (!value) {
    return false
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return false
  }

  const diff = parsed.getTime() - Date.now()
  return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000
}

const buildSheetSummaryMap = (items: SheetUserSummary[]) =>
  items.reduce<Record<string, SheetUserSummary>>((accumulator, item) => {
    accumulator[normalizeEmail(item.email)] = item
    return accumulator
  }, {})

const toProfileSubscription = (plan: PaymentPlan) => (plan === 'yearly' ? 'premium' : plan)

const resolveCurrentPlan = (profile: DashboardRecord | ProfileRecord) =>
  ('sheetSummary' in profile ? profile.sheetSummary?.currentPlan : '') || profile.plan

const normalizeProfileName = (value: string | null | undefined) => value?.trim().toLowerCase() || ''

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const [session, setSession] = useState<AuthenticatedSupabaseSession | null>(null)
  const [profiles, setProfiles] = useState<ProfileRecord[]>([])
  const [sheetSummaryMap, setSheetSummaryMap] = useState<Record<string, SheetUserSummary>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [dashboardError, setDashboardError] = useState('')
  const [dashboardDebugInfo, setDashboardDebugInfo] = useState('')
  const [formError, setFormError] = useState('')
  const [historyError, setHistoryError] = useState('')
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [selectedHistoryEmail, setSelectedHistoryEmail] = useState('')
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryEntry[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [paymentEmail, setPaymentEmail] = useState('')
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('monthly')
  const [paidOn, setPaidOn] = useState(() => new Date().toISOString().slice(0, 10))
  const [feedbackRefreshToken, setFeedbackRefreshToken] = useState(0)

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const records = profiles.map<DashboardRecord>((profile) => ({
      ...profile,
      sheetSummary: sheetSummaryMap[normalizeEmail(profile.email)],
    }))

    if (!normalizedSearch) {
      return records
    }

    return records.filter(
      (profile) =>
        normalizeEmail(profile.email).includes(normalizedSearch) ||
        normalizeProfileName(profile.Name).includes(normalizedSearch),
    )
  }, [profiles, searchQuery, sheetSummaryMap])

  const stats = useMemo(() => {
    const records = profiles.map<DashboardRecord>((profile) => ({
      ...profile,
      sheetSummary: sheetSummaryMap[normalizeEmail(profile.email)],
    }))

    const totalUsers = records.length
    const monthlyUsers = records.filter((profile) => resolveCurrentPlan(profile) === 'monthly').length
    const yearlyUsers = records.filter((profile) => resolveCurrentPlan(profile) === 'yearly').length
    const expiringSoon = records.filter((profile) => isExpiringSoon(profile.plan_expires_at)).length

    return { totalUsers, monthlyUsers, yearlyUsers, expiringSoon }
  }, [profiles, sheetSummaryMap])

  const syncSession = async (existingSession?: AuthenticatedSupabaseSession | null) => {
    const storedSession = existingSession ?? loadAdminSession()

    if (!storedSession) {
      return null
    }

    const freshSession = await ensureFreshAdminSession(storedSession)
    const adminAccess = await hasAdminAccess(freshSession.email, freshSession.accessToken)

    if (!adminAccess.isAdmin) {
      clearAdminSession()
      throw new Error(adminAccess.message ?? 'This account is no longer listed in admin_dashboard.')
    }

    setSession(freshSession)
    return freshSession
  }

  const loadData = async (activeSession: AuthenticatedSupabaseSession) => {
    setDashboardDebugInfo('Loading profiles from Supabase and payment summaries from Google Sheets...')
    const [profileRows, googleSheetRows] = await Promise.all([fetchProfiles(activeSession.accessToken), fetchSheetUsers()])

    setProfiles(profileRows)
    setSheetSummaryMap(buildSheetSummaryMap(googleSheetRows))
    setDashboardDebugInfo(
      `Loaded ${profileRows.length} profiles from Supabase and ${googleSheetRows.length} payment summaries from Google Sheets.`,
    )
  }

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      try {
        setDashboardDebugInfo('Checking admin session...')
        const activeSession = await syncSession()

        if (!activeSession) {
          if (isMounted) {
            navigate('/admin', { replace: true })
          }
          return
        }

        await loadData(activeSession)
      } catch (caughtError) {
        if (!isMounted) {
          return
        }

        const message = caughtError instanceof Error ? caughtError.message : 'Unable to load the admin dashboard.'
        const shouldReturnToLogin =
          message.includes('admin_dashboard') ||
          message.includes('session') ||
          message.includes('refresh_token') ||
          message.includes('JWT')

        setDashboardError(message)
        setDashboardDebugInfo(`Dashboard bootstrap failed: ${message}`)

        if (shouldReturnToLogin) {
          clearAdminSession()
          navigate('/admin', { replace: true })
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false)
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const refreshDashboard = async () => {
    const existingSession = session ?? loadAdminSession()

    if (!existingSession) {
      navigate('/admin', { replace: true })
      return
    }

    setIsRefreshing(true)
    setDashboardError('')
    setDashboardDebugInfo('Refreshing dashboard data...')

    try {
      const activeSession = await syncSession(existingSession)

      if (!activeSession) {
        navigate('/admin', { replace: true })
        return
      }

      await loadData(activeSession)
      setFeedbackRefreshToken((currentToken) => currentToken + 1)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to refresh the dashboard.'
      setDashboardError(message)
      setDashboardDebugInfo(`Refresh failed: ${message}`)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogout = async () => {
    const existingSession = session ?? loadAdminSession()

    clearAdminSession()
    setSession(null)

    if (existingSession) {
      try {
        await signOutFromSupabase(existingSession.accessToken)
      } catch {
        // Ignore logout failures after the local session is cleared.
      }
    }

    navigate('/admin', { replace: true })
  }

  const openPaymentHistory = async (email: string) => {
    setSelectedHistoryEmail(email)
    setIsHistoryOpen(true)
    setIsHistoryLoading(true)
    setHistoryError('')

    try {
      const history = await fetchPaymentHistory(email)
      setPaymentHistory(history)
    } catch (caughtError) {
      setPaymentHistory([])
      setHistoryError(
        caughtError instanceof Error ? caughtError.message : 'Failed to load payment history.',
      )
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const handleAddPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedEmail = normalizeEmail(paymentEmail)
    const matchingProfile = profiles.find((profile) => normalizeEmail(profile.email) === normalizedEmail)

    if (!matchingProfile) {
      setFormError('That email does not exist in the Supabase profiles table.')
      return
    }

    setIsSubmittingPayment(true)
    setFormError('')

    try {
      const normalizedPaidOn = normalizePaymentDateInput(paidOn)
      const activeSession = await syncSession(session)

      if (!activeSession) {
        throw new Error('Admin session expired. Please sign in again.')
      }

      const result = await addPaymentRecord({
        email: normalizedEmail,
        plan: paymentPlan,
        paidOn: normalizedPaidOn,
      })

      const updatedProfile = await updateProfilePlan(matchingProfile.id, activeSession.accessToken, {
        subscription: toProfileSubscription(paymentPlan),
      })

      setProfiles((currentProfiles) =>
        currentProfiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile)),
      )
      setSheetSummaryMap((currentMap) => ({
        ...currentMap,
        [normalizedEmail]: result.summary,
      }))
      setPaymentEmail('')
      setPaymentPlan('monthly')
      setPaidOn(new Date().toISOString().slice(0, 10))

      if (selectedHistoryEmail && normalizeEmail(selectedHistoryEmail) === normalizedEmail) {
        const history = await fetchPaymentHistory(normalizedEmail)
        setPaymentHistory(history)
      }
    } catch (caughtError) {
      setFormError(
        caughtError instanceof Error ? caughtError.message : 'Unable to add the payment.',
      )
    } finally {
      setIsSubmittingPayment(false)
    }
  }

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-revisit-bg">
        <div className="flex items-center gap-3 rounded-full border border-revisit-border bg-white px-5 py-3 text-sm text-revisit-text-secondary shadow-sm">
          <LoaderCircle className="h-4 w-4 animate-spin text-revisit-accent" />
          Loading admin dashboard...
        </div>
      </div>
    )
  }

  if (!loadAdminSession()) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen bg-revisit-bg px-4 pb-16 pt-24 md:px-6 xl:px-8">
      <SEOHead
        title="Admin Dashboard — Revisit"
        description="Admin dashboard for managing Revisit subscription plans and payment history."
        canonicalPath="/admin/dashboard"
      />

      <div className="flex w-full flex-col gap-6">
        <div className="glass-card-strong p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-revisit-border bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-revisit-accent">
                <ShieldCheck className="h-4 w-4" />
                Admin management
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-revisit-text md:text-4xl">
                Subscription and payment dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-revisit-text-secondary md:text-base">
                Supabase provides the user profile records. Google Sheets stores payment history, last payment dates, carry-forward days,
                and the computed renewal expiry for monthly (28 days) and yearly (365 days) renewals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-revisit-border bg-white px-4 py-2 text-sm text-revisit-text-secondary hover:text-revisit-text"
              >
                <ArrowLeft className="h-4 w-4" />
                Website
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={refreshDashboard}
                disabled={isRefreshing}
                className="rounded-full border-revisit-border bg-white"
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="rounded-full border-revisit-border bg-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>

          {dashboardError ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {dashboardError}
            </div>
          ) : null}

          {dashboardDebugInfo ? (
            <div className="mt-5 rounded-2xl border border-revisit-border bg-revisit-bg/70 px-4 py-3 text-sm text-revisit-text-secondary">
              {dashboardDebugInfo}
            </div>
          ) : null}

          {!isGoogleSheetsConfigured ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Google Sheets sync is not configured yet. Set `VITE_GOOGLE_APPS_SCRIPT_URL` or `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL`
              after deploying the generated Apps Script web app.
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-white/60 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Total profiles</CardDescription>
              <CardTitle className="font-heading text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-white/60 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Monthly plans</CardDescription>
              <CardTitle className="font-heading text-3xl">{stats.monthlyUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-white/60 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Yearly plans</CardDescription>
              <CardTitle className="font-heading text-3xl">{stats.yearlyUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-white/60 bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Expiring in 7 days</CardDescription>
              <CardTitle className="font-heading text-3xl">{stats.expiringSoon}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.6fr_0.8fr]">
          <Card className="border-white/60 bg-white/90 shadow-card min-w-0">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="font-heading text-2xl">Plans overview</CardTitle>
                  <CardDescription>
                    Name, email, Supabase plan, current payment plan, expiry, and Google Sheets carry-forward data.
                  </CardDescription>
                </div>

                <div className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-revisit-text-secondary" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search name or email"
                    className="h-11 rounded-2xl border-revisit-border bg-revisit-bg/70 pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="rounded-2xl border border-revisit-border bg-revisit-bg/60 px-3 py-2 text-xs text-revisit-text-secondary md:hidden">
                Swipe horizontally to view all user columns.
              </div>
              <Table className="min-w-[760px]" containerClassName="pb-2 [scrollbar-gutter:stable]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Current plan</TableHead>
                    <TableHead>Plan expiry</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last payment</TableHead>
                    <TableHead>Days left</TableHead>
                    <TableHead className="text-right">History</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length ? (
                    filteredRecords.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>{profile.Name || '—'}</TableCell>
                        <TableCell className="max-w-[18rem] whitespace-normal font-medium text-revisit-text">
                          {profile.email}
                        </TableCell>
                        <TableCell>{formatPlan(profile.plan)}</TableCell>
                        <TableCell>{formatPlan(resolveCurrentPlan(profile))}</TableCell>
                        <TableCell>{formatDate(profile.plan_expires_at)}</TableCell>
                        <TableCell>{formatDate(profile.created_at)}</TableCell>
                        <TableCell>{formatDate(profile.sheetSummary?.lastPaymentDate)}</TableCell>
                        <TableCell>{profile.sheetSummary?.daysLeft ?? '—'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full border-revisit-border bg-white"
                            onClick={() => openPaymentHistory(profile.email)}
                          >
                            Show history
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="py-10 text-center text-revisit-text-secondary">
                        No users matched the current search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-4 min-w-0">
            <Card className="border-white/60 bg-white/90 shadow-card">
              <CardHeader className="px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
                <CardTitle className="flex items-center gap-2 font-heading text-xl sm:text-2xl">
                  <CreditCard className="h-5 w-5 text-revisit-accent" />
                  New payment
                </CardTitle>
                <CardDescription className="leading-6">
                  Add a payment into Google Sheets, then sync the resulting plan expiry back into Supabase.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
                <form className="space-y-4" onSubmit={handleAddPayment}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-revisit-text" htmlFor="payment-email">
                      User email
                    </label>
                    <Input
                      id="payment-email"
                      type="email"
                      value={paymentEmail}
                      onChange={(event) => setPaymentEmail(event.target.value)}
                      placeholder="user@example.com"
                      required
                      className="h-11 rounded-2xl border-revisit-border bg-revisit-bg/70"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 min-w-0">
                      <label className="text-sm font-medium text-revisit-text">Plan</label>
                      <Select value={paymentPlan} onValueChange={(value) => setPaymentPlan(value as PaymentPlan)}>
                        <SelectTrigger className="h-11 w-full rounded-2xl border-revisit-border bg-revisit-bg/70">
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly (28 days)</SelectItem>
                          <SelectItem value="yearly">Yearly (365 days)</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 min-w-0">
                      <label className="text-sm font-medium text-revisit-text" htmlFor="payment-date">
                        Paid on
                      </label>
                      <Input
                        id="payment-date"
                        type="date"
                        value={paidOn}
                        onChange={(event) => setPaidOn(event.target.value)}
                        required
                        className="h-11 w-full rounded-2xl border-revisit-border bg-revisit-bg/70"
                      />
                    </div>
                  </div>

                  {formError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isSubmittingPayment || !isGoogleSheetsConfigured}
                    className="h-11 w-full rounded-2xl bg-revisit-accent text-white hover:bg-revisit-accent-dark"
                  >
                    {isSubmittingPayment ? 'Adding payment...' : 'Add payment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <FeedbacksPanel refreshToken={feedbackRefreshToken} />
      </div>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-2xl rounded-3xl border-white/60 bg-white/95">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Payment history</DialogTitle>
            <DialogDescription>{selectedHistoryEmail || 'Selected user'}</DialogDescription>
          </DialogHeader>

          {isHistoryLoading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-revisit-border bg-revisit-bg/60 px-4 py-3 text-sm text-revisit-text-secondary">
              <LoaderCircle className="h-4 w-4 animate-spin text-revisit-accent" />
              Loading payment history...
            </div>
          ) : historyError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{historyError}</div>
          ) : paymentHistory.length ? (
            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
              {paymentHistory.map((entry) => (
                <div key={entry.paymentId} className="rounded-3xl border border-revisit-border bg-revisit-bg/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-semibold text-revisit-text">{formatPlan(entry.plan)}</div>
                    <div className="text-sm text-revisit-text-secondary">{formatDate(entry.paidOn)}</div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-revisit-text-secondary sm:grid-cols-2">
                    <div>Days added: {entry.daysAdded}</div>
                    <div>Carry forward: {entry.carryForwardDays}</div>
                    <div>Previous expiry: {formatDate(entry.previousExpiry)}</div>
                    <div>New expiry: {formatDate(entry.newExpiry)}</div>
                    <div className="sm:col-span-2">Recorded at: {formatDate(entry.recordedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-revisit-border bg-revisit-bg/60 px-4 py-3 text-sm text-revisit-text-secondary">
              No payment history found for this user in Google Sheets.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminDashboardPage
