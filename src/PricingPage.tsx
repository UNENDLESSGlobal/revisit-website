import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from './components/SEOHead';

const yearlyPrice = 999;
const monthlyPrice = 99;
const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

const topSignals = [
  {
    value: '₹83/mo',
    label: 'effective monthly cost on yearly billing',
    valueClassName: 'text-revisit-accent',
  },
  {
    value: `₹${yearlySavings} saved`,
    label: 'compared with paying monthly for 12 months',
    valueClassName: 'text-emerald-600',
  },
  {
    value: 'Unlimited AI',
    label: 'included with every Premium plan',
    valueClassName: 'text-amber-600',
  },
];

const freePlanPoints = [
  'Limited planning and tracking tools',
  'Tasks, calendar, routines, and attendance',
  'Ads remain in the experience',
  'Unlimited AI access is not included',
];

const premiumPlanPoints = [
  'Ad-free workflow across the app',
  'Unlimited AI access for study planning',
  'All core planning and tracking tools included',
  'Premium pricing valid till official launch',
];

const comparisonRows = [
  {
    label: 'Tasks, calendar, routines and reminders',
    free: { text: 'Included', positive: true },
    premium: { text: 'Included', positive: true },
  },
  {
    label: 'Attendance tracking without Total no. of Days',
    free: { text: 'No', positive: false },
    premium: { text: 'Included', positive: true },
  },
  {
    label: 'Ad-free experience',
    free: { text: 'No', positive: false },
    premium: { text: 'Yes', positive: true },
  },
  {
    label: 'Unlimited AI access',
    free: { text: 'No', positive: false },
    premium: { text: 'Yes', positive: true },
  },
  {
    label: 'Best fit',
    free: { text: 'Trying Revisit first', positive: null },
    premium: { text: 'Using Revisit Daily', positive: null },
  },
];

const premiumReasons = [
  {
    icon: ShieldCheck,
    title: 'Protect focus',
    description: 'Paid plans remove ad interruptions, which makes the app feel calmer during daily use.',
  },
  {
    icon: Sparkles,
    title: 'Use AI without rationing',
    description: 'Premium unlocks unlimited AI help when deadlines pile up or exams get close.',
  },
];

