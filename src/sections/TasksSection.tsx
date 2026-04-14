import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, GripVertical, Bell, Calendar, Tag, Flag, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TasksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const segmentedRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const chips = chipsRef.current;
    const segmented = segmentedRef.current;
    const list = listRef.current;
    const label = labelRef.current;

    if (!section || !card) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      scrollTl.fromTo(card, { y: '95vh', scale: 0.93, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: 'none' }, 0);

      if (label) {
        scrollTl.fromTo(label, { y: -30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05);
      }

      if (chips) {
        const chipItems = chips.querySelectorAll('.filter-chip');
        scrollTl.fromTo(chipItems, { y: -24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0.08);
      }

      if (segmented) {
        scrollTl.fromTo(segmented, { scaleX: 0.96, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'none' }, 0.12);
      }

      if (list) {
        const tasks = list.querySelectorAll('.task-item');
        scrollTl.fromTo(tasks, { x: '-10vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.025, ease: 'none' }, 0.15);
      }

      scrollTl.fromTo(card, { y: 0, opacity: 1 }, { y: '-18vh', opacity: 0, ease: 'power2.in' }, 0.7);

      if (label) {
        scrollTl.fromTo(label, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7);
      }

      if (list) {
        const tasks = list.querySelectorAll('.task-item');
        scrollTl.fromTo(tasks, { x: 0, opacity: 1 }, { x: '6vw', opacity: 0, stagger: 0.01, ease: 'power2.in' }, 0.72);
      }

      if (chips) {
        scrollTl.fromTo(chips, { y: 0, opacity: 1 }, { y: '6vh', opacity: 0, ease: 'power2.in' }, 0.75);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const filterChips = ['All', 'submission', 'English', 'notes'];
  const tasks = [
    { id: 1, title: 'Create a lifetime self-dispersal letter.', type: 'To-Do', priority: 'High', completed: true, tags: [] },
    { id: 2, title: 'Note down examples in English note book and submit', type: 'Reminder', date: '23/3/2026 at 00:00', completed: true, tags: ['submission', 'English', 'notes'] },
    { id: 3, title: 'Order books', type: 'To-Do', priority: 'Medium', completed: true, tags: [] },
    { id: 4, title: 'go to physics wallah for books', type: 'Reminder', date: '24/3/2026 at 00:00', completed: true, tags: ['notes'] },
    { id: 5, title: 'Study Physics Chapter 1: Electrostatics for 2 hours today', type: 'To-Do', priority: 'Medium', completed: false, tags: [] },
  ];

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-revisit-bg overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(123,97,255,0.10), transparent 55%)' }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div ref={labelRef} className="text-center mb-4">
          <span className="section-label">Tasks</span>
          <p className="text-revisit-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Capture every to-do, deadline, and reminder in one place.
          </p>
        </div>

        <div ref={cardRef} className="w-full max-w-[960px] glass-card-strong overflow-hidden flex flex-col" style={{ minHeight: 'clamp(480px, 68vh, 600px)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-revisit-border">
            <span className="font-heading font-semibold text-lg">To-Dos & Reminders</span>
          </div>

          <div className="p-6">
            <div ref={chipsRef} className="flex gap-2 mb-4 flex-wrap">
              {filterChips.map((chip, index) => (
                <button
                  key={chip}
                  className={`filter-chip px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    index === 0 ? 'bg-revisit-accent text-white' : 'bg-revisit-bg text-revisit-text hover:bg-revisit-accent/10'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div ref={segmentedRef} className="flex bg-revisit-bg rounded-xl p-1 mb-4">
              <button className="flex-1 py-2 px-4 bg-revisit-accent text-white rounded-lg text-sm font-medium transition-all">All</button>
              <button className="flex-1 py-2 px-4 text-revisit-text-secondary rounded-lg text-sm font-medium transition-all hover:text-revisit-text">To-Dos</button>
              <button className="flex-1 py-2 px-4 text-revisit-text-secondary rounded-lg text-sm font-medium transition-all hover:text-revisit-text">Reminders</button>
            </div>

            <div ref={listRef} className="space-y-3 overflow-y-auto flex-1 h-[320px]">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item bg-revisit-bg rounded-xl p-4 flex items-start gap-3 transition-all hover:bg-gray-100 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      task.completed ? 'bg-revisit-accent text-white' : 'border-2 border-revisit-text-secondary/30 hover:border-revisit-accent'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium text-revisit-text ${task.completed ? 'line-through text-revisit-text-secondary' : ''}`}>
                      {task.title}
                    </div>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        {task.type === 'To-Do' ? (
                          <CheckCircle2 className="w-3 h-3 text-revisit-text-secondary" />
                        ) : (
                          <Bell className="w-3 h-3 text-revisit-text-secondary" />
                        )}
                        <span className="text-xs text-revisit-text-secondary">{task.type}</span>
                      </div>

                      {task.priority && (
                        <div className="flex items-center gap-1">
                          <Flag className={`w-3 h-3 ${task.priority === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
                          <span className={`text-xs ${task.priority === 'High' ? 'text-red-500' : 'text-amber-500'}`}>{task.priority}</span>
                        </div>
                      )}

                      {task.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-revisit-text-secondary" />
                          <span className="text-xs text-revisit-text-secondary">{task.date}</span>
                        </div>
                      )}

                      {task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-revisit-text-secondary" />
                          <span className="text-xs text-revisit-text-secondary">{task.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="text-revisit-text-secondary/50 hover:text-revisit-text-secondary transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TasksSection;
