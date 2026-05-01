import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  type?: string;
  imageUrl?: string;
  isHome?: boolean;
  keywords?: string;
}

export const SEOHead = ({ 
  title, 
  description, 
  canonicalPath, 
  type = "website",
  imageUrl = "https://revisitstudentmanager.vercel.app/assets/logo_light.png",
  isHome = false,
  keywords = ""
}: SEOHeadProps) => {
  const domain = "https://revisitstudentmanager.vercel.app";
  const url = `${domain}${canonicalPath}`;

  // Default keywords that apply globally
  const defaultKeywords = "revisit app, cynocyte, cynocyte systems, unendless, swarnadeep mukherjee, student manager, student daily life management, academic manager, student planner app, study planner android, attendance tracker app, AI study plan, exam tracker, student routine builder";
  const mergedKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  // Format title: homepage gets its own, subpages get "| Revisit by Cynocyte" suffix
  const formattedTitle = isHome 
    ? title 
    : title.includes("Revisit") && title.includes("Cynocyte") 
      ? title 
      : `${title} | Revisit by Cynocyte`;

  // Generate breadcrumb for subpages
  const breadcrumbName = canonicalPath
    .replace(/^\//, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Home';

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Hidden SEO Keywords */}
      <meta name="keywords" content={mergedKeywords} />

      {/* Robots */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Author / Publisher / Creator */}
      <meta name="author" content="Swarnadeep Mukherjee, Cynocyte" />
      <meta name="publisher" content="Cynocyte, Unendless" />
      <meta name="creator" content="Swarnadeep Mukherjee" />

      {/* Classification */}
      <meta name="category" content="Education, Productivity, Student Tools" />
      <meta name="classification" content="Education" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="3 days" />
      <meta name="language" content="English" />

      {/* Open Graph */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Revisit by Cynocyte" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@cynocyte" />
      <meta name="twitter:creator" content="@cynocyte" />
      <meta name="twitter:image" content={imageUrl} />

      {/* Organization Schema (Global) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Cynocyte",
          "alternateName": "Cynocyte Systems",
          "url": domain,
          "email": "cynocyte@gmail.com",
          "description": "Cynocyte is a tech and software company building apps and tools for students and businesses. A subsidiary of Unendless.",
          "foundingDate": "2026",
          "founder": {
            "@type": "Person",
            "name": "Swarnadeep Mukherjee"
          },
          "parentOrganization": {
            "@type": "Organization",
            "name": "Unendless",
            "alternateName": "UNENDLESS"
          },
          "sameAs": [
            "https://twitter.com/cynocyte",
            "https://instagram.com/cynocyte"
          ]
        })}
      </script>

      {/* BreadcrumbList for subpages */}
      {!isHome && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${domain}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": breadcrumbName,
                "item": url
              }
            ]
          })}
        </script>
      )}

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
              "name": "Revisit by Cynocyte",
              "alternateName": "Revisit Student Manager",
              "url": domain,
              "description": "Official website for the Revisit student life manager Android app by Cynocyte.",
              "publisher": {
                "@type": "Organization",
                "name": "Cynocyte"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${domain}/?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
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
                },
                {
                  "@type": "Question",
                  "name": "What is Cynocyte?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cynocyte is a technology company that builds software products for students and businesses. It is a subsidiary of Unendless and is led by founder Swarnadeep Mukherjee."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is Unendless?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unendless is the parent organization of Cynocyte. It oversees technology ventures including Cynocyte Systems and the Revisit app."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there a free student planner app for Android?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Revisit by Cynocyte is a completely free student planner app for Android. It includes attendance tracking, task management, timetable building, exam countdowns, and AI-powered study plans at no cost."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Revisit have an AI study planner?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Revisit includes an AI-powered study planner that analyzes your exams, syllabus, and reading progress to create personalized, date-wise study schedules."
                  }
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Swarnadeep Mukherjee",
              "jobTitle": "Founder",
              "worksFor": {
                "@type": "Organization",
                "name": "Cynocyte"
              },
              "description": "Founder of Cynocyte and creator of Revisit, a student life management app for Android.",
              "url": domain
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to use Revisit to manage your student life",
              "description": "A simple guide to getting started with the Revisit student manager app on Android.",
              "step": [
                {
                  "@type": "HowToStep",
                  "position": 1,
                  "name": "Download Revisit",
                  "text": "Download the Revisit app for free from the official website or direct APK link."
                },
                {
                  "@type": "HowToStep",
                  "position": 2,
                  "name": "Sign in with Google",
                  "text": "Open Revisit and sign in with your Google account for secure authentication and sync."
                },
                {
                  "@type": "HowToStep",
                  "position": 3,
                  "name": "Set up your subjects and timetable",
                  "text": "Add your subjects and build your weekly timetable to track attendance and routines."
                },
                {
                  "@type": "HowToStep",
                  "position": 4,
                  "name": "Add exams and tasks",
                  "text": "Enter upcoming exams and create tasks with reminders to stay on top of deadlines."
                },
                {
                  "@type": "HowToStep",
                  "position": 5,
                  "name": "Use AI to generate study plans",
                  "text": "Open the AI Chat and ask for a personalized study plan based on your exams and syllabus progress."
                }
              ]
            }
          ])}
        </script>
      )}
    </Helmet>
  );
};
