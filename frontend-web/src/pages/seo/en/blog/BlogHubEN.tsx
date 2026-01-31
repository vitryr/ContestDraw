import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { SEOHead, Breadcrumb } from '../../../../components/seo';
import type { BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Blog', url: CANONICAL_URL },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/blog/' },
  { lang: 'en', url: 'https://cleack.io/en/' },
  { lang: 'x-default', url: 'https://cleack.io/en/' },
];

const articles = [
  {
    title: 'How to Pick an Instagram Giveaway Winner',
    description: 'Step-by-step guide to selecting a random winner from your Instagram giveaway comments.',
    url: '/en/blog/how-to-pick-instagram-winner/',
    date: '2025-01-15',
    readTime: '5 min',
    featured: true,
  },
  {
    title: 'Best Giveaway Picker Tools in 2025',
    description: 'Compare the top giveaway picker tools for Instagram, TikTok, YouTube and more.',
    url: '/en/blog/best-giveaway-picker-tools/',
    date: '2025-01-10',
    readTime: '8 min',
    featured: true,
  },
  {
    title: 'Instagram Giveaway Rules You Need to Know',
    description: 'Everything about Instagram giveaway rules, compliance, and best practices.',
    url: '/en/blog/instagram-giveaway-rules/',
    date: '2025-01-05',
    readTime: '6 min',
  },
];

const BlogHubEN = () => {
  return (
    <>
      <SEOHead
        title="Giveaway Blog - Tips, Guides & Best Practices | Cleack"
        description="Expert tips and guides for running successful social media giveaways. Instagram, TikTok, YouTube giveaway strategies and best practices."
        keywords="giveaway blog, giveaway tips, instagram giveaway guide, social media contest blog"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-blog.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-bg-elevated to-bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Giveaway Tips & Guides
            </h1>
            <p className="text-xl text-ink-secondary max-w-2xl mx-auto">
              Expert advice for running successful social media giveaways.
            </p>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {articles.filter(a => a.featured).map((article, index) => (
                <motion.div
                  key={article.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={article.url}
                    className="block bg-bg-primary rounded-2xl p-8 border border-white/10 hover:shadow-xl hover:border-primary-200 transition-all group h-full"
                  >
                    <div className="flex items-center gap-2 text-sm text-ink-muted mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{article.readTime} read</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-ink-secondary mb-4">{article.description}</p>
                    <span className="inline-flex items-center gap-1 text-primary-600 font-medium group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* All Articles */}
        <section className="py-8 bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">All Articles</h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.url}
                  to={article.url}
                  className="block bg-bg-elevated rounded-xl p-6 hover:bg-primary-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-ink-secondary text-sm">{article.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogHubEN;
