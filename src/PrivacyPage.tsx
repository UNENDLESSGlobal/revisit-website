import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from './components/SEOHead';
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 md:px-12 items-center">
      <SEOHead 
        title="Privacy Policy — Revisit App by Cynocyte | Data Policy for Students"
        description="Read the Revisit privacy policy by Cynocyte covering data collection, Google account access, AI processing, and your rights."
        canonicalPath="/privacy-policy"
        keywords="revisit privacy policy, cynocyte privacy, student app data policy"
      />
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
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
          <span className="text-revisit-text font-medium">Privacy Policy</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-revisit-text tracking-tight mb-8 text-center">
          Privacy <span className="text-gradient">Policy</span>
        </h1>
        
        <div className="glass-card-strong p-8 md:p-12 rounded-[2.5rem] border border-white/40 shadow-xl bg-white/70 text-revisit-text-secondary space-y-6 leading-relaxed text-sm md:text-base">
          
          <p>This privacy policy applies to the Revisit app (hereby referred to as "Application") for mobile devices that was created by Swarnadeep Mukherjee (hereby referred to as "Service Provider") as a Freemium service. This service is intended for use "AS IS".</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Information Collection and Use</h3>
          <p>The Application collects the following information from you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your name and email address (collected via Google Sign-In or Supabase authentication)</li>
            <li>Your profile picture (collected from your Google account profile upon connecting with Google)</li>
            <li>Your subscription plan type (Free, Premium, or Premium Beta)</li>
            <li>Your device's Internet Protocol address (e.g. IP address)</li>
            <li>The operating system you use on your mobile device</li>
          </ul>

          <p>The Service Provider does <strong className="text-revisit-text">not</strong> currently track your in-app activities or usage behaviour. However, the Service Provider reserves the right to introduce activity tracking in the future, in which case this Privacy Policy will be updated and you will be notified.</p>

          <p>The Application does not gather precise information about the location of your mobile device.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Google Account Access</h3>
          <p>The Application uses Google Sign-In for authentication. When you connect your Google account, the Application collects your name, email address, and profile picture from your Google profile for use within the Application.</p>
          <p>The Application also requests access to the following Google services for sync functionality:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-revisit-text">Google Drive</strong> — used exclusively to sync your personal data within the Application. The Service Provider does not have access to your Google Drive files. Sync occurs entirely between your device and your own Google Drive account.</li>
            <li><strong className="text-revisit-text">Google Calendar</strong> — used exclusively to sync your calendar data within the Application. The Service Provider does not have access to your Google Calendar events. Sync occurs entirely between your device and your own Google Calendar account.</li>
          </ul>
          <p>The Application's use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
          <p>You may revoke the Application's access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Account permissions page</a>. Revoking access will disable sync features within the Application.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Authentication and Data Storage</h3>
          <p>The Application uses Supabase for user authentication and data storage. The following data is stored on Supabase's servers:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your name and email address</li>
            <li>Your profile picture</li>
            <li>Your subscription plan type (Free, Premium, or Premium Beta)</li>
            <li>Your application data required to provide the Service</li>
          </ul>
          <p>Supabase is hosted on Amazon Web Services (AWS). The Service Provider does not sell or share your stored data with any third parties. You can review Supabase's privacy policy at <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">https://supabase.com/privacy</a>.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Artificial Intelligence</h3>
          <p>The Application uses Groq's API to power its AI features. To deliver AI functionality, your data stored within the Application may be processed by Groq's API. This data is used solely to generate responses and provide AI-powered features within the Application. The Service Provider does not use your data to train AI models. You can review Groq's privacy policy at <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">https://groq.com/privacy-policy/</a>.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Email Communication</h3>
          <p>The Service Provider uses your email address for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To verify your account during signup</li>
            <li>To send important notices related to the Application</li>
            <li>To send marketing or promotional communications from time to time</li>
          </ul>
          <p>Emails are sent from <a href="mailto:cynocyte@gmail.com" className="text-revisit-accent hover:underline font-medium">cynocyte@gmail.com</a>. Your email address is not shared with any third party for marketing purposes.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Feedback</h3>
          <p>If you submit feedback through the Application, your feedback data may be stored using Google Sheets via a Google Apps Script webhook. This data is used solely by the Service Provider to improve the Application and is not shared with third parties.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Third Party Access</h3>
          <p>The Service Provider does not sell, trade, or share your personal data with third parties, except as described in this policy (authentication, AI processing, feedback storage, and as required by law).</p>
          <p>The Application utilizes third-party services that have their own Privacy Policies. Below are links to the Privacy Policies of the third-party service providers used by the Application:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Play Services</a></li>
            <li><a href="https://support.google.com/admob/answer/6128543?hl=en" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google AdMob</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Sign-In</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Drive API</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Calendar API</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Sheets (via Google Apps Script)</a></li>
            <li><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Supabase</a></li>
            <li><a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Groq API</a></li>
          </ul>
          
          <p className="mt-4">The Service Provider may disclose your information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>as required by law, such as to comply with a subpoena or similar legal process;</li>
            <li>when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
            <li>with trusted service providers who work on their behalf, do not have an independent use of the information disclosed to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
          </ul>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Opt-Out Rights</h3>
          <p>You can stop all collection of information by the Application by uninstalling it. You may also revoke the Application's access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-revisit-accent hover:underline font-medium">Google Account permissions page</a>.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Data Retention Policy</h3>
          <p>The Service Provider will retain your data for as long as you use the Application and for a reasonable time thereafter. If you would like your data deleted, please contact the Service Provider at <a href="mailto:cynocyte@gmail.com" className="text-revisit-accent hover:underline font-medium">cynocyte@gmail.com</a> and they will respond in a reasonable time.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Children</h3>
          <p>The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. If the Service Provider discovers that a child under 13 has provided personal information, it will be immediately deleted from their servers. If you are a parent or guardian and are aware that your child has provided personal information, please contact the Service Provider at <a href="mailto:cynocyte@gmail.com" className="text-revisit-accent hover:underline font-medium">cynocyte@gmail.com</a>.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Security</h3>
          <p>The Service Provider is concerned about safeguarding the confidentiality of your information and provides physical, electronic, and procedural safeguards to protect the information it processes and maintains.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Changes</h3>
          <p>This Privacy Policy may be updated from time to time. The Service Provider will notify you of any changes by updating this page. You are advised to review this Privacy Policy regularly. Continued use of the Application after changes are posted constitutes your acceptance of those changes.</p>

          <p className="font-medium text-revisit-text">This privacy policy is effective as of 2026-04-14</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Your Consent</h3>
          <p>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p>

          <h3 className="font-heading font-bold text-xl text-revisit-text pt-4">Contact Us</h3>
          <p>If you have any questions regarding privacy while using the Application, please contact the Service Provider via email at <a href="mailto:cynocyte@gmail.com" className="text-revisit-accent hover:underline font-medium">cynocyte@gmail.com</a>.</p>



        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
