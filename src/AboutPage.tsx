import { useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  Box, 
  Code, 
  Server, 
  Smartphone, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Link2,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEOHead } from './components/SEOHead';
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 items-center">
      <SEOHead
        title="About Revisit — Swarnadeep Mukherjee, Cynocyte & UNENDLESS"
        description="Learn about Swarnadeep Mukherjee, founder of Cynocyte and creator of the Revisit student manager app. Discover the UNENDLESS ecosystem: Cynocyte, Cynocyte Systems, and beyond."
        canonicalPath="/about"
        keywords="Swarnadeep Mukherjee, Cynocyte founder, Revisit app creator, UNENDLESS, Cynocyte Systems, student app India"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://getrevisit.vercel.app/about#swarnadeep-mukherjee",
            "name": "Swarnadeep Mukherjee",
            "url": "https://getrevisit.vercel.app/about",
            "sameAs": [
              "https://www.linkedin.com/in/swarnadeepmukherjee-unendless/",
              "https://x.com/theswarnadeep_",
              "https://www.instagram.com/theswarnadeep_/",
              "https://www.threads.net/@theswarnadeep_",
              "https://www.reddit.com/user/SwarnadeepMukherjee/"
            ]
          })}
        </script>
        {/* BreadcrumbList for this page specifically */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://getrevisit.vercel.app/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About",
                "item": "https://getrevisit.vercel.app/about"
              }
            ]
          })}
        </script>
      </Helmet>

      <Link
        to="/"
        className="absolute top-32 md:top-40 left-6 md:left-12 flex items-center gap-2 text-revisit-text-secondary hover:text-revisit-text transition-colors z-20"
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

      <div className="relative z-10 w-full max-w-4xl mt-12 mb-24 space-y-32">
        
        {/* Section 1: Hero */}
        <section className="animate-section text-center pt-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-revisit-text tracking-tight text-balance mb-6">
            Built by students, <span className="text-gradient">for students.</span>
          </h1>
          <p className="text-revisit-text-secondary text-lg md:text-xl max-w-2xl mx-auto text-balance mb-16">
            Revisit is a product of Cynocyte, a technology company under UNENDLESS, founded in Kolkata, India.
          </p>

          <div className="flex flex-col items-center max-w-lg mx-auto relative">
            {/* UNENDLESS */}
            <div className="glass-card-strong w-full p-6 rounded-[2rem] border border-white/60 shadow-sm relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <Box className="w-6 h-6 text-revisit-text" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-xl font-bold text-revisit-text">UNENDLESS</h3>
                  <p className="text-sm text-revisit-text-secondary">Parent Company</p>
                </div>
              </div>
            </div>

            <div className="w-0.5 h-8 bg-revisit-border"></div>

            {/* Cynocyte */}
            <div className="glass-card w-full p-6 rounded-[2rem] border border-revisit-accent/20 shadow-sm relative z-10 ml-8 md:ml-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <Code className="w-6 h-6 text-revisit-accent" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-xl font-bold text-revisit-text">Cynocyte</h3>
                  <p className="text-sm text-revisit-text-secondary">Technology Subsidiary</p>
                </div>
              </div>
            </div>

            <div className="w-0.5 h-8 bg-revisit-border ml-8 md:ml-12"></div>

            <div className="flex w-full ml-16 md:ml-24 gap-4">
              {/* Cynocyte Systems */}
              <div className="glass-card w-1/2 p-5 rounded-[1.5rem] border border-revisit-border shadow-sm relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Server className="w-5 h-5 text-revisit-text-secondary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-heading text-lg font-bold text-revisit-text leading-tight">Cynocyte Systems</h3>
                    <p className="text-xs text-revisit-text-secondary mt-1">Software Infrastructure</p>
                  </div>
                </div>
              </div>

              {/* Revisit App */}
              <div className="glass-card w-1/2 p-5 rounded-[1.5rem] border-2 border-revisit-accent/50 shadow-[0_10px_30px_rgba(123,97,255,0.1)] relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-revisit-accent flex items-center justify-center shadow-md">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-heading text-lg font-bold text-revisit-text leading-tight">Revisit App</h3>
                    <p className="text-xs text-revisit-text-secondary mt-1">Student Life Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Founder Bio */}
        <section className="animate-section">
          <div className="glass-card-strong p-8 md:p-12 rounded-[2.5rem] border border-white/60 shadow-lg bg-white/70">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex-shrink-0 accent-gradient p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-white">
                  <span className="font-heading font-bold text-3xl md:text-4xl text-transparent bg-clip-text accent-gradient">SM</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-3xl font-bold text-revisit-text">Swarnadeep Mukherjee</h2>
                <p className="text-revisit-accent font-medium mt-1">Founder & CEO, Cynocyte | Creator of Revisit</p>
                <p className="text-sm text-revisit-text-secondary mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Kolkata, West Bengal, India
                </p>

                <p className="mt-6 text-revisit-text leading-relaxed">
                  Swarnadeep Mukherjee is the founder of Cynocyte and the creator of Revisit — a student life management app built to solve the daily academic chaos that millions of Indian students face. Starting with the belief that great software should emerge from lived experience, Swarnadeep built Revisit as a one-stop solution: attendance tracking, AI study plans, task management, and more — all in a single, beautiful Android app.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-8">
                  <a href="https://www.linkedin.com/in/swarnadeepmukherjee-unendless/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-revisit-bg border border-revisit-border flex items-center justify-center hover:bg-white hover:text-revisit-accent transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://x.com/theswarnadeep_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-revisit-bg border border-revisit-border flex items-center justify-center hover:bg-white hover:text-revisit-accent transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/theswarnadeep_/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-revisit-bg border border-revisit-border flex items-center justify-center hover:bg-white hover:text-revisit-accent transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://www.threads.net/@theswarnadeep_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-revisit-bg border border-revisit-border flex items-center justify-center hover:bg-white hover:text-revisit-accent transition-colors">
                    <span className="font-bold text-lg leading-none -mt-1">@</span>
                  </a>
                  <a href="https://www.reddit.com/user/SwarnadeepMukherjee/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-revisit-bg border border-revisit-border flex items-center justify-center hover:bg-white hover:text-revisit-accent transition-colors">
                    <Link2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 rounded-[1.5rem] bg-revisit-accent/5 border border-revisit-accent/10 relative">
              <div className="absolute top-4 left-4 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              <p className="text-lg md:text-xl font-heading font-medium text-revisit-text text-center italic relative z-10">
                "Every student deserves a second brain. Revisit is mine, shared."
              </p>
              <p className="text-center mt-3 text-sm text-revisit-text-secondary relative z-10">
                — Swarnadeep Mukherjee
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Timeline */}
        <section className="animate-section">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-revisit-text">The Story So Far</h2>
          </div>
          
          <div className="relative border-l border-revisit-border md:border-none md:max-w-2xl mx-auto ml-4 md:ml-auto">
            {/* Desktop Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-revisit-border -translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-16">
              {/* Item 1 */}
              <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between group">
                <div className="absolute left-[-5px] top-1.5 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-[11px] h-[11px] rounded-full bg-revisit-border group-hover:bg-revisit-accent transition-colors z-10"></div>
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h3 className="font-bold text-revisit-text text-lg">2026</h3>
                  <p className="text-revisit-text-secondary mt-1 text-sm md:text-base leading-relaxed">Cynocyte founded by Swarnadeep Mukherjee as a subsidiary of UNENDLESS</p>
                </div>
                <div className="hidden md:block md:w-1/2 md:pl-12"></div>
              </div>

              {/* Item 2 */}
              <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between group">
                <div className="absolute left-[-5px] top-1.5 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-[11px] h-[11px] rounded-full bg-revisit-accent shadow-[0_0_10px_rgba(123,97,255,0.5)] z-10"></div>
                <div className="hidden md:block md:w-1/2 md:pr-12"></div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="font-bold text-revisit-accent text-lg">April 2026</h3>
                  <p className="text-revisit-text-secondary mt-1 text-sm md:text-base leading-relaxed">Revisit v1 launched on Android — the first product by Cynocyte</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between group">
                <div className="absolute left-[-5px] top-1.5 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-[11px] h-[11px] rounded-full bg-revisit-border group-hover:bg-revisit-accent transition-colors z-10"></div>
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h3 className="font-bold text-revisit-text text-lg">Future</h3>
                  <p className="text-revisit-text-secondary mt-1 text-sm md:text-base leading-relaxed">Cynocyte Systems expands into developer infrastructure tools</p>
                </div>
                <div className="hidden md:block md:w-1/2 md:pl-12"></div>
              </div>

              {/* Item 4 */}
              <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between group">
                <div className="absolute left-[-5px] top-1.5 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-[11px] h-[11px] rounded-full bg-revisit-border group-hover:bg-revisit-accent transition-colors z-10"></div>
                <div className="hidden md:block md:w-1/2 md:pr-12"></div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="font-bold text-revisit-text text-lg">Future</h3>
                  <p className="text-revisit-text-secondary mt-1 text-sm md:text-base leading-relaxed">UNENDLESS Studios announced for media production</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Ecosystem */}
        <section className="animate-section">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-revisit-text">The UNENDLESS Ecosystem</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="https://unendless.vercel.app" target="_blank" rel="noopener noreferrer" className="glass-card p-8 rounded-[2rem] border border-revisit-border hover:border-revisit-text transition-all block group">
              <Box className="w-8 h-8 text-revisit-text mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-bold text-revisit-text mb-2">UNENDLESS</h3>
              <p className="text-sm text-revisit-text-secondary leading-relaxed mb-6">Parent company. Multi-sector vision. Future: technology, media, and beyond.</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-revisit-text">
                Visit Site <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a href="https://cynocyte.vercel.app" target="_blank" rel="noopener noreferrer" className="glass-card-strong p-8 rounded-[2rem] border border-revisit-accent/30 hover:border-revisit-accent transition-all block group shadow-sm">
              <Code className="w-8 h-8 text-revisit-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-bold text-revisit-text mb-2">Cynocyte</h3>
              <p className="text-sm text-revisit-text-secondary leading-relaxed mb-6">Technology subsidiary. Builder of Revisit and future software products.</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-revisit-accent">
                Visit Site <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a href="https://cynocyte.vercel.app/systems" target="_blank" rel="noopener noreferrer" className="glass-card p-8 rounded-[2rem] border border-revisit-border hover:border-revisit-text transition-all block group">
              <Server className="w-8 h-8 text-revisit-text-secondary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-bold text-revisit-text mb-2">Cynocyte Systems</h3>
              <p className="text-sm text-revisit-text-secondary leading-relaxed mb-6">Software infrastructure division of Cynocyte.</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-revisit-text">
                Visit Site <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </section>

        {/* Section 5: Contact */}
        <section className="animate-section">
          <div className="glass-card-strong p-8 md:p-12 rounded-[2.5rem] border border-white/60 shadow-lg text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-revisit-text mb-4">Contact & Press</h2>
            <p className="text-revisit-text-secondary mb-8">
              For press enquiries, partnerships, or collaboration:
            </p>
            
            <a href="mailto:cynocyte@gmail.com" className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-full bg-revisit-text text-white font-semibold hover:bg-revisit-text/90 transition-colors mb-4">
              <Mail className="w-5 h-5" />
              cynocyte@gmail.com
            </a>
            
            <div className="mt-4">
              <button disabled className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-revisit-border/50 text-revisit-text-secondary/70 font-semibold cursor-not-allowed text-sm">
                Download our press kit (coming soon)
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
