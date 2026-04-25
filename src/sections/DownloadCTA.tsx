import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            Ready to revisit your <span className="text-gradient">productivity?</span>
          </h2>

          <p className="text-revisit-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-10">
            Download Revisit and start the day with clarity. Fast, secure, and ready when you are.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/download" className="btn-primary flex items-center gap-3 px-10 py-5 text-lg rounded-full shadow-lg">
              <Download className="w-6 h-6" />
              <div className="font-semibold">Download App</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
