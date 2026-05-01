import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from './components/SEOHead';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 md:px-12 items-center">
      <SEOHead 
        title="Terms & Conditions - Revisit App by Cynocyte"
        description="Read Revisit's terms and conditions by Cynocyte covering the freemium model, AI usage, Google access, and third-party services."
        canonicalPath="/terms-and-conditions"
        keywords="revisit terms, cynocyte terms of service, student app terms"
      />
      <Link 
        to="/"
        className="absolute top-24 left-6 md:left-12 flex items-center gap-2 text-revisit-text-secondary hover:text-revisit-text transition-colors z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="orb orb-accent w-[300px] h-[300px] left-[10%] top-[10%] animate-float-slow opacity-30 fixed" />
      <div className="orb orb-soft w-[400px] h-[400px] right-[5%] bottom-[10%] animate-float opacity-20 fixed" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-4xl mt-16 mb-24">
        <div className="flex items-center gap-2 text-sm text-revisit-text-secondary mb-6 justify-center">
          <Link to="/" className="hover:text-revisit-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-revisit-text font-medium">Terms of Service</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-revisit-text tracking-tight mb-8 text-center">
          Terms &amp; <span className="text-gradient">Conditions</span>
        </h1>
        
        <div className="glass-card-strong p-8 md:p-12 rounded-[2.5rem] border border-white/40 shadow-xl bg-white/70 text-revisit-text-secondary space-y-6 leading-relaxed text-sm md:text-base">
          
          <p>These terms and conditions apply to the Revisit app (hereby referred to as "Application") for mobile devices that was created by Swarnadeep Mukherjee (hereby referred to as "Service Provider") as a Freemium service.</p>

          <p>Upon downloading or utilizing the Application, you are automatically agreeing to the following terms. It is strongly advised that you thoroughly read and understand these terms prior to using the Application.</p>

          <p>Unauthorized copying, modification of the Application, any part of the Application, or our trademarks is strictly prohibited. Any attempts to extract the source code of the Application, translate the Application into other languages, or create derivative versions are not permitted. All trademarks, copyrights, database rights, and other intellectual property rights related to the Application remain the property of the Service Provider.</p>

          <p>The Service Provider is dedicated to ensuring that the Application is as beneficial and efficient as possible. As such, they reserve the right to modify the Application or charge for their services at any time and for any reason. The Service Provider assures you that any charges for the Application or its services will be clearly communicated to you.</p>

          <p>The Application stores and processes personal data that you have provided to the Service Provider in order to provide the Service. It is your responsibility to maintain the security of your phone and access to the Application. The Service Provider strongly advises against jailbreaking or rooting your phone, which involves removing software restrictions and limitations imposed by the official operating system of your device. Such actions could expose your phone to malware, viruses, malicious programs, compromise your phone's security features, and may result in the Application not functioning correctly or at all.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Freemium Model and Subscriptions</h3>
          <p>The Application is offered as a Freemium service with the following tiers:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-revisit-text">Free</strong> — access to core features with advertisements served via Google AdMob</li>
            <li><strong className="text-revisit-text">Premium</strong> — full access to all features without advertisements</li>
            <li><strong className="text-revisit-text">Premium Beta</strong> — early access to experimental features, subject to change</li>
          </ul>
          <p>All pricing and feature differences between tiers will be clearly communicated within the Application before any purchase is made.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Google Account Access</h3>
          <p>The Application uses Google Sign-In for authentication and collects your name, email address, and profile picture from your Google profile for use within the Application.</p>
          <p>By connecting your Google account, you grant the Application permission to access Google Drive and Google Calendar solely for sync functionality. This sync occurs entirely between your device and your own Google account. The Service Provider does not have access to your Google Drive files or Google Calendar events.</p>
          <p>You may revoke the Application's access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Account permissions page</a>. Revoking access will disable sync features within the Application.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Authentication and Data Storage</h3>
          <p>The Application uses Supabase for user authentication and data storage. By using the Application, you acknowledge that your name, email address, profile picture, subscription plan, and application data will be stored on Supabase's servers hosted on Amazon Web Services (AWS). Use of Supabase is subject to <a href="https://supabase.com/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Supabase's Terms of Service</a>.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Artificial Intelligence</h3>
          <p>The Application uses Groq's API to power its AI features. By using AI-powered features within the Application, you acknowledge that your data may be processed by Groq's API to generate responses. The Service Provider does not use your data to train AI models. Use of Groq is subject to <a href="https://groq.com/terms-of-use/" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Groq's Terms of Use</a>.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Excessive Use and API Rate Limiting</h3>
          <p>The Application utilizes Groq's API infrastructure to deliver artificial intelligence features and services through the Revisit platform operated by Cynocyte. Groq, as the third-party API provider, retains the exclusive right to monitor, regulate, and enforce usage policies pertaining to the API and its associated services.</p>
          
          <p>You acknowledge and agree that excessive, abusive, or unauthorized use of the AI features within the Application may constitute a violation of Groq's acceptable use policy. Excessive use is defined as, but not limited to: (a) exceeding reasonable usage limits as defined by Groq's Terms of Use; (b) automated, repetitive, or bulk requests made without proper authorization; (c) using the Service in any manner that interferes with or impairs the integrity, availability, or performance of the API; or (d) any other use that violates Groq's Terms of Service or constitutes an abuse of the platform.</p>

          <p>In the event that your account or usage is determined to be in violation of these policies, Groq reserves the right to: (i) throttle your API access, thereby reducing the frequency, speed, or quality of responses provided by the AI features; (ii) temporarily suspend your access to AI functionalities for a specified period; (iii) permanently revoke your access to the Service; or (iv) pursue any other remedies available under applicable law or their Terms of Use.</p>

          <p>The Service Provider (Cynocyte) shall not be held liable for any interruption, limitation, throttling, or suspension of AI services resulting from Groq's enforcement of their usage policies or terms. Any suspension or throttling of services initiated by Groq is beyond the control of Cynocyte and is the exclusive decision of Groq as the API provider. You agree to comply with all terms and conditions set forth by Groq and to use the AI features in a manner that is consistent with their acceptable use policies.</p>

          <p>For detailed information regarding API usage limits, rate limiting, and Groq's acceptable use policies, please refer to <a href="https://groq.com/terms-of-use/" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Groq's Terms of Use</a> and their official documentation.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Email Communication</h3>
          <p>By creating an account, you agree to receive emails from the Service Provider at cynocyte@gmail.com for account verification, important notices, and occasional marketing communications. Your email address will not be shared with third parties for marketing purposes.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Feedback</h3>
          <p>Any feedback you submit through the Application may be stored using Google Sheets via a Google Apps Script webhook. By submitting feedback, you grant the Service Provider the right to use that feedback to improve the Application.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Data and Privacy</h3>
          <p>The Service Provider currently does not track your in-app activities or usage behaviour. The Service Provider only has access to your name, email address, profile picture, and subscription plan type. The Service Provider reserves the right to introduce activity tracking in the future, in which case the Privacy Policy and these Terms will be updated and you will be notified.</p>
          
          <p>Please note that the Application utilizes third-party services that have their own Terms and Conditions. Below are the links to the Terms and Conditions of the third-party service providers used by the Application:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Play Services</a></li>
            <li><a href="https://developers.google.com/admob/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google AdMob</a></li>
            <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Sign-In</a></li>
            <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Drive API</a></li>
            <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Calendar API</a></li>
            <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Sheets (via Google Apps Script)</a></li>
            <li><a href="https://supabase.com/terms" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Supabase</a></li>
            <li><a href="https://groq.com/terms-of-use/" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Groq API</a></li>
          </ul>

          <p>Please be aware that the Service Provider does not assume responsibility for certain aspects. Some functions of the Application require an active internet connection. The Service Provider cannot be held responsible if the Application does not function at full capacity due to lack of Wi-Fi or exhausted data allowance.</p>

          <p>If you are using the application outside of a Wi-Fi area, your mobile network provider's agreement terms still apply. You may incur charges for data usage. By using the application, you accept responsibility for any such charges, including roaming data charges.</p>

          <p>The Service Provider accepts no liability for any loss, direct or indirect, that you experience as a result of relying entirely on the functionality of the Application.</p>

          <p>The Service Provider may update the application at some point. You will need to download updates to continue using the application. The Service Provider may also cease providing the application and may terminate its use at any time without notice. Upon termination, (a) the rights and licenses granted to you in these terms will end; (b) you must cease using the application, and (if necessary) delete it from your device.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Changes to These Terms and Conditions</h3>
          <p>The Service Provider may periodically update these Terms and Conditions. You are advised to review this page regularly for any changes. The Service Provider will notify you of any changes by posting the new Terms and Conditions on this page.</p>

          <p className="font-medium text-revisit-text">These terms and conditions are effective as of 2026-04-14</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Contact Us</h3>
          <p>If you have any questions or suggestions about these Terms and Conditions, please contact the Service Provider at <a href="mailto:cynocyte@gmail.com" className="text-revisit-accent hover:underline font-medium">cynocyte@gmail.com</a>.</p>
          


        </div>
      </div>
    </div>
  );
};

export default TermsPage;
