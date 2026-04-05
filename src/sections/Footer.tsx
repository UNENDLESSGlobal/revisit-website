import { GraduationCap, Twitter, Instagram, Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Download', 'Changelog', 'Roadmap'],
    Resources: ['Help Center', 'Blog', 'Tutorials', 'Community', 'API Docs'],
    Company: ['About', 'Careers', 'Press', 'Contact', 'Partners'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative w-full bg-revisit-bg border-t border-revisit-border">
      <div className="w-full px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-revisit-text">Revisit</span>
            </a>
            <p className="text-sm text-revisit-text-secondary mb-6 max-w-xs">
              Your complete study companion. Plan, track, and succeed in your academic journey.
            </p>

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

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold text-sm text-revisit-text mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-12 border border-revisit-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-semibold text-lg text-revisit-text mb-1">Stay updated</h4>
              <p className="text-sm text-revisit-text-secondary">Get the latest features and study tips delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-revisit-bg rounded-xl text-sm text-revisit-text placeholder:text-revisit-text-secondary outline-none border border-transparent focus:border-revisit-accent transition-colors"
              />
              <button className="btn-primary whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-revisit-border">
          <div className="text-sm text-revisit-text-secondary">© 2026 Revisit. All rights reserved.</div>

          <div className="flex items-center gap-1 text-sm text-revisit-text-secondary">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for students worldwide
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-revisit-text-secondary hover:text-revisit-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
