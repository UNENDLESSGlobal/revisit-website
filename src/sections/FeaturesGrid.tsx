import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, CheckCircle2, BookOpen, Clock, ListTodo, Sparkles, Briefcase, Plus, Bell, BarChart3 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeaturesGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const wideCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    const wideCard = wideCardRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      if (heading) {
        gsap.fromTo(heading, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }

      if (grid) {
        const tiles = grid.querySelectorAll('.feature-tile');
        gsap.fromTo(tiles, { y: 60, scale: 0.98, opacity: 0 }, {
          y: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }

      if (wideCard) {
        gsap.fromTo(wideCard, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: wideCard, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Calendar, title: 'Upcoming Exams', description: 'Track all your exams with countdown timers and progress indicators.', color: 'bg-revisit-accent/10 text-revisit-accent' },
    { icon: CheckCircle2, title: 'Attendance', description: 'Monitor your attendance across all subjects with visual charts.', color: 'bg-emerald-100 text-emerald-600' },
    { icon: Clock, title: 'Calendar', description: 'Full month view with events, routines, and custom calendars.', color: 'bg-blue-100 text-blue-600' },
    { icon: BarChart3, title: 'Routine', description: 'Build weekly routines that repeat and keep you consistent.', color: 'bg-purple-100 text-purple-600' },
    { icon: ListTodo, title: 'To-Dos & Reminders', description: 'Never miss a deadline with smart task management.', color: 'bg-amber-100 text-amber-600' },
    { icon: Sparkles, title: 'AI Chat', description: 'Get personalized study plans powered by Gemini AI.', color: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <section ref={sectionRef} id="features" className="relative w-full bg-revisit-bg py-20 lg:py-32">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(123,97,255,0.08), transparent 50%)' }}
      />

      <div className="relative z-10 w-full px-6 lg:px-12 max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-revisit-text mb-4">
            Everything you need to <span className="text-gradient">stay ahead.</span>
          </h2>
          <p className="text-revisit-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Revisit brings your calendar, tasks, attendance, and AI into one calm workspace.
          </p>
          <p className="sr-only">Revisit is a free student daily life management app for Android featuring attendance tracking, task management, study alarms, exam countdown, AI-powered academic planning, Google Calendar sync, and more. Made by Swarnadeep Mukherjee under Cynocyte, a subsidiary of Unendless.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="feature-tile feature-card group cursor-pointer">
              <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-revisit-text mb-2">{feature.title}</h3>
              <p className="text-sm text-revisit-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>

        <div ref={wideCardRef} className="mt-6 feature-card flex flex-col md:flex-row items-center justify-between gap-6 p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xl text-revisit-text">Portfolio</h3>
              <p className="text-sm text-revisit-text-secondary mt-1">Track your school projects, deadlines, and completion status</p>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Books Tracking' },
            { icon: Bell, label: 'Study Alarms' },
            { icon: Calendar, label: 'Custom Events' },
            { icon: Sparkles, label: 'AI Insights' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-revisit-border hover:bg-white transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-revisit-bg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-revisit-accent" />
              </div>
              <span className="text-sm font-medium text-revisit-text">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
