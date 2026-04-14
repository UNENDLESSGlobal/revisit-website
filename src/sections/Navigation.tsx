import { useState, useEffect } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';

interface NavigationProps {
  onDownloadClick: () => void;
  onPricingClick?: () => void;
  isDownloadPage?: boolean;
  onHomeClick?: () => void;
}

const Navigation = ({ onDownloadClick, onPricingClick, isDownloadPage, onHomeClick }: NavigationProps) => {
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
    { label: 'Features', href: '#features' },
    { label: 'Pricing', action: onPricingClick },
    { label: 'Download', action: onDownloadClick },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          <a href="#" onClick={(e) => { if (isDownloadPage && onHomeClick) { e.preventDefault(); onHomeClick(); } }} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-revisit-text">
              Revisit
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {!isDownloadPage && navLinks.map((link) => (
              link.action ? (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-sm font-medium text-revisit-text-secondary hover:text-revisit-text transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-revisit-accent transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-revisit-text-secondary hover:text-revisit-text transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-revisit-accent transition-all duration-300 group-hover:w-full" />
                </a>
              )
            ))}
          </div>

          <div className="hidden md:block">
            {!isDownloadPage && <button onClick={onDownloadClick} className="btn-primary text-sm">Get the app</button>}
          </div>

          <button
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
        className={`fixed inset-0 z-[99] bg-white transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
            {!isDownloadPage && navLinks.map((link) => (
              link.action ? (
                <button
                  key={link.label}
                  onClick={() => { setIsMobileMenuOpen(false); link.action(); }}
                  className="text-2xl font-heading font-semibold text-revisit-text hover:text-revisit-accent transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-heading font-semibold text-revisit-text hover:text-revisit-accent transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          {!isDownloadPage && <button onClick={() => { setIsMobileMenuOpen(false); onDownloadClick(); }} className="btn-primary mt-4">Get the app</button>}
        </div>
      </div>
    </>
  );
};

export default Navigation;
