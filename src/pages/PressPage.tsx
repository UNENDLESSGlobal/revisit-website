import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Image as ImageIcon, Mail, Linkedin } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PressPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
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
        title="Press Kit — Revisit App by Cynocyte | Swarnadeep Mukherjee"
        description="Media kit and press resources for Revisit, a free student manager app by Cynocyte (founded by Swarnadeep Mukherjee). Download logos, get app facts, and contact for press enquiries."
        canonicalPath="/press"
        keywords="revisit app press kit, cynocyte media kit, swarnadeep mukherjee, revisit app assets, student manager app press"
      />

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

      <div className="relative z-10 w-full max-w-4xl mt-12 mb-24 space-y-16">
        
        {/* Hero Section */}
        <section className="animate-section text-center pt-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-revisit-accent/10 text-revisit-accent text-xs font-semibold rounded-full mb-6 uppercase tracking-wider">
            Media Resources
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-revisit-text tracking-tight text-balance mb-6">
            Press & <span className="text-gradient">Media Kit</span>
          </h1>
          <p className="text-revisit-text-secondary text-lg md:text-xl max-w-2xl mx-auto text-balance mb-12">
            Everything journalists and bloggers need to write about Revisit and Cynocyte.
          </p>
        </section>

        {/* Quick Facts */}
        <section className="animate-section">
          <h2 className="font-heading text-2xl font-bold text-revisit-text mb-6">Quick Facts</h2>
          <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-revisit-border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex flex-col py-2 border-b border-revisit-border/50">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">App Name</span>
                <span className="font-medium text-revisit-text">Revisit — Student Life Manager</span>
              </div>
              <div className="flex flex-col py-2 border-b border-revisit-border/50">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">Developer</span>
                <span className="font-medium text-revisit-text">Cynocyte (subsidiary of UNENDLESS)</span>
              </div>
              <div className="flex flex-col py-2 border-b border-revisit-border/50">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">Founder</span>
                <span className="font-medium text-revisit-text">Swarnadeep Mukherjee</span>
              </div>
              <div className="flex flex-col py-2 border-b border-revisit-border/50">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">Headquarters</span>
                <span className="font-medium text-revisit-text">Kolkata, West Bengal, India</span>
              </div>
              <div className="flex flex-col py-2 border-b border-revisit-border/50">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">Launch Date</span>
                <span className="font-medium text-revisit-text">April 14, 2026</span>
              </div>
              <div className="flex flex-col py-2 border-b border-revisit-border/50">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">Platform</span>
                <span className="font-medium text-revisit-text">Android 5.0+</span>
              </div>
              <div className="flex flex-col py-2 border-b border-revisit-border/50 md:border-b-0">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">Price</span>
                <span className="font-medium text-revisit-text">Free (Premium at ₹99/month or ₹999/year)</span>
              </div>
              <div className="flex flex-col py-2">
                <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider mb-1">Primary Market</span>
                <span className="font-medium text-revisit-text">India (focusing on 75% UGC attendance rule)</span>
              </div>
            </div>
          </div>
        </section>

        {/* App Description */}
        <section className="animate-section">
          <h2 className="font-heading text-2xl font-bold text-revisit-text mb-6">App Description</h2>
          <div className="space-y-6">
            <div className="glass-card-strong p-6 md:p-8 rounded-[2rem] border border-revisit-border">
              <h3 className="text-sm font-semibold text-revisit-accent uppercase tracking-wider mb-3">Short Version (100 words)</h3>
              <p className="text-revisit-text-secondary leading-relaxed">
                Revisit is a free Android app by Cynocyte that helps students manage their entire academic life in one place. It includes attendance tracking (without needing total class count), AI-powered study plan generation, task management, timetable builder, monthly calendar, exam countdown, and books progress tracking. Built specifically for Indian students navigating the 75% UGC attendance rule, Revisit acts as a digital "second brain," eliminating the chaos of scattered notes, spreadsheets, and alarms.
              </p>
            </div>
            
            <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-revisit-border">
              <h3 className="text-sm font-semibold text-revisit-accent uppercase tracking-wider mb-3">Long Version (250 words)</h3>
              <p className="text-revisit-text-secondary leading-relaxed mb-4">
                Revisit is a comprehensive student life manager for Android, developed by Cynocyte — a technology subsidiary of UNENDLESS founded by Swarnadeep Mukherjee. Launched in April 2026, Revisit was built to solve the specific pain points faced by millions of Indian college and school students who struggle with fragmented productivity tools.
              </p>
              <p className="text-revisit-text-secondary leading-relaxed mb-4">
                The core innovation of Revisit lies in its attendance tracking engine. Unlike traditional apps that require users to manually input the "total classes conducted" — a number most students rarely know — Revisit dynamically calculates real-time attendance percentages simply based on daily "present" or "absent" inputs. It directly addresses the anxiety surrounding the strict 75% UGC attendance mandate by alerting students exactly how many classes they can afford to miss, or how many they need to attend consecutively to reach the safe zone.
              </p>
              <p className="text-revisit-text-secondary leading-relaxed">
                Beyond attendance, Revisit integrates a Groq-powered AI Chat assistant capable of generating highly personalized, day-by-day study plans based on upcoming exam dates and current syllabus progress. The app consolidates a weekly timetable builder, task and reminder management, Google Calendar and Drive synchronization, exam countdowns, and book tracking into a single, beautifully designed interface. Available for free, Revisit empowers students to stop managing tools and start managing their time.
              </p>
            </div>
          </div>
        </section>

        {/* Logos & Assets */}
        <section className="animate-section">
          <h2 className="font-heading text-2xl font-bold text-revisit-text mb-6">Logos & Brand Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/assets/logo_light.png" download className="glass-card flex flex-col items-center justify-center p-6 rounded-2xl border border-revisit-border hover:border-revisit-accent transition-colors group">
              <div className="w-16 h-16 bg-revisit-bg rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <img src="/assets/logo_light.png" alt="Light Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-sm font-medium text-revisit-text text-center mb-2">Download Logo</span>
              <span className="text-xs text-revisit-text-secondary flex items-center gap-1"><Download className="w-3 h-3" /> PNG (Light)</span>
            </a>
            
            <button disabled className="glass-card flex flex-col items-center justify-center p-6 rounded-2xl border border-revisit-border opacity-70 cursor-not-allowed">
              <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                <div className="w-10 h-10 border-2 border-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-white/50">DARK</span>
                </div>
              </div>
              <span className="text-sm font-medium text-revisit-text text-center mb-2">Download Logo</span>
              <span className="text-xs text-revisit-text-secondary flex items-center gap-1"><Download className="w-3 h-3" /> PNG (Dark)</span>
            </button>
            
            <button disabled className="glass-card flex flex-col items-center justify-center p-6 rounded-2xl border border-revisit-border opacity-60 cursor-not-allowed">
              <div className="w-16 h-16 bg-revisit-bg rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-revisit-text-secondary" />
              </div>
              <span className="text-sm font-medium text-revisit-text text-center mb-2">Brand Guidelines</span>
              <span className="text-xs text-revisit-text-secondary">Coming Soon</span>
            </button>
          </div>
        </section>

        {/* Screenshots */}
        <section className="animate-section">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-revisit-text">Product Screenshots</h2>
            <a href="mailto:cynocyte@gmail.com" className="text-sm font-medium text-revisit-accent hover:underline hidden sm:block">
              Request High-Res Pack
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="aspect-[9/19] bg-revisit-border/50 rounded-2xl border border-revisit-border flex flex-col items-center justify-center relative overflow-hidden group">
                <ImageIcon className="w-8 h-8 text-revisit-text-secondary/50 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-revisit-text-secondary">App Screenshot {num}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-revisit-text-secondary text-center sm:hidden">
            Contact us for high-res press screenshots at <a href="mailto:cynocyte@gmail.com" className="text-revisit-accent font-medium">cynocyte@gmail.com</a>
          </p>
        </section>

        {/* Founder */}
        <section className="animate-section">
          <h2 className="font-heading text-2xl font-bold text-revisit-text mb-6">About the Founder</h2>
          <div className="glass-card-strong p-6 md:p-8 rounded-[2rem] border border-revisit-border flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full flex-shrink-0 accent-gradient p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white">
                <span className="font-heading font-bold text-3xl text-transparent bg-clip-text accent-gradient">SM</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl font-bold text-revisit-text">Swarnadeep Mukherjee</h3>
              <p className="text-revisit-accent font-medium text-sm mb-3">Founder & CEO, Cynocyte</p>
              <p className="text-sm text-revisit-text-secondary leading-relaxed mb-4">
                Swarnadeep Mukherjee is the founder of Cynocyte and creator of the Revisit app. Operating out of Kolkata, India, he established UNENDLESS as a parent organization overseeing multiple tech initiatives. Driven by a passion for solving everyday friction through code, he built Revisit to help students navigate the chaotic academic landscape.
              </p>
              <a href="https://www.linkedin.com/in/swarnadeepmukherjee-unendless/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0077b5] hover:underline">
                <Linkedin className="w-4 h-4" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="animate-section pb-20">
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-revisit-accent/20 bg-revisit-accent/5 text-center">
            <Mail className="w-10 h-10 text-revisit-accent mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-revisit-text mb-3">Press Contact</h2>
            <p className="text-revisit-text-secondary mb-6 max-w-md mx-auto">
              For press enquiries, interviews, review access, and media requests, please reach out to us directly.
            </p>
            <a href="mailto:cynocyte@gmail.com" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-revisit-text text-white font-semibold hover:bg-revisit-text/90 transition-colors">
              <Mail className="w-5 h-5" />
              cynocyte@gmail.com
            </a>
            <p className="text-xs text-revisit-text-secondary mt-4">
              Response time: 24-48 hours
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PressPage;
