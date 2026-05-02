import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import AboutPage from './AboutPage';
import AttendanceCalculatorPage from './pages/AttendanceCalculatorPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PressPage from './pages/PressPage';
import NotFoundPage from './NotFoundPage';
import { SEOHead } from './components/SEOHead';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  return (
    <main className="relative" id="main-content">
      <SEOHead 
        title="Revisit - by Cynocyte | Free Student Life Manager App for Android"
        description="Revisit is a free Android app by Cynocyte for students to manage attendance, tasks, timetables, exams, and get AI-powered study plans. Download now."
        canonicalPath="/"
        isHome={true}
        keywords="student manager app, student daily life management, academic manager android, free student planner, revisit app, cynocyte, swarnadeep mukherjee, unendless, attendance tracker, AI study plan, exam countdown, study alarm, student routine builder"
      />
      <div className="relative z-10">
        <HeroSection />
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
        <DownloadCTA />
      </div>
      <div className="relative z-[80]">
        <Footer />
      </div>
    </main>
  );
};

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Scroll restoration on route change
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Refresh ScrollTrigger only for home page
    if (location.pathname === '/') {
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
              if (value < 0.02) return 0; // Prevent initial snap jump
              
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
            duration: { min: 0.2, max: 0.6 },
            delay: 0.05,
            ease: 'power1.inOut',
          },
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    } else {
       ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAltPage = location.pathname !== '/';

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

      {!isAdminRoute ? <Navigation isDownloadPage={isAltPage} /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/tools/attendance-calculator" element={<AttendanceCalculatorPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
