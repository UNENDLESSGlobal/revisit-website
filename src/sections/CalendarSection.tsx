import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, CalendarPlus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CalendarSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const routineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    const routine = routineRef.current;
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

      scrollTl.fromTo(card, { y: '90vh', scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: 'none' }, 0);

      if (label) {
        scrollTl.fromTo(label, { y: -30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0);
      }

      if (header) {
        scrollTl.fromTo(header, { y: -30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05);
      }

      if (grid) {
        const gridItems = grid.querySelectorAll('.calendar-day');
        scrollTl.fromTo(gridItems, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.01, ease: 'none' }, 0.08);
      }

      if (routine) {
        const pills = routine.querySelectorAll('.routine-pill');
        scrollTl.fromTo(pills, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0.15);
      }

      scrollTl.fromTo(card, { y: 0, scale: 1, opacity: 1 }, { y: '-18vh', scale: 0.98, opacity: 0, ease: 'power2.in' }, 0.7);

      if (label) {
        scrollTl.fromTo(label, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7);
      }

      if (grid) {
        const gridItems = grid.querySelectorAll('.calendar-day');
        scrollTl.fromTo(gridItems, { x: 0, opacity: 1 }, { x: (i) => (i % 2 === 0 ? '-3vw' : '3vw'), opacity: 0, stagger: 0.005, ease: 'power2.in' }, 0.72);
      }

      if (routine) {
        scrollTl.fromTo(routine, { y: 0, opacity: 1 }, { y: '8vh', opacity: 0, ease: 'power2.in' }, 0.75);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const routineDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-revisit-bg overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 55%, rgba(123,97,255,0.10), transparent 55%)' }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div ref={labelRef} className="text-center mb-4">
          <span className="section-label">Schedule</span>
          <p className="text-revisit-text-secondary text-sm sm:text-base max-w-md mx-auto">
            See your month at a glance. Build routines that repeat.
          </p>
        </div>

        <div ref={cardRef} className="w-full max-w-[1080px] glass-card-strong overflow-hidden" style={{ minHeight: 'clamp(450px, 65vh, 580px)' }}>
          <div ref={headerRef} className="flex items-center justify-between px-6 py-4 border-b border-revisit-border">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors">
                <ChevronLeft className="w-5 h-5 text-revisit-text" />
              </button>
              <span className="font-heading font-semibold text-lg">March 2026</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors">
                <ChevronRight className="w-5 h-5 text-revisit-text" />
              </button>
            </div>
            <span className="font-heading font-semibold text-xl">Calendar</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-revisit-text-secondary py-2">
                  {day}
                </div>
              ))}
            </div>

            <div ref={gridRef} className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <div
                  key={day}
                  className={`calendar-day aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    day === 28 ? 'bg-revisit-accent text-white' : 'hover:bg-revisit-bg text-revisit-text'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div ref={routineRef} className="mt-6">
              <div className="text-sm font-medium text-revisit-text mb-3">My Routine</div>
              <div className="flex gap-2 flex-wrap">
                {routineDays.map((day) => (
                  <button
                    key={day}
                    className={`routine-pill px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      day === 'Sat' ? 'bg-revisit-accent text-white' : 'bg-revisit-bg text-revisit-text hover:bg-revisit-accent/10'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-revisit-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-revisit-text">Custom Calendars</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors">
                  <CalendarPlus className="w-4 h-4 text-revisit-text-secondary" />
                </button>
              </div>
              <div className="mt-3 p-4 bg-revisit-bg rounded-xl text-center">
                <div className="text-sm text-revisit-text-secondary">No custom calendars yet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
