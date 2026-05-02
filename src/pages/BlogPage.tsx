import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CalendarDays, ChevronRight } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { blogPosts } from '../data/blog-posts';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BlogPage = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.blog-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 px-6 items-center">
      <SEOHead
        title="Blog — Student Tips, App Updates & Study Guides | Revisit by Cynocyte"
        description="Read the latest articles on student productivity, how to track attendance efficiently, AI study plans, and updates for the Revisit app."
        canonicalPath="/blog"
        keywords="student productivity blog, revisit app updates, attendance tracking tips, AI study guides"
      />

      <Link
        to="/"
        className="absolute top-32 md:top-40 left-6 md:left-12 flex items-center gap-2 text-revisit-text-secondary hover:text-revisit-text transition-colors z-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="orb orb-accent w-[300px] h-[300px] left-[10%] top-[10%] animate-float-slow opacity-30" />
      <div
        className="orb orb-soft w-[420px] h-[420px] right-[5%] bottom-[8%] animate-float opacity-20"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 w-full max-w-5xl mt-12 mb-24">
        <div className="text-center mb-16 pt-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-revisit-text tracking-tight text-balance mb-6">
            The Revisit <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-revisit-text-secondary text-lg md:text-xl max-w-2xl mx-auto text-balance">
            Insights, guides, and updates to help you navigate student life with less chaos and more clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.slug}
              className="blog-card glass-card flex flex-col p-6 rounded-[2rem] border border-revisit-border hover:border-revisit-accent/50 hover:shadow-lg transition-all group bg-white/60"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-revisit-accent/10 text-revisit-accent text-xs font-semibold">
                  {post.category}
                </span>
                <span className="text-xs text-revisit-text-secondary font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTimeMinutes} min read
                </span>
              </div>
              
              <h2 className="font-heading text-xl font-bold text-revisit-text mb-3 group-hover:text-revisit-accent transition-colors line-clamp-3">
                {post.title}
              </h2>
              
              <p className="text-sm text-revisit-text-secondary line-clamp-3 mb-6 flex-1">
                {post.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-revisit-border/50">
                <span className="text-xs text-revisit-text-secondary flex items-center gap-1 font-medium">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-sm font-semibold text-revisit-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read More <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
