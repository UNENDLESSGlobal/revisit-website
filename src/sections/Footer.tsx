import { useState } from 'react';
import { Twitter, Instagram, Heart, Youtube, MessageSquare, MessageCircle, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeToNewsletter } from '../lib/supabase';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'conflict' | 'error' | 'invalid'>('idle');

  const handleSubscribe = async () => {
    if (!email.includes('@')) {
      setNewsletterStatus('invalid');
      return;
    }

    setNewsletterStatus('loading');
    
    try {
      const responseStatus = await subscribeToNewsletter(email);

      if (responseStatus === 201) {
        setNewsletterStatus('success');
        setEmail('');
      } else if (responseStatus === 409) {
        setNewsletterStatus('conflict');
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }
  };

  const cynocyteSocials = [
    { icon: Twitter, href: 'https://x.com/cynocyte', label: 'Cynocyte on Twitter/X' },
    { icon: Instagram, href: 'https://www.instagram.com/cynocyte/', label: 'Cynocyte on Instagram' },
    { icon: Instagram, href: 'https://www.instagram.com/cynocyteindia/', label: 'Cynocyte India on Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@cynocyte', label: 'Cynocyte on YouTube' },
    { icon: MessageSquare, href: 'https://www.threads.net/@cynocyte', label: 'Cynocyte on Threads' },
    { icon: MessageCircle, labelText: 'r/', href: 'https://www.reddit.com/user/cynocyte/', label: 'Cynocyte on Reddit' },
  ];

  const founderSocials = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/swarnadeepmukherjee-unendless/', label: 'Swarnadeep Mukherjee on LinkedIn' },
    { icon: Twitter, href: 'https://x.com/theswarnadeep_', label: 'Swarnadeep Mukherjee on Twitter/X' },
    { icon: Instagram, href: 'https://www.instagram.com/theswarnadeep_/', label: 'Swarnadeep Mukherjee on Instagram' },
    { icon: MessageSquare, href: 'https://www.threads.net/@theswarnadeep_', label: 'Swarnadeep Mukherjee on Threads' },
    { icon: MessageCircle, labelText: 'r/', href: 'https://www.reddit.com/user/SwarnadeepMukherjee/', label: 'Swarnadeep Mukherjee on Reddit' },
  ];

  return (
    <footer className="relative w-full bg-revisit-bg border-t border-revisit-border">
      <div className="w-full px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <div>
            <a href="#" className="flex items-center justify-center gap-2 mb-4">
              <img src="/assets/named_logo_light.png" alt="Revisit Logo" className="h-[136px] w-auto" />
            </a>
            <p className="text-sm text-revisit-text-secondary max-w-sm mx-auto">
              Your complete study companion. Plan, track, and succeed in your daily journey.
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full mt-4">
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider">Follow Cynocyte</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {cynocyteSocials.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-white border border-revisit-border flex items-center justify-center text-revisit-text-secondary hover:text-revisit-accent hover:border-revisit-accent transition-all"
                  >
                    {social.labelText ? (
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-bold leading-none">{social.labelText}</span>
                        <social.icon className="w-4 h-4" />
                      </div>
                    ) : (
                      <social.icon className="w-5 h-5" />
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-revisit-text-secondary uppercase tracking-wider">Follow Swarnadeep</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {founderSocials.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-white border border-revisit-border flex items-center justify-center text-revisit-text-secondary hover:text-revisit-accent hover:border-revisit-accent transition-all"
                  >
                    {social.labelText ? (
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-bold leading-none">{social.labelText}</span>
                        <social.icon className="w-4 h-4" />
                      </div>
                    ) : (
                      <social.icon className="w-5 h-5" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-12 border border-revisit-border shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-revisit-text mb-1">Stay Updated</h3>
              <p className="text-sm text-revisit-text-secondary">Get the latest features and study tips delivered to your inbox.</p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setNewsletterStatus('idle'); }}
                  className="flex-1 w-full sm:w-64 px-4 py-3 bg-revisit-bg rounded-full text-sm text-revisit-text placeholder:text-revisit-text-secondary outline-none border border-transparent focus:border-revisit-accent transition-colors"
                />
                <button 
                  onClick={handleSubscribe} 
                  disabled={newsletterStatus === 'loading'}
                  className="btn-primary whitespace-nowrap px-6 py-3 w-full sm:w-auto rounded-full"
                >
                  {newsletterStatus === 'loading' ? 'Sending...' : 'Subscribe'}
                </button>
              </div>
              <div className="h-4 text-xs font-medium ml-4">
                {newsletterStatus === 'invalid' && <span className="text-red-500">Please enter a valid email.</span>}
                {newsletterStatus === 'success' && <span className="text-emerald-500">✅ Subscribed! Thanks for joining.</span>}
                {newsletterStatus === 'conflict' && <span className="text-amber-500">You're already subscribed!</span>}
                {newsletterStatus === 'error' && <span className="text-red-500">Something went wrong. Try again.</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 pt-8 border-t border-revisit-border">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="text-sm text-revisit-text-secondary">© 2026 Revisit by Cynocyte. All rights reserved.</div>
            <div className="text-xs text-revisit-text-secondary/70">
              A product of <a href="https://cynocyte.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-revisit-accent transition-colors underline underline-offset-2">Cynocyte</a> — a subsidiary of <a href="https://unendless.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-revisit-accent transition-colors underline underline-offset-2">UNENDLESS</a>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-revisit-text-secondary">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for students worldwide
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/about" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">About</Link>
            <Link to="/blog" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Blog</Link>
            <Link to="/press" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Press</Link>
            <Link to="/privacy-policy" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Terms and Conditions</Link>
            <Link to="/admin" className="text-xs text-revisit-text-secondary/80 hover:text-revisit-accent transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Revisit App",
        "url": "https://getrevisit.vercel.app",
        "hasPart": [
          { "@type": "WebPageElement", "name": "Home", "url": "https://getrevisit.vercel.app/" },
          { "@type": "WebPageElement", "name": "Features", "url": "https://getrevisit.vercel.app/#features" },
          { "@type": "WebPageElement", "name": "Pricing", "url": "https://getrevisit.vercel.app/pricing" },
          { "@type": "WebPageElement", "name": "About", "url": "https://getrevisit.vercel.app/about" },
          { "@type": "WebPageElement", "name": "Blog", "url": "https://getrevisit.vercel.app/blog" },
          { "@type": "WebPageElement", "name": "Press", "url": "https://getrevisit.vercel.app/press" },
          { "@type": "WebPageElement", "name": "Download", "url": "https://getrevisit.vercel.app/download" }
        ]
      }) }} />
    </footer>
  );
};

export default Footer;
