import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Apple, Smartphone, Globe, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DownloadCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const buttons = buttonsRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      if (content) {
        gsap.fromTo(content, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: content, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }

      if (buttons) {
        const btnElements = buttons.querySelectorAll('button');
        gsap.fromTo(btnElements, { scale: 0.98, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: buttons, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="download" className="relative w-full bg-white py-20 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123,97,255,0.08), transparent 50%)' }}
      />

      <div className="orb orb-accent w-[200px] h-[200px] left-[5%] top-[20%] opacity-20 animate-float-slow" />
      <div className="orb orb-soft w-[250px] h-[250px] right-[5%] bottom-[20%] opacity-15 animate-float" />

      <div className="relative z-10 w-full px-6 lg:px-12 max-w-4xl mx-auto">
        <div ref={contentRef} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-revisit-accent/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-revisit-accent" />
            <span className="text-sm font-medium text-revisit-accent">Now Available</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-revisit-text mb-4">
            Ready to revisit your <span className="text-gradient">semester?</span>
          </h2>

          <p className="text-revisit-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-10">
            Download Revisit and start the term with clarity. Available on iOS, Android, and Web.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary flex items-center gap-3 px-8 py-4 text-base">
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs opacity-80">Download for</div>
                <div className="font-semibold">iOS</div>
              </div>
            </button>

            <button className="btn-secondary flex items-center gap-3 px-8 py-4 text-base">
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs opacity-80">Get it on</div>
                <div className="font-semibold">Android</div>
              </div>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-revisit-text-secondary">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Also available on Web • Sync across devices</span>
          </div>

          <div className="mt-12 pt-8 border-t border-revisit-border">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-revisit-text">50K+</div>
                <div className="text-xs text-revisit-text-secondary">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-revisit-text">4.8</div>
                <div className="text-xs text-revisit-text-secondary">App Store Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-revisit-text">100%</div>
                <div className="text-xs text-revisit-text-secondary">Free to Use</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
