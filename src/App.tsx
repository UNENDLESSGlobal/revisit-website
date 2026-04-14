import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import CalendarSection from './sections/CalendarSection';
import AttendanceSection from './sections/AttendanceSection';
import TasksSection from './sections/TasksSection';
import AIChatSection from './sections/AIChatSection';
import FeaturesGrid from './sections/FeaturesGrid';
import DownloadCTA from './sections/DownloadCTA';
import Footer from './sections/Footer';
import DownloadPage from './DownloadPage';
import PricingPage from './PricingPage';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showDownloadPage, setShowDownloadPage] = useState(false);
  const [showPricingPage, setShowPricingPage] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showTermsPage, setShowTermsPage] = useState(false);
  
  const isAltPage = showDownloadPage || showPricingPage || showPrivacyPage || showTermsPage;

  const handleHomeClick = () => {
    setShowDownloadPage(false);
    setShowPricingPage(false);
    setShowPrivacyPage(false);
    setShowTermsPage(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-revisit-bg min-h-screen overflow-x-hidden max-w-[100vw]">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <Navigation 
        onDownloadClick={() => { handleHomeClick(); setShowDownloadPage(true); }} 
        onPricingClick={() => { handleHomeClick(); setShowPricingPage(true); }}
        isDownloadPage={isAltPage}
        onHomeClick={handleHomeClick}
      />

      {showDownloadPage ? (
        <DownloadPage onBack={handleHomeClick} />
      ) : showPricingPage ? (
        <PricingPage onBack={handleHomeClick} onDownload={() => { handleHomeClick(); setShowDownloadPage(true); }} />
      ) : showPrivacyPage ? (
        <PrivacyPage onBack={handleHomeClick} />
      ) : showTermsPage ? (
        <TermsPage onBack={handleHomeClick} />
      ) : (
        <main className="relative">
          <div className="relative z-10">
            <HeroSection onDownloadClick={() => setShowDownloadPage(true)} />
          </div>
        <div className="relative z-20">
          <CalendarSection />
        </div>
        <div className="relative z-30">
          <AttendanceSection />
        </div>
        <div className="relative z-40">
          <TasksSection />
        </div>
        <div className="relative z-50">
          <AIChatSection />
        </div>
        <div className="relative z-[60]">
          <FeaturesGrid />
        </div>
        <div className="relative z-[70]">
          <DownloadCTA onDownloadClick={() => setShowDownloadPage(true)} />
        </div>
        <div className="relative z-[80]">
          <Footer 
            onPrivacyClick={() => { handleHomeClick(); setShowPrivacyPage(true); }}
            onTermsClick={() => { handleHomeClick(); setShowTermsPage(true); }}
          />
        </div>
      </main>
      )}
    </div>
  );
}

export default App;
