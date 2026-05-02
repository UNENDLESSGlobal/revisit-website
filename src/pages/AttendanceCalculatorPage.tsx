import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Calculator, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AttendanceCalculatorPage = () => {
  const [attended, setAttended] = useState<number | ''>('');
  const [missed, setMissed] = useState<number | ''>('');

  useEffect(() => {
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

  const calculate = () => {
    const att = Number(attended) || 0;
    const mis = Number(missed) || 0;
    const total = att + mis;
    
    if (total === 0) {
      return { 
        percent: 0, 
        status: 'default', 
        text: 'Enter your classes above to see your attendance percentage.',
        color: 'text-revisit-text-secondary',
        bg: 'bg-revisit-bg'
      };
    }
    
    const percent = Number(((att / total) * 100).toFixed(2));
    
    if (percent >= 75) {
      const safeToMiss = Math.floor(att / 0.75 - total);
      return { 
        percent, 
        status: 'green', 
        text: safeToMiss > 0 ? `You can safely miss ${safeToMiss} more ${safeToMiss === 1 ? 'class' : 'classes'}.` : `You are exactly at 75%. Don't miss the next class!`,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200'
      };
    } else if (percent >= 70) {
      const needed = Math.ceil(3 * total - 4 * att); // derived from (att + y)/(total + y) >= 0.75
      return { 
        percent, 
        status: 'amber', 
        text: `You need to attend ${needed} consecutive ${needed === 1 ? 'class' : 'classes'} to reach 75%.`,
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200'
      };
    } else {
      const needed = Math.ceil(3 * total - 4 * att);
      return { 
        percent, 
        status: 'red', 
        text: `You need to attend ${needed} consecutive ${needed === 1 ? 'class' : 'classes'} to reach 75%.`,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200'
      };
    }
  };

  const result = calculate();

  const faqs = [
    {
      question: "What is the 75% attendance rule in India?",
      answer: "The University Grants Commission (UGC) in India mandates a minimum of 75% attendance for college students to be eligible to sit for their end-semester examinations. Falling below this threshold may lead to debarment."
    },
    {
      question: "How do I calculate attendance percentage on Android?",
      answer: "You can use this free online tool, or better yet, download the Revisit app on Android. Revisit automatically calculates your percentage and tells you exactly how many classes you can miss or need to attend."
    },
    {
      question: "Can I track attendance without knowing total number of classes?",
      answer: "Yes! Most calculators require you to know the 'total classes conducted'. Revisit simplifies this by only asking for 'classes attended' and 'classes missed', calculating everything else dynamically."
    },
    {
      question: "Which is the best attendance app for Indian college students?",
      answer: "Revisit is designed specifically for Indian students facing the 75% UGC rule. It offers attendance tracking, timetable building, AI study plans, and task management in one ad-free (optional) experience."
    },
    {
      question: "What happens if attendance falls below 75%?",
      answer: "Depending on your college's strictness, you might be required to submit medical certificates, pay a condonation fee, or in severe cases, be barred from appearing in the final exams."
    },
    {
      question: "Is Revisit attendance tracker free?",
      answer: "Yes, Revisit is completely free to download and use on Android, covering all basic tracking features."
    }
  ];

  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 items-center">
      <SEOHead
        title="Free Attendance Calculator App for Indian College Students | 75% Rule | Revisit"
        description="Track your college attendance without entering total days. Revisit's free Android app calculates your % in real-time, alerts on 75% UGC threshold, and includes AI study planning. By Cynocyte."
        canonicalPath="/tools/attendance-calculator"
        keywords="75 percent attendance calculator, attendance without total days android, bunk calculator India, college attendance tracker free android, UGC 75 attendance rule app"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
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

      <div className="relative z-10 w-full max-w-4xl mt-12 mb-24 space-y-24">
        
        {/* Section 1: Hero & Calculator */}
        <section className="animate-section text-center pt-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-revisit-accent/10 text-revisit-accent text-xs font-semibold rounded-full mb-6">
            <Calculator className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-revisit-text tracking-tight text-balance mb-6">
            Attendance Calculator <br/><span className="text-gradient">Without Total Days</span>
          </h1>
          <p className="text-revisit-text-secondary text-lg md:text-xl max-w-2xl mx-auto text-balance mb-12">
            The only app that calculates your attendance percentage without needing to enter total days. Used by Indian college students to stay above the 75% UGC requirement.
          </p>

          {/* Interactive Calculator */}
          <div className="glass-card-strong max-w-xl mx-auto p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-lg text-left">
            <h2 className="font-heading text-2xl font-bold text-revisit-text mb-6">Calculate Now</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-revisit-text-secondary mb-2">Classes Attended</label>
                <input 
                  type="number" 
                  min="0"
                  value={attended}
                  onChange={(e) => setAttended(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full bg-white border border-revisit-border rounded-xl px-4 py-3 text-revisit-text font-medium focus:outline-none focus:border-revisit-accent transition-colors"
                  placeholder="e.g. 12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-revisit-text-secondary mb-2">Classes Missed</label>
                <input 
                  type="number" 
                  min="0"
                  value={missed}
                  onChange={(e) => setMissed(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full bg-white border border-revisit-border rounded-xl px-4 py-3 text-revisit-text font-medium focus:outline-none focus:border-revisit-accent transition-colors"
                  placeholder="e.g. 3"
                />
              </div>
            </div>

            <div className={`rounded-[1.5rem] p-6 text-center border ${result.bg} transition-colors duration-300`}>
              <div className="text-sm font-medium text-revisit-text-secondary mb-1">Your Attendance</div>
              <div className={`text-5xl font-bold font-heading mb-3 ${result.color}`}>
                {result.percent}%
              </div>
              <p className="text-revisit-text font-medium">{result.text}</p>
            </div>

            <div className="mt-8 text-center border-t border-revisit-border pt-6">
              <p className="text-sm text-revisit-text-secondary mb-4">Want this automatically tracked for every subject?</p>
              <Link to="/download" className="btn-primary w-full py-3.5 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Revisit Free — Android
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Comparison */}
        <section className="animate-section">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-revisit-text">Why Revisit is Better</h2>
          </div>
          
          <div className="glass-card overflow-hidden rounded-[2rem] border border-revisit-border shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-revisit-bg/80 border-b border-revisit-border">
                    <th className="px-6 py-4 font-semibold text-revisit-text">Feature</th>
                    <th className="px-6 py-4 font-bold text-revisit-accent text-center bg-white/50">Revisit App</th>
                    <th className="px-6 py-4 font-semibold text-revisit-text text-center">Bunk It / Others</th>
                    <th className="px-6 py-4 font-semibold text-revisit-text text-center">Spreadsheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-revisit-border">
                  {[
                    { label: 'Works without total days', r: true, b: false, s: false },
                    { label: 'AI study plan', r: true, b: false, s: false },
                    { label: 'Tasks & reminders', r: true, b: false, s: false },
                    { label: 'Calendar', r: true, b: false, s: false },
                    { label: 'Books tracking', r: true, b: false, s: false },
                    { label: 'Free', r: true, b: true, s: true },
                    { label: 'Android App', r: true, b: true, s: false },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-revisit-text">{row.label}</td>
                      <td className="px-6 py-4 text-center bg-white/50">
                        {row.r ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-revisit-text-secondary mx-auto" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.b ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-revisit-text-secondary mx-auto" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.s ? <Check className="w-5 h-5 text-emerald-600 mx-auto" /> : <X className="w-5 h-5 text-revisit-text-secondary mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: FAQ */}
        <section className="animate-section">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-revisit-text">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card p-6 rounded-[1.5rem] border border-revisit-border hover:border-revisit-accent/50 transition-colors">
                <h3 className="font-heading text-lg font-bold text-revisit-text mb-2">{faq.question}</h3>
                <p className="text-revisit-text-secondary text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Bottom CTA */}
        <section className="animate-section text-center pb-20">
          <div className="glass-card-strong p-10 md:p-14 rounded-[2.5rem] border border-revisit-accent/30 shadow-lg relative overflow-hidden max-w-3xl mx-auto">
            <div className="absolute inset-0 accent-gradient opacity-10" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-revisit-text mb-4 relative z-10">Stop calculating. Start tracking.</h2>
            <p className="text-revisit-text-secondary text-lg mb-8 max-w-lg mx-auto relative z-10">
              Join thousands of Indian college students managing their 75% attendance and study routines on Revisit.
            </p>
            <Link to="/download" className="accent-gradient text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 relative z-10">
              Download Revisit App <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AttendanceCalculatorPage;
