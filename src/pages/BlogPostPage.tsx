import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, CalendarDays, User, Download, ExternalLink } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { blogPosts } from '../data/blog-posts';
import { Helmet } from 'react-helmet-async';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="relative min-h-screen bg-revisit-bg flex flex-col pt-24 items-center">
      <SEOHead
        title={`${post.title} | Revisit Blog`}
        description={post.description}
        canonicalPath={post.canonicalPath}
        keywords={post.seoKeywords}
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.description,
            "author": { 
              "@type": "Person", 
              "name": post.author, 
              "@id": post.authorUrl 
            },
            "publisher": { 
              "@type": "Organization", 
              "name": "Cynocyte", 
              "@id": "https://cynocyte.vercel.app/#organization",
              "logo": {
                "@type": "ImageObject",
                "url": "https://getrevisit.vercel.app/assets/logo_light.png"
              }
            },
            "datePublished": post.publishedAt,
            "dateModified": post.publishedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://getrevisit.vercel.app${post.canonicalPath}`
            }
          })}
        </script>
        <meta property="article:author" content={post.authorUrl} />
        <meta property="article:publisher" content="https://cynocyte.vercel.app" />
      </Helmet>

      <div className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(123,97,255,0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl px-6 mt-8 mb-24">
        
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-revisit-text-secondary hover:text-revisit-text transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-revisit-accent/10 text-revisit-accent text-xs font-semibold">
              {post.category}
            </span>
            <span className="text-xs text-revisit-text-secondary font-medium flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-xs text-revisit-text-secondary font-medium flex items-center gap-1.5 border-l border-revisit-border pl-3">
              <Clock className="w-3.5 h-3.5" />
              {post.readTimeMinutes} min read
            </span>
          </div>
          
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-revisit-text leading-tight mb-6">
            {post.title}
          </h1>
          
          <p className="text-lg md:text-xl text-revisit-text-secondary leading-relaxed mb-8">
            {post.description}
          </p>

          <div className="flex items-center gap-3 py-4 border-y border-revisit-border/60">
            <div className="w-10 h-10 rounded-full bg-revisit-accent/20 flex items-center justify-center text-revisit-accent font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-semibold text-revisit-text flex items-center gap-1">
                {post.author}
                <span className="px-2 py-0.5 rounded-full bg-revisit-bg border border-revisit-border text-[10px] text-revisit-text-secondary ml-2">Author</span>
              </div>
              <div className="text-xs text-revisit-text-secondary mt-0.5">Founder, Cynocyte</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <article 
          className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-revisit-text prose-p:text-revisit-text-secondary prose-a:text-revisit-accent hover:prose-a:text-revisit-accent-dark prose-strong:text-revisit-text prose-li:text-revisit-text-secondary prose-blockquote:border-revisit-accent prose-blockquote:bg-revisit-accent/5 prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:text-revisit-text-secondary prose-blockquote:not-italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-revisit-border flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-white border border-revisit-border text-xs font-medium text-revisit-text-secondary">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 glass-card-strong p-8 md:p-10 rounded-[2rem] border-2 border-revisit-accent/30 shadow-lg text-center relative overflow-hidden">
          <div className="absolute inset-0 accent-gradient opacity-5" />
          <h3 className="font-heading text-2xl font-bold text-revisit-text mb-3 relative z-10">Experience a Better Way to Study</h3>
          <p className="text-revisit-text-secondary mb-8 relative z-10 max-w-md mx-auto">
            Join thousands of students managing attendance, tasks, and exams with Revisit's free Android app.
          </p>
          <Link to="/download" className="accent-gradient text-white px-8 py-3.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 relative z-10">
            Download Free App <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-revisit-border">
            <h3 className="font-heading text-2xl font-bold text-revisit-text mb-8">More from the Blog</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(related => (
                <Link 
                  to={`/blog/${related.slug}`} 
                  key={related.slug}
                  className="glass-card flex flex-col p-5 rounded-[1.5rem] border border-revisit-border hover:border-revisit-accent/50 transition-all group bg-white/40"
                >
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-revisit-accent mb-2">
                    {related.category}
                  </span>
                  <h4 className="font-heading text-lg font-bold text-revisit-text mb-2 group-hover:text-revisit-accent transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="text-xs text-revisit-text-secondary line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogPostPage;
