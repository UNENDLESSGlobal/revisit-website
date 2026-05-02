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
  imageUrl = "https://getrevisit.vercel.app/assets/logo_light.png",
  isHome = false,
  keywords = ""
}: SEOHeadProps) => {
  const domain = "https://getrevisit.vercel.app";
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
      <meta name="twitter:image:alt" content="Revisit App Logo" />

      {/* Hreflang Tags */}
      <link rel="alternate" hrefLang="en" href={`${domain}${canonicalPath}`} />
      <link rel="alternate" hrefLang="en-IN" href={`${domain}${canonicalPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${domain}${canonicalPath}`} />

      {/* Global Schemas (Organization & Person) */}
      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://unendless.vercel.app/#organization",
            "name": "UNENDLESS",
            "alternateName": "Unendless",
            "url": "https://unendless.vercel.app",
            "description": "UNENDLESS is a multi-sector parent company founded by Swarnadeep Mukherjee. Its subsidiaries include Cynocyte (technology), Cynocyte Systems (software infrastructure), and future ventures including UNENDLESS Studios (media production).",
            "founder": {
              "@id": "https://getrevisit.vercel.app/#swarnadeep-mukherjee"
            },
            "subOrganization": [
              {
                "@type": "Organization",
                "@id": "https://cynocyte.vercel.app/#organization",
                "name": "Cynocyte"
              }
            ],
            "sameAs": [
              "https://www.instagram.com/unendless.global/"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://cynocyte.vercel.app/#organization",
            "name": "Cynocyte",
            "alternateName": "Cynocyte Systems",
            "url": domain,
            "email": "cynocyte@gmail.com",
            "description": "Cynocyte is a tech and software company building apps and tools for students and businesses. A subsidiary of Unendless.",
            "foundingDate": "2026",
            "founder": {
              "@id": "https://getrevisit.vercel.app/#swarnadeep-mukherjee"
            },
            "parentOrganization": {
              "@id": "https://unendless.vercel.app/#organization"
            },
            "sameAs": [
              "https://www.instagram.com/cynocyte/",
              "https://www.instagram.com/cynocyteindia/",
              "https://x.com/cynocyte",
              "https://www.youtube.com/@cynocyte",
              "https://www.reddit.com/user/cynocyte/",
              "https://www.threads.net/@cynocyte"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://getrevisit.vercel.app/#swarnadeep-mukherjee",
            "name": "Swarnadeep Mukherjee",
            "givenName": "Swarnadeep",
            "familyName": "Mukherjee",
            "jobTitle": "Founder & CEO",
            "description": "Swarnadeep Mukherjee is the founder of Cynocyte and creator of the Revisit student life manager app. He leads Cynocyte, a tech subsidiary of UNENDLESS, based in Kolkata, India.",
            "nationality": "Indian",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kolkata",
              "addressRegion": "West Bengal",
              "addressCountry": "IN"
            },
            "worksFor": {
              "@type": "Organization",
              "name": "Cynocyte",
              "@id": "https://cynocyte.vercel.app/#organization"
            },
            "url": `${domain}/about`,
            "sameAs": [
              "https://www.linkedin.com/in/swarnadeepmukherjee-unendless/",
              "https://x.com/theswarnadeep_",
              "https://www.instagram.com/theswarnadeep_/",
              "https://www.threads.net/@theswarnadeep_",
              "https://www.reddit.com/user/SwarnadeepMukherjee/"
            ]
          }
        ])}
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
              "@type": "MobileApplication",
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
                "@id": "https://getrevisit.vercel.app/#swarnadeep-mukherjee"
              },
              "publisher": {
                "@id": "https://cynocyte.vercel.app/#organization"
              },
              "isAccessibleForFree": true,
              "downloadUrl": `${domain}/download`,
              "screenshot": [
                `${domain}/assets/screenshot1_placeholder.png`,
                `${domain}/assets/screenshot2_placeholder.png`,
                `${domain}/assets/screenshot3_placeholder.png`
              ],
              "featureList": [
                "Attendance calculation without total classes",
                "75% UGC attendance rule tracking",
                "AI study plan generation using Groq",
                "Google Drive sync",
                "Google Calendar sync",
                "Task and reminder management",
                "Weekly timetable and routine builder",
                "Monthly calendar with custom events",
                "AI-powered personalized study plans",
                "Upcoming exam countdown tracker",
                "Book progress tracking",
                "Google AdMob ads (Free tier)",
                "Ad-free Premium experience",
                "Offline functionality for basic features",
                "Secure Google Sign-In authentication"
              ],
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student"
              },
              "availableOnDevice": "Mobile",
              "countriesSupported": "IN, US, GB, AU, CA",
              "datePublished": "2026-04-14",
              "inLanguage": "en"
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareSourceCode",
              "name": "Revisit by Cynocyte",
              "creator": {
                "@id": "https://getrevisit.vercel.app/#swarnadeep-mukherjee"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "Revisit App Demo - Student Life Manager by Cynocyte",
              "description": "See how Revisit helps students manage attendance, tasks, timetables, and get AI-powered study plans. Free Android app by Cynocyte.",
              "thumbnailUrl": `${domain}/assets/logo_light.png`,
              "uploadDate": "2026-04-14",
              "contentUrl": "https://www.youtube.com/@cynocyte"
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Revisit by Cynocyte",
              "alternateName": "Revisit Student Manager",
              "url": domain,
              "description": "Official website for the Revisit student life manager Android app by Cynocyte.",
              "publisher": {
                "@id": "https://cynocyte.vercel.app/#organization"
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
                },
                {
                  "@type": "Question",
                  "name": "Who is Swarnadeep Mukherjee?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Swarnadeep Mukherjee is the founder and CEO of Cynocyte, a technology company based in Kolkata, India. He is the creator of Revisit, a free student life management app for Android. Swarnadeep built Revisit to help Indian students manage attendance, tasks, timetables, and get AI-powered study plans in one app. Cynocyte is a subsidiary of UNENDLESS, a multi-sector parent company."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is Cynocyte?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cynocyte is a technology company founded by Swarnadeep Mukherjee in 2026 as a subsidiary of UNENDLESS. Cynocyte builds software products for students and businesses. Its first product is Revisit, a free Android app for student life management. The company also includes Cynocyte Systems, a software infrastructure sub-division."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is UNENDLESS?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "UNENDLESS is a parent company founded by Swarnadeep Mukherjee that owns and operates multiple subsidiaries including Cynocyte (technology) and future ventures like UNENDLESS Studios (media production). It operates similarly to a holding company structure."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can Revisit track attendance without entering total number of days?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Revisit is one of the only student apps that can calculate your attendance percentage without requiring you to manually enter the total number of classes held. You simply mark present or absent each day, and Revisit calculates your running percentage automatically."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Revisit follow the 75% UGC attendance rule for Indian colleges?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Revisit is built specifically with the 75% UGC (University Grants Commission) attendance requirement in mind. It shows you real-time attendance percentage, alerts you when you approach the 75% threshold, and calculates how many more classes you can safely miss."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Revisit better than MyStudyLife for Indian students?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Revisit is specifically designed for Indian students and includes features like attendance tracking without total days, a 75% UGC attendance alert, AI-powered study plans using Groq, and books progress tracking — features not available in MyStudyLife. MyStudyLife is a great cross-platform app, but Revisit is built for the Indian academic system."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What makes Revisit different from other attendance tracker apps?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unlike other attendance tracker apps, Revisit includes: (1) attendance tracking without needing the total number of days, (2) AI-generated study plans based on your exam schedule and current progress, (3) books tracking, (4) Google Drive and Calendar sync, and (5) a complete student dashboard combining tasks, timetable, calendar, and AI — all in one free Android app."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Revisit app available on iOS?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Currently, Revisit is available only on Android (Android 5.0 and above). An iOS version is not yet available. You can download the Android APK from the official website at getrevisit.vercel.app/download."
                  }
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Revisit App Features",
              "description": "Complete feature list of the Revisit student life manager app by Cynocyte",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Attendance tracking without total days" },
                { "@type": "ListItem", "position": 2, "name": "AI study plan generation" },
                { "@type": "ListItem", "position": 3, "name": "75% UGC attendance alerts" },
                { "@type": "ListItem", "position": 4, "name": "Books progress tracking" },
                { "@type": "ListItem", "position": 5, "name": "Google Drive sync" },
                { "@type": "ListItem", "position": 6, "name": "Google Calendar sync" },
                { "@type": "ListItem", "position": 7, "name": "Weekly timetable builder" },
                { "@type": "ListItem", "position": 8, "name": "Exam countdown timer" },
                { "@type": "ListItem", "position": 9, "name": "Task and reminder management" },
                { "@type": "ListItem", "position": 10, "name": "Free with ad-free premium option" }
              ]
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
