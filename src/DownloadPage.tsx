import { useState, useEffect } from 'react';
import { ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from './components/SEOHead';
import { Helmet } from 'react-helmet-async';
import { fetchPublicDownloadUrl } from './lib/supabase';

const trackDownloadClick = (eventLabel: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', 'apk_download_click', {
    event_category: 'engagement',
    event_label: eventLabel,
  });
};

const DownloadPage = () => {
  const [downloadUrl, setDownloadUrl] = useState<string>('#');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDownloadLink = async () => {
      try {
        const resolvedUrl = await fetchPublicDownloadUrl();
        setDownloadUrl(resolvedUrl);
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
        title="Download Revisit Free — Student Manager App for Android | Cynocyte"
        description="Download Revisit APK free for Android. Track attendance without total days, manage tasks, build timetables, and get AI study plans. Made by Cynocyte, founded by Swarnadeep Mukherjee. Android 5.0+"
        canonicalPath="/download"
        keywords="download revisit apk, free student app download android, cynocyte app, revisit android download, student planner apk free india, download revisit app, student manager apk, academic planner download, cynocyte app download"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Download Revisit App",
            "potentialAction": {
              "@type": "DownloadAction",
              "target": "https://getrevisit.vercel.app/download"
            }
          })}
        </script>
      </Helmet>
      <Link
        to="/"
        className="absolute top-32 md:top-40 left-6 md:left-12 flex items-center gap-2 text-revisit-text-secondary hover:text-revisit-text transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="orb orb-accent w-[300px] h-[300px] left-[10%] top-[10%] animate-float-slow opacity-30" />
      <div className="orb orb-soft w-[400px] h-[400px] right-[5%] bottom-[10%] animate-float opacity-20" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-2xl mt-12 mb-20 text-center flex flex-col items-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-revisit-text tracking-tight mb-6 mt-16 text-center">
          Download <span className="text-gradient">Revisit</span> — Free Student Manager for Android
        </h1>
        <p className="text-revisit-text-secondary text-lg mb-12 max-w-xl">
          Get the ultimate study companion designed to make your daily life seamless and stress-free. Let's get started.
        </p>

        <div className="glass-card-strong w-full max-w-md p-8 flex flex-col items-center">
          <a
            href={downloadUrl}
            onClick={() => trackDownloadClick('download_page_icon_cta')}
            className={`flex items-center justify-center mb-8 transition-all duration-300 ${isLoading ? 'opacity-70 pointer-events-none' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
          >
            <img src="/assets/logo_light.png" alt="Revisit" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl" />
          </a>

          <h2 className="text-2xl font-bold font-heading mb-2">Download REVISIT</h2>
          <p className="text-sm text-revisit-text-secondary text-center mb-8">
            Available on Android. Fast, secure, and fully native.
          </p>

          <a
            href={downloadUrl}
            onClick={() => trackDownloadClick('download_page_cta')}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-revisit-accent text-white font-semibold rounded-full transition-all duration-300 ${isLoading ? 'opacity-70 pointer-events-none' : 'hover:bg-revisit-accent-dark hover:shadow-lg hover:-translate-y-1 active:scale-95'}`}
          >
            {isLoading ? (
              <span className="flex gap-2 items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Fetching link...</span>
            ) : (
              <>
                <span>Download for Android</span>
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
