import { useState, useEffect } from 'react';
import { ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from './components/SEOHead';

const SUPABASE_URL = "https://ngmevcymxvjsjhsbaure.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbWV2Y3lteHZqc2poc2JhdXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODcxNDIsImV4cCI6MjA4NjU2MzE0Mn0.WNDhr5NYZL-8Bea_E0Uv_f4Xq5uaJwPG9WDLh3qJeSA";
const DownloadPage = () => {
  const [downloadUrl, setDownloadUrl] = useState<string>('#');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDownloadLink = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/app_config?id=eq.1&select=update_url`, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0 && data[0].update_url) {
            setDownloadUrl(data[0].update_url);
          }
        }
      } catch (error) {
        console.error('Failed to fetch download url', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloadLink();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 items-center">
      <SEOHead 
        title="Download Revisit — Free Student Manager App for Android"
        description="Download the Revisit Android app for free. Manage your classes, track attendance, stay on top of tasks, and get AI study plans."
        canonicalPath="/download"
      />
      <Link 
        to="/"
        className="absolute top-24 left-6 md:left-12 flex items-center gap-2 text-revisit-text-secondary hover:text-revisit-text transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="orb orb-accent w-[300px] h-[300px] left-[10%] top-[10%] animate-float-slow opacity-30" />
      <div className="orb orb-soft w-[400px] h-[400px] right-[5%] bottom-[10%] animate-float opacity-20" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 w-full max-w-2xl mt-12 mb-20 text-center flex flex-col items-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-revisit-text tracking-tight mb-6">
          Download <span className="text-gradient">Revisit</span> — Free Student Manager for Android
        </h1>
        <p className="text-revisit-text-secondary text-lg mb-12 max-w-xl">
          Get the ultimate study companion designed to make your daily life seamless and stress-free. Let's get started.
        </p>

        <div className="glass-card-strong w-full max-w-md p-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl accent-gradient flex items-center justify-center mb-8 shadow-lg">
            <Download className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold font-heading mb-2">Download Application</h2>
          <p className="text-sm text-revisit-text-secondary text-center mb-8">
            Available on modern mobile devices. Fast, secure, and fully native.
          </p>

          <a 
            href={downloadUrl}
            onClick={() => {
              if (typeof window !== 'undefined' && 'gtag' in window) {
                // @ts-ignore - gtag is loaded via index.html
                window.gtag('event', 'apk_download_click', {
                  'event_category': 'engagement',
                  'event_label': 'download_page_cta'
                });
              }
            }}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-revisit-accent text-white font-semibold rounded-full transition-all duration-300 ${isLoading ? 'opacity-70 pointer-events-none' : 'hover:bg-revisit-accent-dark hover:shadow-lg hover:-translate-y-1 active:scale-95'}`}
          >
            {isLoading ? (
              <span className="flex gap-2 items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Fetching link...</span>
            ) : (
              <>
                <span>Get the App</span>
                <Download className="w-5 h-5" />
              </>
            )}
          </a>
          
          <div className="mt-8 flex items-center gap-2 text-xs text-revisit-text-secondary opacity-80">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure download directly from official servers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
