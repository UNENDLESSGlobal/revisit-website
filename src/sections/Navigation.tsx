import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
  isDownloadPage?: boolean;
}

const Navigation = ({ isDownloadPage }: NavigationProps) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', action: () => { if (isDownloadPage) { navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView(), 100); } else { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); } } },
    { label: 'Pricing', to: '/pricing' },
    { label: 'About', to: '/about' },
    { label: 'Download', to: '/download' },
  ];

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/assets/named_logo_light.png" alt="Revisit Logo" className="h-[3.25rem] md:h-28 w-auto transition-transform duration-300 group-hover:scale-105" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm md:text-base font-medium text-revisit-text-secondary hover:text-revisit-text transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-revisit-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-sm md:text-base font-medium text-revisit-text-secondary hover:text-revisit-text transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-revisit-accent transition-all duration-300 group-hover:w-full" />
                </button>
              )
            ))}
          </div>

          <div className="hidden md:block">
            <Link to="/download" className="btn-primary text-sm md:text-base md:px-6 md:py-2.5 inline-block">Download Revisit</Link>
          </div>

          <button
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-revisit-bg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-revisit-text" />
            ) : (
              <Menu className="w-5 h-5 text-revisit-text" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[99] bg-white transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-heading font-semibold text-revisit-text hover:text-revisit-accent transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (link.action) {
                      link.action();
                    }
                  }}
                  className="text-2xl font-heading font-semibold text-revisit-text hover:text-revisit-accent transition-colors"
                >
                  {link.label}
                </button>
              )
            ))}
          <Link to="/download" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary mt-4 inline-block">Download Revisit</Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
