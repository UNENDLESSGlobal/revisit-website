import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ChevronDown, Send, BookOpen, FlaskConical, Languages } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AIChatSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const userBubbleRef = useRef<HTMLDivElement>(null);
  const aiResponseRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const header = headerRef.current;
    const userBubble = userBubbleRef.current;
    const aiResponse = aiResponseRef.current;
    const input = inputRef.current;
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
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      scrollTl.fromTo(card, { y: '100vh', scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: 'none' }, 0);

      if (label) {
        scrollTl.fromTo(label, { y: -30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05);
      }

      if (header) {
        scrollTl.fromTo(header, { y: -20, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.08);
      }

      if (userBubble) {
        scrollTl.fromTo(userBubble, { x: '12vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.12);
      }

      if (aiResponse) {
        const lines = aiResponse.querySelectorAll('.ai-line');
        scrollTl.fromTo(lines, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0.18);
      }

      if (input) {
        scrollTl.fromTo(input, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.25);
      }

      scrollTl.fromTo(card, { y: 0, opacity: 1 }, { y: '-16vh', opacity: 0, ease: 'power2.in' }, 0.7);

      if (label) {
        scrollTl.fromTo(label, { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7);
      }

      if (userBubble) {
        scrollTl.fromTo(userBubble, { x: 0, opacity: 1 }, { x: '-8vw', opacity: 0, ease: 'power2.in' }, 0.72);
      }

      if (aiResponse) {
        scrollTl.fromTo(aiResponse, { x: 0, opacity: 1 }, { x: '8vw', opacity: 0, ease: 'power2.in' }, 0.74);
      }

      if (input) {
        scrollTl.fromTo(input, { y: 0, opacity: 1 }, { y: '10vh', opacity: 0, ease: 'power2.in' }, 0.76);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const studyPlanItems = [
    {
      icon: BookOpen,
      subject: 'Physics',
      description: 'Focus on completing one chapter per week from your Physics textbook. Start with Chapter 1: Electrostatics, and allocate 2-3 hours daily for the next 7 days.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: FlaskConical,
      subject: 'Chemistry',
      description: 'Allocate 1-2 hours daily to study Chemistry, focusing on one chapter at a time. Start with Chapter 1: Solid State, and aim to complete within 7 days.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Languages,
      subject: 'English',
      description: 'With 33 days left for your English exam, allocate 1-2 hours daily to review and practice English concepts, focusing on your weakest areas.',
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-revisit-bg overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 55%, rgba(123,97,255,0.12), transparent 60%)' }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div ref={labelRef} className="text-center mb-4">
          <span className="section-label">AI Study Plan</span>
          <p className="text-revisit-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Get a personalized plan based on your progress and upcoming exams.
          </p>
        </div>

        <div ref={cardRef} className="w-full max-w-[1000px] glass-card-strong overflow-hidden flex flex-col" style={{ height: 'clamp(450px, 68vh, 600px)' }}>
          <div ref={headerRef} className="flex items-center justify-center gap-2 px-6 py-4 border-b border-revisit-border">
            <Sparkles className="w-5 h-5 text-revisit-accent" />
            <span className="font-heading font-semibold text-lg">AI Chat</span>
            <ChevronDown className="w-4 h-4 text-revisit-text-secondary" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div ref={userBubbleRef} className="flex justify-end">
              <div className="max-w-[80%] bg-revisit-accent text-white rounded-2xl rounded-tr-sm px-5 py-3">
                <p className="text-sm">Based on my previous chats and current progress, give me a study plan</p>
              </div>
            </div>

            <div ref={aiResponseRef} className="flex justify-start">
              <div className="max-w-[90%] bg-revisit-bg rounded-2xl rounded-tl-sm px-5 py-4">
                <p className="ai-line text-sm text-revisit-text mb-4">
                  Considering your upcoming English exam on 2026-05-01 and your current progress in Physics and Chemistry, I'd recommend a study plan that focuses on prioritizing your weakest areas and allocating time for each subject.
                </p>

                <p className="ai-line text-sm font-medium text-revisit-text mb-3">Here's a suggested plan:</p>

                <div className="space-y-3">
                  {studyPlanItems.map((item, index) => (
                    <div key={item.subject} className="ai-line bg-white rounded-xl p-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-revisit-text">
                            {index + 1}. {item.subject}
                          </div>
                          <p className="text-xs text-revisit-text-secondary mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div ref={inputRef} className="p-4 border-t border-revisit-border">
            <div className="flex items-center gap-3 bg-revisit-bg rounded-full px-4 py-3">
              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm text-revisit-text placeholder:text-revisit-text-secondary outline-none"
                readOnly
              />
              <button className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatSection;
