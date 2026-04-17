import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  Bug,
  CalendarClock,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  LoaderCircle,
  LogOut,
  RefreshCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
} from '@/lib/google-sheets'
import {
  fetchProfiles,
  hasAdminAccess,
  signOutFromSupabase,
  updateProfilePlan,
  type AuthenticatedSupabaseSession,
  type ProfileRecord,
} from '@/lib/supabase'
import { clearAdminSession, ensureFreshAdminSession, loadAdminSession } from './session'

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

const adminSetupFlow = [
  {
    step: '1',
    title: 'Admin login',
    description:
      'The `/admin` page signs in with Supabase Auth, verifies the email in `admin_dashboard`, then stores the access and refresh tokens in local storage.',
  },
  {
    step: '2',
    title: 'Dashboard bootstrap',
    description:
      'The dashboard refreshes the saved session, loads profile rows from Supabase, and loads payment summaries from the Apps Script `listUsers` endpoint.',
  },
  {
    step: '3',
    title: 'Payment write path',
    description:
      'Adding a payment posts to Apps Script, appends a row in `Payments`, updates the `Users` summary sheet, and syncs the new `plan` and `plan_expires_at` values back into Supabase.',
  },
  {
    step: '4',
    title: 'History and renewals',
    description:
      'Payment history comes from the Apps Script `paymentHistory` endpoint. Monthly renewals add 28 days, yearly renewals add 365 days, and early renewals carry forward the remaining days.',
  },
] as const

const adminSetupFiles = [
  {
    title: 'Supabase SQL setup',
    href: '/admin-setup/supabase-admin-dashboard-setup.txt',
    format: '.txt',
    description: 'Creates the admin table, helper function, and RLS policies used by the dashboard.',
  },
  {
    title: 'Google Apps Script',
    href: '/admin-setup/google-apps-script.txt',
    format: '.txt',
    description: 'Restores the web app backend that reads users, writes payments, and syncs plans.',
  },
  {
    title: 'Users sheet header template',
    href: '/admin-setup/users_template.csv',
    format: '.csv',
    description: 'Header row for the `Users` sheet that stores current plan state per email.',
  },
  {
    title: 'Payments sheet header template',
    href: '/admin-setup/payments_template.csv',
    format: '.csv',
    description: 'Header row for the `Payments` sheet that stores every payment transaction.',
  },
] as const

const adminEnvVariables = [
  {
    key: 'VITE_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL',
    description: 'Base URL for Supabase Auth and REST requests. Either public prefix is supported.',
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Anon key used by the website when authenticating admins and reading data through RLS.',
  },
  {
    key: 'VITE_GOOGLE_APPS_SCRIPT_URL / NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL',
    description: 'Deployed web app URL for listing users, adding payments, and loading history.',
  },
] as const

const adminResourceLinks = [
  {
    title: 'Supabase project',
    href: 'https://supabase.com/dashboard/project/ngmevcymxvjsjhsbaure',
    description: 'Tables, Auth users, SQL editor, and RLS policies.',
  },
  {
    title: 'Google Sheets file',
    href: 'https://docs.google.com/spreadsheets/d/1q-HCVX_shzkssiSU91pzBIVt_xGonWYmIfOeQ8C-xcQ/edit?gid=1402976226#gid=1402976226',
    description: 'Stores payment rows and current user summaries.',
  },
  {
    title: 'Google Apps Script project',
    href: 'https://script.google.com/u/0/home/projects/1SEPKNzlEanvSouXlUTy_jhxNBl5p6PMNaUx9uAc7Pfiel6g1gvlNiDqr/edit',
    description: 'Server-side script deployed as the web app used by the dashboard.',
  },
] as const

const adminCodePaths = [
  'src/admin/AdminLoginPage.tsx',
  'src/admin/AdminDashboardPage.tsx',
  'src/admin/session.ts',
  'src/lib/supabase.ts',
  'src/lib/google-sheets.ts',
] as const

