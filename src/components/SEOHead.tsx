import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  type?: string;
  imageUrl?: string;
  isHome?: boolean;
}

export const SEOHead = ({ 
  title, 
  description, 
  canonicalPath, 
  type = "website",
  imageUrl = "https://revisitstudentmanager.vercel.app/og-image.jpg",
  isHome = false
}: SEOHeadProps) => {
  const domain = "https://revisitstudentmanager.vercel.app";
  const url = `${domain}${canonicalPath}`;

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Revisit" />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@cynocyte" />
      <meta name="twitter:image" content={imageUrl} />

      {/* Robots (Most pages index, fallback to props if noindex needed later) */}
      <meta name="robots" content="index, follow" />

      {/* Organization Schema (Global) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Cynocyte",
          "alternateName": "Cynocyte Systems",
          "url": domain,
          "email": "cynocyte@gmail.com",
          "description": "Cynocyte is a tech and software company building apps and tools for students and businesses. A part of Unendless.",
          "foundingDate": "2026",
          "sameAs": [
            "https://twitter.com/cynocyte",
            "https://instagram.com/cynocyte"
          ]
        })}
      </script>

      {/* Home Page Schemas */}
      {isHome && (
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Revisit",
              "alternateName": "Revisit by Cynocyte",
              "operatingSystem": "Android 5.0 and up",
              "applicationCategory": "EducationApplication",
              "applicationSubCategory": "Student Life Manager",
              "description": "Revisit is a free Android app for students to track attendance, manage tasks and reminders, build weekly timetables, view their calendar, and get AI-powered personalized study plans.",
              "offers": [
                {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR",
                  "description": "Free version with ads and basic features."
                },
                {
                  "@type": "Offer",
                  "price": "99",
                  "priceCurrency": "INR",
                  "description": "Premium Beta version: No ads, unlimited AI access, all basic features."
                }
              ],
              "url": domain,
              "author": {
                "@type": "Person",
                "name": "Swarnadeep Mukherjee",
                "url": domain
              },
              "publisher": {
                "@type": "Organization",
                "name": "Cynocyte",
                "url": domain,
                "email": "cynocyte@gmail.com"
              },
              "featureList": [
                "Attendance tracking with percentage calculation",
                "Task and reminder management",
                "Weekly timetable and routine builder",
                "Monthly calendar with custom events",
                "AI-powered personalized study plans",
                "Upcoming exam countdown tracker",
                "Book progress tracking",
                "Google Calendar and Drive sync",
                "Google AdMob ads (Free tier)",
                "Ad-free Premium experience"
              ],
              "datePublished": "2026-04-14",
              "inLanguage": "en"
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Revisit",
              "url": domain,
              "description": "Official website for the Revisit student life manager Android app."
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is Revisit?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Revisit is a free Android app that helps students manage their daily academic life, including attendance tracking, tasks, timetables, calendar, and AI study plans."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Revisit free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Revisit is free to download and use with ads and basic features. A Premium Beta plan is available at ₹99 (valid till official launch), which removes ads and unlocks unlimited AI access."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What features does Revisit include?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Revisit includes attendance tracking, task and reminder management, a monthly calendar, weekly routine builder, upcoming exam countdowns, book progress tracking, and AI-powered personalized study plans."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Revisit require an internet connection?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most features work offline. Google Calendar and Drive sync, and AI features require an internet connection."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What Android version does Revisit support?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Revisit supports Android 5.0 and up."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who made Revisit?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Revisit was created by Swarnadeep Mukherjee under Cynocyte, a tech company that is part of the Unendless group, based in Kolkata, India."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I contact Revisit support?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Contact the Revisit team at cynocyte@gmail.com."
                  }
                }
              ]
            }
          ])}
        </script>
      )}
    </Helmet>
  );
};
