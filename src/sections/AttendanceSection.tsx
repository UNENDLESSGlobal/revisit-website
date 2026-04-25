import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X, RotateCcw, MoreVertical, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AttendanceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const visualPercentage = 75.0;
  const displayPercentage = 75;
  const radius = 40;
  const circumference = Math.PI * radius; // Approx 125.66
  const targetOffset = circumference - (circumference * (visualPercentage / 100));

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const chart = chartRef.current;
    const stats = statsRef.current;
    const banner = bannerRef.current;
    const label = labelRef.current;

    if (!section || !card) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: isMobile ? '+=80%' : '+=130%',
          pin: true,
          scrub: isMobile ? 0.3 : 0.6,
        },
      });

      scrollTl.fromTo(card, { y: '100vh', scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: 'none' }, 0);

      if (label) {
        scrollTl.fromTo(label, { y: -30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05);
      }

      if (chart) {
        const arc = chart.querySelector('.attendance-arc');
        if (arc) {
          scrollTl.fromTo(arc, { strokeDashoffset: circumference }, { strokeDashoffset: targetOffset, ease: 'none' }, 0.05);
        }
        scrollTl.fromTo(chart.querySelector('.percentage-text'), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0.12);
      }

      if (stats) {
        const statItems = stats.querySelectorAll('.stat-item');
        scrollTl.fromTo(statItems, { x: '8vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 0.1);
      }

      if (banner) {
        scrollTl.fromTo(banner, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.18);
      }

      scrollTl.fromTo(card, { y: 0, opacity: 1 }, { y: '-16vh', opacity: 0, ease: 'power2.in' }, 0.7);

      if (label) {
        scrollTl.fromTo(label, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7);
      }

      if (chart) {
        scrollTl.fromTo(chart, { scale: 1, opacity: 1 }, { scale: 0.92, opacity: 0, ease: 'power2.in' }, 0.72);
      }

      if (banner) {
        scrollTl.fromTo(banner, { y: 0, opacity: 1 }, { y: '10vh', opacity: 0, ease: 'power2.in' }, 0.75);
      }
    }, section);

    return () => ctx.revert();
  }, [circumference, targetOffset]);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-revisit-bg overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123,97,255,0.10), transparent 55%)' }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div ref={labelRef} className="text-center mb-4">
          <span className="section-label">Attendance</span>
          <p className="text-revisit-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Know exactly where you stand—before it becomes a problem. Calculate attendance without the total number of days!
          </p>
        </div>

        <div ref={cardRef} className="w-full max-w-[980px] glass-card-strong overflow-hidden" style={{ minHeight: 'clamp(450px, 62vh, 540px)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-revisit-border">
            <div className="flex items-center gap-3">
              <span className="font-heading font-semibold text-lg">Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-revisit-accent/10 rounded-full text-xs font-medium text-revisit-accent">Auto</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors">
                <RotateCcw className="w-4 h-4 text-revisit-text-secondary" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors">
                <MoreVertical className="w-4 h-4 text-revisit-text-secondary" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={chartRef} className="flex flex-col items-center">
              <div className="relative w-48 h-40">
                <svg viewBox="0 0 100 60" className="w-full h-full" style={{ overflow: 'visible' }}>
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
                  <path
                    className="attendance-arc"
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#7B61FF"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                  />
                </svg>
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <span className="percentage-text text-4xl font-bold text-revisit-accent">{displayPercentage}%</span>
                </div>
              </div>

              <div ref={statsRef} className="w-full mt-4 space-y-2">
                <div className="stat-item flex items-center justify-between py-2 border-b border-revisit-border">
                  <span className="text-sm text-revisit-text-secondary">Attended</span>
                  <span className="text-lg font-semibold text-emerald-600">75</span>
                </div>
                <div className="stat-item flex items-center justify-between py-2 border-b border-revisit-border">
                  <span className="text-sm text-revisit-text-secondary">Total Working</span>
                  <span className="text-lg font-semibold text-revisit-text">100</span>
                </div>
                <div className="stat-item flex items-center justify-between py-2">
                  <span className="text-sm text-revisit-text-secondary">Absent</span>
                  <span className="text-lg font-semibold text-red-500">25</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div ref={bannerRef} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-emerald-800">75% attendance reached</div>
                    <div className="text-xs text-emerald-600 mt-1">You are in the safe zone!</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-revisit-accent text-white rounded-xl font-medium transition-all hover:bg-revisit-accent-dark active:scale-95">
                  <Check className="w-4 h-4" />
                  Present
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-revisit-bg text-revisit-text-secondary rounded-xl font-medium transition-all hover:bg-gray-200 active:scale-95">
                  <X className="w-4 h-4" />
                  Absent
                </button>
              </div>

              <div className="bg-revisit-bg rounded-2xl p-4 mt-auto">
                <div className="text-sm font-medium text-revisit-text mb-2">School</div>
                <div className="text-xs text-revisit-text-secondary">Currently tracking attendance for all subjects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AttendanceSection;