const adminDebugSections = [
  {
    value: 'supabase',
    title: 'Supabase and admin access',
    description: 'Use this when sign-in works but the dashboard still denies access or redirects back to login.',
    items: [
      'Confirm the admin can sign in through Supabase Auth with the exact same email stored in `public.admin_dashboard`.',
      'Run the SQL setup file so the `admin_dashboard` table, `is_dashboard_admin()` helper, and RLS policies all exist together.',
      'If the UI says `admin_dashboard could not be read`, the row-level security policies or grants are incomplete.',
      'If the dashboard loads and then instantly returns to `/admin`, the saved refresh token is probably expired or the email lost admin access.',
    ],
    snippet: `create table if not exists public.admin_dashboard (\n  email text primary key,\n  created_at timestamptz not null default now()\n);\n\ncreate or replace function public.is_dashboard_admin()\nreturns boolean\nlanguage sql\nstable\nas $$\n  select exists (\n    select 1\n    from public.admin_dashboard\n    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))\n  );\n$$;`,
  },
  {
    value: 'sheets',
    title: 'Google Sheets and Apps Script',
    description: 'Use this when the payment summary is empty, history fails to load, or adding a payment throws an error.',
    items: [
      'Deploy the Apps Script as a web app and paste that deployment URL into `VITE_GOOGLE_APPS_SCRIPT_URL` or `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL`.',
      'Set the Apps Script properties exactly: spreadsheet IDs, sheet names, `SUPABASE_URL`, and a valid `SUPABASE_SERVICE_ROLE_KEY`.',
      'The `Payments` and `Users` tabs must use the same headers as the CSV templates in `/public/admin-setup`.',
      'After changing Apps Script code or properties, redeploy the web app so the dashboard calls the latest version.',
    ],
    snippet: `PAYMENTS_SPREADSHEET_ID=your-sheet-id\nPAYMENTS_SHEET_NAME=Payments\nUSERS_SPREADSHEET_ID=your-sheet-id\nUSERS_SHEET_NAME=Users\nSUPABASE_URL=https://your-project.supabase.co\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key`,
  },
  {
    value: 'symptoms',
    title: 'Common symptoms and what they mean',
    description: 'Use these quick interpretations to narrow the fault before changing code.',
    items: [
      'Profiles load but sheet values are blank: the Apps Script URL is missing, wrong, or returning an error for `listUsers`.',
      'Payment submission fails after form validation: the Apps Script POST failed, the script properties are incomplete, or the service role sync back to Supabase failed.',
      'Plan expiry looks wrong: verify the `paid_on`, `previous_expiry`, and `carry_forward_days` values inside the `Payments` sheet.',
      'Login says password sign-in succeeded but admin access denied: the email is not present in `public.admin_dashboard`.',
    ],
  },
] as const

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

  const filteredRecords = useMemo(() => {
    const normalizedSearch = normalizeEmail(searchQuery)
    const records = profiles.map<DashboardRecord>((profile) => ({
      ...profile,
      sheetSummary: sheetSummaryMap[normalizeEmail(profile.email)],
    }))

    if (!normalizedSearch) {
      return records
    }

    return records.filter((profile) => normalizeEmail(profile.email).includes(normalizedSearch))
  }, [profiles, searchQuery, sheetSummaryMap])

  const stats = useMemo(() => {
    const totalUsers = profiles.length
    const monthlyUsers = profiles.filter((profile) => profile.plan === 'monthly').length
    const yearlyUsers = profiles.filter((profile) => profile.plan === 'yearly').length
    const expiringSoon = profiles.filter((profile) => isExpiringSoon(profile.plan_expires_at)).length

    return { totalUsers, monthlyUsers, yearlyUsers, expiringSoon }
  }, [profiles])

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
        plan: result.summary.currentPlan || paymentPlan,
        plan_expires_at: result.summary.currentPlanExpiresAt || null,
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

        <Tabs defaultValue="plans" className="gap-4">
          <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-3xl bg-white/90 p-1 shadow-sm sm:w-fit">
            <TabsTrigger value="plans" className="rounded-full px-5 py-2 data-[state=active]:bg-revisit-accent data-[state=active]:text-white">
              Plans
            </TabsTrigger>
            <TabsTrigger value="setup" className="rounded-full px-5 py-2 data-[state=active]:bg-revisit-accent data-[state=active]:text-white">
              Setup Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1.6fr_0.8fr]">
              <Card className="border-white/60 bg-white/90 shadow-card min-w-0">
                <CardHeader className="gap-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="font-heading text-2xl">Plans overview</CardTitle>
                      <CardDescription>
                        Email, plan, expiry, sign-up date, last payment date, and Google Sheets carry-forward data.
                      </CardDescription>
                    </div>

                    <div className="relative w-full max-w-sm">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-revisit-text-secondary" />
                      <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search email"
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
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
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
                            <TableCell className="max-w-[18rem] whitespace-normal font-medium text-revisit-text">
                              {profile.email}
                            </TableCell>
                            <TableCell>{formatPlan(profile.plan)}</TableCell>
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
                          <TableCell colSpan={7} className="py-10 text-center text-revisit-text-secondary">
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
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-white/60 bg-white/90 shadow-card">
                <CardHeader className="gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-revisit-border bg-white/70 text-revisit-text">
                      Supabase Auth
                    </Badge>
                    <Badge variant="outline" className="border-revisit-border bg-white/70 text-revisit-text">
                      admin_dashboard
                    </Badge>
                    <Badge variant="outline" className="border-revisit-border bg-white/70 text-revisit-text">
                      Google Sheets
                    </Badge>
                    <Badge variant="outline" className="border-revisit-border bg-white/70 text-revisit-text">
                      Apps Script
                    </Badge>
                    <Badge variant="outline" className="border-revisit-border bg-white/70 text-revisit-text">
                      Local session
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2 font-heading text-2xl md:text-3xl">
                      <CalendarClock className="h-5 w-5 text-revisit-accent" />
                      How this admin setup works
                    </CardTitle>
                    <CardDescription className="mt-2 max-w-3xl">
                      This page joins three moving parts: Supabase Auth for admin login, the `profiles` table for plan state, and a
                      Google Sheets plus Apps Script backend for payment history and renewal calculations.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {adminSetupFlow.map((item) => (
                      <div key={item.step} className="rounded-3xl border border-revisit-border bg-revisit-bg/60 p-5">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-revisit-accent text-sm font-semibold text-white">
                            {item.step}
                          </div>
                          <div className="font-semibold text-revisit-text">{item.title}</div>
                        </div>
                        <p className="text-sm leading-6 text-revisit-text-secondary">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-revisit-border bg-white/70 p-5">
                    <div className="mb-4 flex items-center gap-2 text-base font-semibold text-revisit-text">
                      <CalendarClock className="h-4 w-4 text-revisit-accent" />
                      Renewal rules used by both Sheets and the dashboard
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-revisit-border bg-revisit-bg/70 p-4">
                        <div className="text-sm font-semibold text-revisit-text">Monthly plan</div>
                        <p className="mt-2 text-sm text-revisit-text-secondary">Adds 28 days from the payment date before carry-forward is applied.</p>
                      </div>
                      <div className="rounded-2xl border border-revisit-border bg-revisit-bg/70 p-4">
                        <div className="text-sm font-semibold text-revisit-text">Yearly plan</div>
                        <p className="mt-2 text-sm text-revisit-text-secondary">Adds 365 days from the payment date before carry-forward is applied.</p>
                      </div>
                      <div className="rounded-2xl border border-revisit-border bg-revisit-bg/70 p-4">
                        <div className="text-sm font-semibold text-revisit-text">Carry-forward</div>
                        <p className="mt-2 text-sm text-revisit-text-secondary">If a user renews early, the remaining days from the old expiry are added to the new renewal.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/60 bg-white/90 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-heading text-2xl">
                    <FileText className="h-5 w-5 text-revisit-accent" />
                    Setup files and references
                  </CardTitle>
                  <CardDescription>Use these files and links when recreating or debugging the admin stack.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {adminSetupFiles.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start justify-between gap-4 rounded-3xl border border-revisit-border bg-revisit-bg/60 p-5 text-sm text-revisit-text-secondary transition-colors hover:border-revisit-accent"
                      >
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2 font-semibold text-revisit-text">
                            {item.title}
                            <span className="rounded-full bg-white px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-revisit-accent">
                              {item.format}
                            </span>
                          </div>
                          <p>{item.description}</p>
                        </div>
                        <Download className="mt-1 h-4 w-4 shrink-0 text-revisit-accent" />
                      </a>
                    ))}
                  </div>

                  <div className="rounded-3xl bg-slate-950 px-4 py-4 text-slate-100">
                    <div className="mb-3 text-sm font-semibold text-white">Required website environment variables</div>
                    <div className="space-y-3">
                      {adminEnvVariables.map((item) => (
                        <div key={item.key} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                          <div className="font-mono text-[11px] text-emerald-300">{item.key}</div>
                          <p className="mt-1 text-xs leading-5 text-slate-300">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {adminResourceLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-3xl border border-revisit-border bg-revisit-bg/60 p-5 text-sm text-revisit-text-secondary transition-colors hover:border-revisit-accent"
                      >
                        <div className="mb-2 flex items-center gap-2 font-semibold text-revisit-text">
                          {item.title}
                          <ExternalLink className="h-4 w-4 text-revisit-accent" />
                        </div>
                        {item.description}
                      </a>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-revisit-border bg-white/70 p-5">
                    <div className="mb-3 text-sm font-semibold text-revisit-text">Code paths to inspect while debugging</div>
                    <div className="flex flex-wrap gap-2">
                      {adminCodePaths.map((item) => (
                        <code
                          key={item}
                          className="rounded-full border border-revisit-border bg-revisit-bg/70 px-3 py-2 text-xs text-revisit-text"
                        >
                          {item}
                        </code>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/60 bg-white/90 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-2xl">
                  <Bug className="h-5 w-5 text-revisit-accent" />
                  Debug and recovery playbook
                </CardTitle>
                <CardDescription>
                  Start here when login, profile reads, Google Sheets sync, or payment updates stop behaving as expected.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {adminDebugSections.map((section) => (
                    <AccordionItem key={section.value} value={section.value} className="border-revisit-border">
                      <AccordionTrigger className="py-5 text-left hover:no-underline">
                        <div>
                          <div className="text-base font-semibold text-revisit-text">{section.title}</div>
                          <div className="mt-1 text-sm font-normal leading-6 text-revisit-text-secondary">
                            {section.description}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          {section.items.map((item) => (
                            <div key={item} className="rounded-3xl border border-revisit-border bg-revisit-bg/60 p-4 text-sm leading-6 text-revisit-text-secondary">
                              {item}
                            </div>
                          ))}
                        </div>

                        {'snippet' in section ? (
                          <pre className="overflow-x-auto rounded-3xl bg-slate-950 px-4 py-4 text-xs leading-6 text-slate-100">
                            {section.snippet}
                          </pre>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
