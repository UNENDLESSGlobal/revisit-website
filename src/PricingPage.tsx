import { ArrowLeft, Check, X, Sparkles } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
  onDownload: () => void;
}

const PricingPage = ({ onBack, onDownload }: PricingPageProps) => {
  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 items-center">
      <button 
        onClick={onBack}
        className="absolute top-24 left-6 md:left-12 flex items-center gap-2 text-revisit-text-secondary hover:text-revisit-text transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="orb orb-accent w-[300px] h-[300px] left-[10%] top-[10%] animate-float-slow opacity-30" />
      <div className="orb orb-soft w-[400px] h-[400px] right-[5%] bottom-[10%] animate-float opacity-20" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-5xl mt-12 mb-20 text-center flex flex-col items-center">
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-revisit-text tracking-tight mb-6">
          Simple, transparent <span className="text-gradient">Pricing</span>.
        </h1>
        <p className="text-revisit-text-secondary text-lg mb-12 max-w-xl">
          Choose the best plan that fits your study journey. Upgrade at any time from within the app.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto items-center">
          {/* Free Plan */}
          <div className="glass-card flex flex-col p-8 rounded-[2rem] h-fit border border-revisit-border shadow-sm">
            <div className="mb-6 text-left">
              <h3 className="font-heading text-2xl font-bold text-revisit-text">Basic</h3>
              <p className="text-revisit-text-secondary mt-2">Essential features to get you started.</p>
            </div>
            
            <div className="text-left mb-8 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-revisit-text">Free</span>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-revisit-text font-medium">All basic features</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-revisit-text-secondary">Contains ads</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-revisit-text-secondary">No AI access</span>
              </div>
            </div>

            <button onClick={onDownload} className="w-full py-4 rounded-full font-semibold text-revisit-text bg-white border border-revisit-border hover:bg-gray-50 transition-colors shadow-sm">
              Get Started for Free
            </button>
          </div>

          {/* Premium Plan */}
          <div className="glass-card-strong relative flex flex-col p-10 rounded-[2.5rem] md:scale-[1.03] border-2 border-revisit-accent shadow-xl bg-white/80">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-5 py-1.5 bg-revisit-accent text-white text-sm font-semibold rounded-full shadow-md">
              <Sparkles className="w-4 h-4" />
              <span>Premium Beta</span>
            </div>

            <div className="mb-6 text-left mt-2">
              <h3 className="font-heading text-3xl font-bold text-revisit-text">Premium</h3>
              <p className="text-revisit-text-secondary mt-2">Unlock your full potential with unrestricted app usage.</p>
            </div>

            <div className="text-left mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-revisit-accent tracking-tight">₹99</span>
              <span className="text-revisit-accent/80 font-medium text-sm bg-revisit-accent/10 px-3 py-1 rounded-full">till launch</span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-revisit-text font-medium">All basic features</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-revisit-text font-medium">Ad-free experience</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-revisit-text font-medium">Unlimited AI access</span>
              </div>
            </div>

            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-sm text-emerald-800 font-medium">
                ✨ Enjoy 3 months free after the official launch! Upgrade option available directly inside the app.
              </p>
            </div>

            <button onClick={onDownload} className="btn-primary w-full py-4 rounded-full font-semibold shadow-lg hover:shadow-xl text-lg hover:-translate-y-1 transition-all">
              Unlock Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
