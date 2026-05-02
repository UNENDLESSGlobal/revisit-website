export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  author: string;
  authorUrl: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  content: string; // full markdown-like HTML content
  canonicalPath: string;
  seoKeywords: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-track-attendance-without-total-days",
    title: "How to Track College Attendance Without Knowing Total Number of Days (2026 Guide)",
    description: "Most attendance apps require you to manually enter total classes held. Revisit is the only Android app that calculates your attendance % automatically — without needing the total.",
    publishedAt: "2026-05-02T10:00:00Z",
    author: "Swarnadeep Mukherjee",
    authorUrl: "https://getrevisit.vercel.app/about#swarnadeep-mukherjee",
    category: "Guides",
    tags: ["attendance", "android app", "college India", "75 percent rule"],
    readTimeMinutes: 4,
    canonicalPath: "/blog/how-to-track-attendance-without-total-days",
    seoKeywords: "attendance tracker, without total days, 75 percent UGC rule, Indian college students",
    content: `
      <h2>The Problem with Most Attendance Apps</h2>
      <p>If you are an Indian college student, you already know the stress of the <strong>75% UGC attendance rule</strong>. Missing a few classes can lead to frantic calculations: <em>"If I miss tomorrow's lecture, will I fall below 75%?"</em></p>
      <p>Most attendance tracking apps on the Play Store attempt to solve this by asking you for three variables: <strong>Classes Attended</strong>, <strong>Classes Missed</strong>, and crucially, <strong>Total Classes Conducted</strong>. But here is the reality check: no student realistically knows the exact number of total classes conducted across all their subjects at any given point in the semester.</p>
      <p>This requirement introduces manual errors. You end up relying on guesswork, and by the time you realize your spreadsheet or app is wrong, it's the end of the semester and your admit card is withheld.</p>

      <h2>The Revisit Solution: Math That Actually Makes Sense</h2>
      <p>When I built <strong>Revisit</strong> under Cynocyte, the goal was to eliminate this friction entirely. Revisit's attendance engine is built differently. It requires exactly two inputs from you:</p>
      <ul>
        <li><strong>Did you attend today?</strong></li>
        <li><strong>Did you bunk today?</strong></li>
      </ul>
      <p>That's it. Revisit dynamically tracks your present/absent ratio and calculates your precise attendance percentage on the fly. It implicitely calculates the total number of classes based on your daily inputs without forcing you to manually update a "Total Classes" field every week.</p>

      <h2>How Revisit Keeps You Safe</h2>
      <p>Because Revisit knows your exact present and absent counts, it can run predictive calculations. It tells you:</p>
      <ul>
        <li><strong>The Safe Zone:</strong> "You can safely miss 3 more classes."</li>
        <li><strong>The Danger Zone:</strong> "You need to attend 5 consecutive classes to reach 75%."</li>
      </ul>
      <p>This removes the mental load of calculating attendance. You just tap a button at the end of each lecture, and the app tells you exactly where you stand.</p>

      <h2>Start Tracking Today</h2>
      <p>Don't wait until the end of the semester to figure out your attendance. <a href="/download">Download Revisit for Android for free</a> and let the app handle the math while you focus on what actually matters — your studies (and maybe a little bit of fun).</p>
    `
  },
  {
    slug: "ai-study-plan-for-board-exams-india",
    title: "How AI Can Generate Your Personalized Study Plan for Board Exams — Using Revisit",
    description: "Revisit's AI chat, powered by Groq, analyzes your exam dates, subjects, and current book progress to generate a day-by-day study plan. Here's exactly how it works.",
    publishedAt: "2026-05-01T14:30:00Z",
    author: "Swarnadeep Mukherjee",
    authorUrl: "https://getrevisit.vercel.app/about#swarnadeep-mukherjee",
    category: "AI Features",
    tags: ["AI study plan", "board exams India", "CBSE", "AI study planner android"],
    readTimeMinutes: 5,
    canonicalPath: "/blog/ai-study-plan-for-board-exams-india",
    seoKeywords: "AI study plan, board exams India, CBSE study planner, AI study planner android, Groq AI",
    content: `
      <h2>The Board Exam Chaos</h2>
      <p>Whether you're preparing for CBSE, ICSE, or State Board exams, the sheer volume of syllabus can be overwhelming. Standard timetables break down the moment you fall behind schedule, and generic study plans found online rarely apply to your specific strengths and weaknesses.</p>
      <p>What students need isn't a rigid timetable, but a dynamic planner that adapts to what they've actually completed. Enter the AI Study Planner.</p>

      <h2>How Revisit Uses AI to Build Your Plan</h2>
      <p>The <strong>Revisit Android app</strong> features a built-in AI Chat assistant powered by Groq's high-speed inference. But it's not just a generic chatbot. Revisit's AI has <em>context</em> about your academic life.</p>
      <p>When you use Revisit, you input your upcoming exams, your subject syllabus, and your current progress in different books. When you ask the AI for a study plan, it reads this contextual data to generate a highly personalized, day-by-day breakdown.</p>

      <h2>An Example Prompt</h2>
      <p>Imagine you have your Physics board exam in 15 days, and you've only completed 40% of the syllabus. You can simply open the Revisit AI Chat and type:</p>
      <blockquote>
        "Create a 14-day intensive study plan for my upcoming Physics board exam. I need to focus heavily on Electromagnetism and Optics. Include revision days."
      </blockquote>
      <p>The AI will instantly output a structured routine, allocating specific chapters to specific days, reserving time for mock papers, and ensuring you cover the highest-weightage topics first.</p>

      <h2>The Advantage of Contextual AI</h2>
      <p>Unlike ChatGPT, you don't need to explain your entire academic history to Revisit. Revisit already knows when your exams are scheduled and what tasks you have pending. This makes the AI study plan far more actionable and integrated into your daily routine.</p>

      <h2>Try the Revisit AI Today</h2>
      <p>The AI study planner is available in the Revisit app. The free tier gives you a limited number of requests to test it out, while the Premium tier unlocks unlimited AI generation to guide you through your entire board exam season. <a href="/download">Download Revisit</a> and get your personalized plan today.</p>
    `
  },
  {
    slug: "revisit-vs-mystudylife-student-apps-compared",
    title: "Revisit vs MyStudyLife: Which Is the Best Student Planner App in 2026?",
    description: "MyStudyLife is the most popular student planner globally. But Revisit offers unique features Indian students need: attendance without total days, AI study plans, and books tracking. Full comparison.",
    publishedAt: "2026-04-28T09:15:00Z",
    author: "Swarnadeep Mukherjee",
    authorUrl: "https://getrevisit.vercel.app/about#swarnadeep-mukherjee",
    category: "Comparisons",
    tags: ["Revisit vs MyStudyLife", "best student planner app 2026", "student manager android India"],
    readTimeMinutes: 6,
    canonicalPath: "/blog/revisit-vs-mystudylife-student-apps-compared",
    seoKeywords: "Revisit vs MyStudyLife, best student planner app 2026, student manager android India, Cynocyte Revisit",
    content: `
      <h2>The Search for the Perfect Student App</h2>
      <p>For years, <strong>MyStudyLife</strong> has been the gold standard for student planner apps globally. It introduced digital timetables and task tracking to millions of students. But in 2026, the academic landscape — especially in India — demands more specialized tools.</p>
      <p>Enter <strong>Revisit</strong>, the new student manager app by Cynocyte. While MyStudyLife caters to a broad, global audience, Revisit is laser-focused on solving the specific pain points of modern students, particularly those dealing with strict attendance rules and overwhelming syllabi.</p>

      <h2>Feature Comparison</h2>
      
      <h3>1. Timetable and Scheduling</h3>
      <p>Both apps excel here. MyStudyLife has a robust rotation-based scheduling system. Revisit offers a clean, visual weekly routine builder that integrates seamlessly with your Android ecosystem and supports Google Calendar sync. It's a tie here depending on your preference for UI.</p>

      <h3>2. Attendance Tracking</h3>
      <p><strong>Winner: Revisit.</strong> MyStudyLife's attendance tracking is basic. Revisit, on the other hand, was built around the infamous 75% UGC attendance rule in India. It calculates your percentage dynamically without requiring you to input the "total days" conducted. It tells you exactly how many classes you can afford to bunk, making it infinitely more useful for college students.</p>

      <h3>3. Task and Exam Management</h3>
      <p>Both apps handle exams and assignments well. However, Revisit introduces a "Books Tracking" feature, allowing you to log your progress chapter-by-chapter through textbooks — a massive advantage for competitive exam preparation (like JEE or NEET).</p>

      <h3>4. Artificial Intelligence</h3>
      <p><strong>Winner: Revisit.</strong> MyStudyLife relies on manual data entry. Revisit integrates a powerful Groq-powered AI Chat assistant. You can ask it to generate personalized study plans based on your upcoming exams and current progress, essentially acting as a digital tutor and academic strategist.</p>

      <h2>The Verdict</h2>
      <p>MyStudyLife remains a fantastic, reliable app for basic scheduling. But if you are looking for an app that actually acts as a "second brain" — actively managing your attendance thresholds, tracking your syllabus progress, and generating AI study plans — <strong>Revisit is the clear winner for 2026</strong>.</p>
      <p>Ready to make the switch? <a href="/download">Download Revisit for Android</a> and upgrade your academic workflow today.</p>
    `
  }
];
