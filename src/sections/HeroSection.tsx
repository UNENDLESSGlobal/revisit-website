import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bell, Plus, Menu, BookOpen, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cta = ctaRef.current;
    const card = cardRef.current;
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;

    if (!section || !headline || !subheadline || !cta || !card) return;

    const ctx = gsap.context(() => {
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      loadTl.fromTo(headline, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 });
      loadTl.fromTo(subheadline, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
      loadTl.fromTo(cta, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
      loadTl.fromTo(card, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, '-=0.6');
      
      if (orb1) {
        loadTl.fromTo(orb1, { opacity: 0, scale: 0.8 }, { opacity: 0.35, scale: 1, duration: 1 }, '-=0.8');
      }
      if (orb2) {
        loadTl.fromTo(orb2, { opacity: 0, scale: 0.8 }, { opacity: 0.22, scale: 1, duration: 1 }, '-=0.9');
      }

      loadTl.fromTo('.stat-card-left', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1 }, '-=0.5');
      loadTl.fromTo('.exam-list-right', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.4');

      const isMobile = window.innerWidth < 768;
      
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: isMobile ? '+=80%' : '+=130%',
          pin: true,
          scrub: isMobile ? 0.3 : 0.6,
          onLeaveBack: () => {
            gsap.set([headline, subheadline, cta], { opacity: 1, y: 0 });
            gsap.set(card, { opacity: 1, y: 0, scale: 1 });
            if (orb1) gsap.set(orb1, { opacity: 0.35, x: 0 });
            if (orb2) gsap.set(orb2, { opacity: 0.22, x: 0 });
          },
        },
      });

      scrollTl.fromTo(card, { y: 0, scale: 1, opacity: 1 }, { y: '-22vh', scale: 0.98, opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo([headline, subheadline, cta], { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7);
      
      if (orb1) {
        scrollTl.fromTo(orb1, { x: 0, opacity: 0.35 }, { x: '-6vw', opacity: 0, ease: 'power2.in' }, 0.7);
      }
      if (orb2) {
        scrollTl.fromTo(orb2, { x: 0, opacity: 0.22 }, { x: '6vw', opacity: 0, ease: 'power2.in' }, 0.7);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-revisit-bg overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(123,97,255,0.10), transparent 55%)' }}
      />

      <div ref={orb1Ref} className="orb orb-accent w-[120px] h-[120px] left-[8%] top-[18%] animate-float-slow" />
      <div ref={orb2Ref} className="orb orb-soft w-[160px] h-[160px] right-[10%] bottom-[16%] animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div ref={headlineRef} className="text-center mb-4 mt-16 w-full">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-[5.5rem] font-bold text-revisit-text tracking-tight leading-[1.1] w-full px-4 break-words">
            Your daily life. <span className="text-gradient">REVISITed.</span>
          </h1>
          <h2 className="sr-only">Free Student Manager App for Android - Academic Planner, Attendance Tracker &amp; AI Study Planner by Cynocyte</h2>
        </div>

        <p ref={subheadlineRef} className="text-center text-revisit-text-secondary text-base sm:text-xl max-w-4xl mb-6 px-4 font-medium">
          Your only AI-powered tracker.
        </p>

        <div ref={ctaRef} className="mb-8">
          <Link to="/download" className="btn-primary flex items-center gap-2 inline-flex">
            Download Revisit
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </Link>
        </div>

        <div ref={cardRef} className="w-full max-w-[1100px] glass-card-strong overflow-hidden" style={{ height: 'clamp(380px, 55vh, 520px)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-revisit-border">
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors">
                <Menu className="w-5 h-5 text-revisit-text" />
              </button>
              <span className="font-heading font-semibold text-lg">Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors relative">
                <Bell className="w-5 h-5 text-revisit-text" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-revisit-bg transition-colors">
                <Plus className="w-5 h-5 text-revisit-text" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-65px)]">
            <div className="flex flex-col gap-4">
              <div className="stat-card-left bg-revisit-bg rounded-2xl p-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-revisit-text mb-1">95%</div>
                <div className="text-sm font-medium text-revisit-text">Books Progress</div>
                <div className="text-xs text-revisit-text-secondary mt-1">3 books tracked</div>
              </div>

              <div className="stat-card-left bg-revisit-bg rounded-2xl p-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-revisit-text mb-1">75%</div>
                <div className="text-sm font-medium text-revisit-text">Lowest Attendance</div>
                <div className="text-xs text-revisit-text-secondary mt-1">Across all subjects</div>
              </div>
            </div>

            <div className="exam-list-right bg-revisit-bg rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-revisit-accent" />
                <span className="font-medium text-sm">Upcoming Exams</span>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-revisit-text">maths</div>
                    <div className="text-xs text-revisit-text-secondary">Friday, Apr 10</div>
                  </div>
                  <div className="px-3 py-1 bg-revisit-accent/10 rounded-full">
                    <span className="text-xs font-medium text-revisit-accent">12 days left</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-revisit-text">English</div>
                    <div className="text-xs text-revisit-text-secondary">Friday, May 1</div>
                  </div>
                  <div className="px-3 py-1 bg-revisit-accent/10 rounded-full">
                    <span className="text-xs font-medium text-revisit-accent">33 days left</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-sm text-revisit-text">All caught up!</div>
                  <div className="text-xs text-revisit-text-secondary">No high priority pending tasks.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
