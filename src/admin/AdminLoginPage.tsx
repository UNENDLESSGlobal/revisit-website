import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { saveAdminSession, loadAdminSession } from './session'
import { hasAdminAccess, signInWithPassword, signOutFromSupabase } from '@/lib/supabase'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (loadAdminSession()) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    setError('')
    setDebugInfo('')

    try {
      const session = await signInWithPassword(email.trim(), password)
      setDebugInfo(`Password sign-in succeeded for ${session.email}. Checking admin_dashboard access...`)
      const adminAccess = await hasAdminAccess(session.email, session.accessToken)

      if (!adminAccess.isAdmin) {
        await signOutFromSupabase(session.accessToken)
        setDebugInfo(adminAccess.message ?? 'Password sign-in succeeded, but admin access was denied.')
        throw new Error(adminAccess.message ?? 'Admin access denied.')
      }

      setDebugInfo(`Admin access granted for ${session.email}. Redirecting to dashboard...`)
      saveAdminSession(session)
      navigate('/admin/dashboard', { replace: true })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to sign in. Please verify the account and password.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-revisit-bg px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 md:pb-20 md:pt-28">
      <SEOHead
        title="Admin Login — Revisit Dashboard"
        description="Restricted admin sign-in for the Revisit management dashboard."
        canonicalPath="/admin"
      />

      <div className="orb orb-accent left-[8%] top-[12%] h-[14rem] w-[14rem] animate-float-slow opacity-30 sm:h-[18rem] sm:w-[18rem]" />
      <div
        className="orb orb-soft bottom-[12%] right-[8%] h-[18rem] w-[18rem] animate-float opacity-25 sm:h-[24rem] sm:w-[24rem]"
        style={{ animationDelay: '1s' }}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 sm:gap-6 lg:gap-8">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-revisit-border bg-white/75 px-4 py-2 text-sm text-revisit-text-secondary backdrop-blur-sm hover:text-revisit-text sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card-strong p-5 sm:p-8 md:p-10">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-revisit-border bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-revisit-accent sm:text-xs sm:tracking-[0.2em]">
              <ShieldCheck className="h-4 w-4" />
              Restricted access
            </div>
            <h1 className="max-w-xl font-heading text-3xl font-bold tracking-tight text-revisit-text sm:text-4xl md:text-5xl">
              Revisit admin dashboard login
            </h1>

            <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50/90 p-4 shadow-sm sm:mt-6 sm:p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 sm:text-xs">
                Authorized users only
              </div>
              <p className="mt-2 max-w-lg text-sm leading-6 text-amber-950 sm:text-base">
                Only approved admin accounts can log in to this dashboard.
              </p>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-revisit-text-secondary sm:mt-8 sm:gap-4">
              <div className="rounded-2xl border border-revisit-border bg-white/70 p-4 sm:rounded-3xl sm:p-5">
                <div className="mb-2 font-semibold text-revisit-text">No sign-up route</div>
                Access is limited to existing authorized admin users.
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-white/60 bg-white/90 shadow-card">
            <CardHeader className="px-5 pb-4 pt-6 sm:px-6">
              <CardTitle className="flex items-center gap-2 font-heading text-2xl">
                <LockKeyhole className="h-5 w-5 text-revisit-accent" />
                Sign in
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-6 sm:px-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-revisit-text" htmlFor="admin-email">
                    Email
                  </label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="h-11 rounded-2xl border-revisit-border bg-revisit-bg/70"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-revisit-text" htmlFor="admin-password">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      autoComplete="current-password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                      className="h-11 rounded-2xl border-revisit-border bg-revisit-bg/70 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-revisit-text-secondary hover:text-revisit-text"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                ) : null}

                {debugInfo ? (
                  <div className="rounded-2xl border border-revisit-border bg-revisit-bg/70 px-4 py-3 text-sm text-revisit-text-secondary">
                    {debugInfo}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-2xl bg-revisit-accent text-white hover:bg-revisit-accent-dark"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
