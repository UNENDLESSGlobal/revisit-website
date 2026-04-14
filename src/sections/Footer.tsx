import { useState } from 'react';
import { GraduationCap, Twitter, Instagram, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';

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
      const response = await fetch(`${SUPABASE_URL}/rest/v1/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email })
      });

      if (response.status === 201) {
        setNewsletterStatus('success');
        setEmail('');
      } else if (response.status === 409) {
        setNewsletterStatus('conflict');
      } else {
        setNewsletterStatus('error');
      }
    } catch (e) {
      setNewsletterStatus('error');
    }
  };


  const socialLinks = [
    { icon: Twitter, href: 'https://x.com/cynocyte', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/cynocyte', label: 'Instagram' },
    { icon: Mail, href: 'mailto:cynocyte@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="relative w-full bg-revisit-bg border-t border-revisit-border">
      <div className="w-full px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <div>
            <a href="#" className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-revisit-text">Revisit</span>
            </a>
            <p className="text-sm text-revisit-text-secondary max-w-sm mx-auto">
              Your complete study companion. Plan, track, and succeed in your daily journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-xl bg-white border border-revisit-border flex items-center justify-center text-revisit-text-secondary hover:text-revisit-accent hover:border-revisit-accent transition-all"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
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

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-revisit-border">
          <div className="text-sm text-revisit-text-secondary">© 2026 Revisit. All rights reserved.</div>

          <div className="flex items-center gap-1 text-sm text-revisit-text-secondary">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for students worldwide
          </div>

          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
