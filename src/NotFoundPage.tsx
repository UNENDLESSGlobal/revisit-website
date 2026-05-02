import { Link } from 'react-router-dom';
import { ArrowLeft, Ghost } from 'lucide-react';
import { SEOHead } from './components/SEOHead';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-32 px-6 md:px-12 items-center justify-center">
      <SEOHead 
        title="Page Not Found — Revisit"
        description="The page you are looking for has moved or no longer exists."
        canonicalPath="/404"
      />
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="orb orb-accent w-[300px] h-[300px] left-[10%] top-[10%] animate-float-slow opacity-30 fixed" />
      <div className="orb orb-soft w-[400px] h-[400px] right-[5%] bottom-[10%] animate-float opacity-20 fixed" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-revisit-accent/10 flex items-center justify-center mb-8">
          <Ghost className="w-12 h-12 text-revisit-accent" />
        </div>
        
        <h1 className="font-heading text-6xl md:text-8xl font-bold text-revisit-text tracking-tight mb-4">
          404
        </h1>
        
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-revisit-text mb-6">
          Page Not Found
        </h2>
        
        <p className="text-revisit-text-secondary text-lg max-w-md mx-auto mb-10 text-balance">
          It looks like the page you are looking for has been moved or no longer exists.
        </p>

        <Link to="/" className="btn-primary flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
