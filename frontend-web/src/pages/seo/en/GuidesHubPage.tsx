import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Shield,
  Lightbulb,
  Scale,
  Trophy,
  ArrowRight,
  Instagram,
  CheckCircle2,
} from 'lucide-react';
import { SEOHead, Breadcrumb } from '../../../components/seo';
import type { BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/guides/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Giveaway Guides', url: CANONICAL_URL },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/guide/' },
  { lang: 'en', url: 'https://cleack.io/en/guides/' },
  { lang: 'x-default', url: 'https://cleack.io/en/guides/' },
];

const guides = [
  {
    title: 'How to Run an Instagram Giveaway',
    description: 'Complete step-by-step guide to running successful Instagram giveaways that grow your audience.',
    icon: Instagram,
    url: '/en/guides/instagram-giveaway-guide/',
    volume: '1,300',
    readTime: '10 min',
    featured: true,
  },
  {
    title: 'Giveaway Rules Template',
    description: 'Free template and guide for creating official giveaway rules that protect you legally.',
    icon: Shield,
    url: '/en/guides/giveaway-rules-template/',
    volume: '880',
    readTime: '8 min',
    featured: true,
  },
  {
    title: 'Giveaway Legal Guide',
    description: 'Everything you need to know about running legally compliant giveaways in the US and internationally.',
    icon: Scale,
    url: '/en/guides/giveaway-legal-guide/',
    volume: '210',
    readTime: '12 min',
  },
  {
    title: 'Instagram Giveaway Ideas',
    description: '25+ creative giveaway ideas to engage your Instagram audience and grow your following.',
    icon: Lightbulb,
    url: '/en/guides/instagram-giveaway-ideas/',
    volume: '720',
    readTime: '7 min',
  },
  {
    title: 'Best Giveaway Picker Tools',
    description: 'Comparison of the best giveaway picker tools for Instagram, TikTok, YouTube, and more.',
    icon: Trophy,
    url: '/en/guides/best-giveaway-tools/',
    volume: '590',
    readTime: '6 min',
  },
];

const GuidesHubPage = () => {
  return (
    <>
      <SEOHead
        title="Giveaway Guides - How to Run Social Media Giveaways | Cleack"
        description="Learn how to run successful social media giveaways with our expert guides. Instagram giveaway tips, legal templates, creative ideas, and more."
        keywords="giveaway guide, how to run a giveaway, instagram giveaway guide, giveaway rules template, giveaway legal guide, giveaway ideas"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-guides-hub.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Expert Guides
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Giveaway{' '}
                <span className="text-emerald-600">Guides</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about running <strong>successful social media giveaways</strong>. 
                From legal requirements to creative ideas, we've got you covered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Guides */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Guides</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {guides.filter(g => g.featured).map((guide, index) => {
                const IconComponent = guide.icon;
                return (
                  <motion.div
                    key={guide.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={guide.url}
                      className="block bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all group h-full"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex-shrink-0">
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                              {guide.volume} monthly searches
                            </span>
                            <span className="text-xs text-gray-500">
                              {guide.readTime} read
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {guide.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{guide.description}</p>
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium group-hover:gap-2 transition-all">
                            Read Guide <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Guides */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">All Guides</h2>
            
            <div className="space-y-4">
              {guides.map((guide, index) => {
                const IconComponent = guide.icon;
                return (
                  <Link
                    key={guide.title}
                    to={guide.url}
                    className="block bg-gray-50 rounded-xl p-6 hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:shadow-md transition-all flex-shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-gray-600 text-sm truncate">{guide.description}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                        <span>{guide.readTime}</span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our guides cover everything from beginner basics to advanced strategies.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Platform Rules', description: 'Understand each platform\'s giveaway policies' },
                { title: 'Legal Requirements', description: 'Stay compliant with local and international laws' },
                { title: 'Entry Strategies', description: 'Maximize participation and engagement' },
                { title: 'Winner Selection', description: 'Pick winners fairly and transparently' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Run Your Giveaway?</h2>
              <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
                Put your knowledge into action. Pick your first winner free with Cleack.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                Pick a Winner Free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GuidesHubPage;