const PricingPage = () => {
  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 items-center">
      <SEOHead
        title="Revisit Pricing — Free & Premium Plans for Students"
        description="Compare Revisit Free and Premium plans. Upgrade for an ad-free experience, unlimited AI access, and yearly savings at ₹999/year or ₹99/month."
        canonicalPath="/pricing"
      />

      <Link
        to="/"
        className="absolute top-32 md:top-40 left-6 md:left-12 flex items-center gap-2 text-revisit-text-secondary hover:text-revisit-text transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="orb orb-accent w-[300px] h-[300px] left-[10%] top-[10%] animate-float-slow opacity-30" />
      <div
        className="orb orb-soft w-[420px] h-[420px] right-[5%] bottom-[8%] animate-float opacity-20"
        style={{ animationDelay: '1s' }}
      />

      <div
        className="absolute inset-x-0 top-0 h-[460px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(123,97,255,0.12), transparent 48%), radial-gradient(circle at 82% 24%, rgba(245,158,11,0.10), transparent 24%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mt-12 mb-24">
        <div className="max-w-4xl mx-auto text-center">

          <h1 className="font-heading text-4xl md:text-6xl font-bold text-revisit-text tracking-tight text-balance mb-6 mt-16">
            Pick the plan that keeps you <span className="text-gradient">in flow.</span>
          </h1>

          <p className="text-revisit-text-secondary text-lg md:text-xl max-w-3xl mx-auto text-balance">
            Free is useful for trying Revisit. Premium is the version built for regular use:
            ad-free, unlimited AI, and priced to reward users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-5xl mx-auto">
          {topSignals.map((signal) => (
            <div
              key={signal.value}
              className="glass-card px-5 py-5 rounded-[1.75rem] border border-white/60 shadow-sm text-center"
            >
              <div className={`text-2xl font-bold ${signal.valueClassName}`}>{signal.value}</div>
              <p className="text-sm text-revisit-text-secondary mt-2">{signal.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr_0.95fr] gap-6 mt-10 items-stretch">
          <div className="order-3 lg:order-1 glass-card flex flex-col p-8 rounded-[2rem] border border-revisit-border/80 shadow-sm bg-white/70">
            <div className="mb-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-revisit-border text-xs font-semibold text-revisit-text-secondary">
                Free
              </div>
              <h2 className="font-heading text-3xl font-bold text-revisit-text mt-5">Try Revisit first</h2>
              <p className="text-revisit-text-secondary mt-2 text-sm">
                Good for exploring the app before you commit to the smoother paid experience.
              </p>
            </div>

            <div className="text-left mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-revisit-text">₹0</span>
                <span className="text-revisit-text-secondary text-sm">/month</span>
              </div>
              <p className="text-xs text-revisit-text-secondary mt-3">
                Best if you only need a short trial before deciding.
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {freePlanPoints.map((point) => {
                const isPositive = !point.includes('not included') && !point.includes('Ads remain');

                return (
                  <div key={point} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isPositive ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}
                    >
                      {isPositive ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <CircleAlert className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                    <span
                      className={`text-sm leading-6 ${
                        isPositive ? 'text-revisit-text font-medium' : 'text-revisit-text-secondary'
                      }`}
                    >
                      {point}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link
              to="/download"
              className="btn-secondary w-full py-3.5 rounded-full font-semibold block text-center mt-8"
            >
              Continue with Free
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative overflow-hidden rounded-[2.4rem] border-2 border-revisit-accent bg-white shadow-[0_30px_80px_rgba(123,97,255,0.18)]">
            <div className="absolute inset-x-0 top-0 h-36 accent-gradient opacity-10 pointer-events-none" />

            <div className="relative p-8 md:p-10 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-revisit-accent text-white text-xs font-semibold rounded-full shadow-md">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Best Value</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save ₹{yearlySavings} every year</span>
                </div>
              </div>

              <div className="mb-8 text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-revisit-accent/80 mb-3">
                  Premium Yearly
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-revisit-text">
                  The plan to choose if Revisit is part of your weekly routine
                </h2>
                <p className="text-revisit-text-secondary mt-3 text-sm md:text-base max-w-xl">
                  Remove monthly decision fatigue, keep the app ad-free, and bring the effective cost
                  down to just ₹83 per month.
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-3 mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-bold text-revisit-accent">₹999</span>
                  <span className="text-revisit-accent/80 text-base">/year</span>
                </div>
                <div className="pb-2">
                  <div className="text-sm text-revisit-text-secondary line-through">₹1,188 billed monthly</div>
                  <div className="text-sm font-semibold text-emerald-600">Only ₹83/month effective price</div>
                </div>
              </div>

              <Link
                to="/download"
                className="accent-gradient w-full py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:text-white transition-all block text-center"
              >
                <span className="inline-flex items-center gap-2">
                  Download &amp; Lock Yearly
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <div className="space-y-4 mt-8 flex-1">
                {premiumPlanPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm leading-6 text-revisit-text font-medium">{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="text-sm font-medium text-amber-800">
                  If you already know you will use Revisit beyond a quick trial, the yearly plan is the
                  strongest value by a clear margin.
                </p>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-3 glass-card-strong relative flex flex-col p-8 rounded-[2rem] border border-revisit-accent/25 shadow-lg bg-white/85">
            <div className="absolute top-6 right-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-revisit-accent/10 text-revisit-accent text-xs font-semibold rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flexible</span>
              </div>
            </div>

            <div className="mb-8 text-left pr-16">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-revisit-accent/80 mb-3">
                Premium Monthly
              </p>
              <h2 className="font-heading text-3xl font-bold text-revisit-text">
                Start premium now without the yearly commitment
              </h2>
              <p className="text-revisit-text-secondary mt-3 text-sm">
                Ideal if you want the full experience right away and prefer to decide month by month.
              </p>
            </div>

            <div className="text-left mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-revisit-accent">₹99</span>
                <span className="text-revisit-accent/80 text-sm">/month</span>
              </div>
              <p className="text-xs text-revisit-text-secondary mt-3">
                Switch to yearly later if you want the lowest effective monthly cost.
              </p>
            </div>

            <Link
              to="/download"
              className="btn-primary w-full py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:text-white transition-all block text-center"
            >
              <span className="inline-flex items-center gap-2">
                Download &amp; Go Premium
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <div className="space-y-4 mt-8 flex-1">
              {premiumPlanPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm leading-6 text-revisit-text font-medium">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.25rem] border border-revisit-border bg-revisit-bg/80 px-4 py-4">
              <p className="text-sm text-revisit-text-secondary">
                Monthly keeps the commitment light. Yearly is still the smarter economic anchor if you
                expect to keep using the app through the semester.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 mt-8">
          <div className="glass-card-strong p-8 rounded-[2rem] border border-white/60 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-revisit-accent/80 mb-3">
                  Compare plans
                </p>
                <h2 className="font-heading text-3xl font-bold text-revisit-text">
                  What actually changes when you upgrade
                </h2>
              </div>
              <p className="text-sm text-revisit-text-secondary max-w-sm">
                Both tiers cover the basics. Premium is where you remove distractions and unlock
                unlimited AI help.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[1.5rem] border border-revisit-border">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr] bg-revisit-bg/80 text-sm font-semibold text-revisit-text">
                  <div className="px-4 py-4">Feature</div>
                  <div className="px-4 py-4 border-l border-revisit-border text-center">Free</div>
                  <div className="px-4 py-4 border-l border-revisit-border text-center">Premium</div>
                </div>

                {comparisonRows.map((row, index) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[1.3fr_0.8fr_0.8fr] text-sm ${
                      index !== comparisonRows.length - 1 ? 'border-t border-revisit-border' : ''
                    }`}
                  >
                    <div className="px-4 py-4 text-revisit-text font-medium">{row.label}</div>

                    <div className="px-4 py-4 border-l border-revisit-border flex items-center justify-center">
                      <span
                        className={`${
                          row.free.positive === true
                            ? 'text-emerald-600 font-semibold'
                            : row.free.positive === false
                              ? 'text-revisit-text-secondary'
                              : 'text-revisit-text'
                        }`}
                      >
                        {row.free.positive === true ? '✓ ' : row.free.positive === false ? '× ' : ''}
                        {row.free.text}
                      </span>
                    </div>

                    <div className="px-4 py-4 border-l border-revisit-border flex items-center justify-center">
                      <span
                        className={`${
                          row.premium.positive === true
                            ? 'text-emerald-600 font-semibold'
                            : row.premium.positive === false
                              ? 'text-revisit-text-secondary'
                              : 'text-revisit-text'
                        }`}
                      >
                        {row.premium.positive === true ? '✓ ' : row.premium.positive === false ? '× ' : ''}
                        {row.premium.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-white/60 shadow-sm bg-white/80">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-revisit-accent/80 mb-3">
                Why premium wins
              </p>
              <h2 className="font-heading text-3xl font-bold text-revisit-text">
                Why Premium feels better every day
              </h2>
            </div>

            <div className="space-y-5">
              {premiumReasons.map((reason) => (
                <div key={reason.title} className="rounded-[1.5rem] border border-revisit-border bg-revisit-bg/65 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <reason.icon className="w-5 h-5 text-revisit-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-revisit-text">{reason.title}</h3>
                      <p className="text-sm text-revisit-text-secondary mt-1 leading-6">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-[1.5rem] border border-amber-200 bg-amber-50">
              <p className="text-sm font-medium text-amber-800">
                Free is still here if you want to explore first. Premium makes more sense once
                Revisit becomes part of your weekly routine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
