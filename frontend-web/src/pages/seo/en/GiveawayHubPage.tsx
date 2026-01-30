import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Gift,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Video,
  Shield,
  Sparkles,
} from 'lucide-react';
import { SEOHead, Breadcrumb } from '../../../components/seo';
import type { BreadcrumbItem } from '../../../components/seo';

// TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const CANONICAL_URL = 'https://cleack.io/en/giveaway/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Social Media Giveaway Picker', url: CANONICAL_URL },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/jeu-concours/' },
  { lang: 'en', url: 'https://cleack.io/en/giveaway/' },
  { lang: 'x-default', url: 'https://cleack.io/en/giveaway/' },
];

const platforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
    borderColor: 'border-pink-200',
    volume: '33,100',
    url: '/en/instagram-giveaway-picker/',
    description: 'Pick winners from comments, likes, stories, or Reels.',
  },
  {
    name: 'TikTok',
    icon: TikTokIcon,
    color: 'from-cyan-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-gray-900 to-black',
    borderColor: 'border-gray-700',
    textColor: 'text-white',
    volume: '9,900',
    url: '/en/tiktok-giveaway-picker/',
    description: 'Pick winners from TikTok comments on any video.',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    volume: '8,100',
    url: '/en/youtube-comment-picker/',
    description: 'Pick winners from video comments, Shorts, or live streams.',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    volume: '6,600',
    url: '/en/facebook-giveaway-picker/',
    description: 'Pick winners from comments or reactions on Pages and Groups.',
  },
  {
    name: 'Twitter/X',
    icon: Twitter,
    color: 'from-sky-400 to-sky-500',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    volume: '4,400',
    url: '/en/twitter-giveaway-picker/',
    description: 'Pick winners from retweets, replies, or likes.',
  },
];

const features = [
  {
    icon: Video,
    title: 'Proof Video',
    description: 'Every draw generates a shareable proof video for transparency.',
  },
  {
    icon: Shield,
    title: 'Bot Detection',
    description: 'AI-powered detection filters out fake accounts automatically.',
  },
  {
    icon: Users,
    title: 'Multi-Platform',
    description: 'Works with all major social media platforms in one place.',
  },
  {
    icon: CheckCircle2,
    title: '100% Free',
    description: 'Pick up to 3 winners per draw completely free.',
  },
];

const GiveawayHubPage = () => {
  return (
    <>
      <SEOHead
        title="Free Social Media Giveaway Picker - Pick Random Winners | Cleack"
        description="Pick random giveaway winners from Instagram, TikTok, YouTube, Facebook, and Twitter. Free comment picker with proof video. Trusted by 50,000+ creators."
        keywords="giveaway picker, comment picker, winner picker, social media giveaway, random winner generator, free giveaway picker"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-giveaway-hub.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
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
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Gift className="w-4 h-4" />
                All Platforms, One Tool
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Social Media{' '}
                <span className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                  Giveaway Picker
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Pick random winners from <strong>Instagram, TikTok, YouTube, Facebook, and Twitter</strong> giveaways. 
                Free, fast, and with certified proof video for full transparency.
              </p>

              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Pick a Winner Free
              </Link>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span>4.8/5 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span>50,000+ creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>No login required</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platforms Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Platform</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the social media platform where your giveaway is running. 
                Cleack works with all major platforms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, index) => {
                const IconComponent = platform.icon;
                return (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={platform.url}
                      className={`block ${platform.bgColor} rounded-2xl p-6 border ${platform.borderColor} hover:shadow-xl transition-all group h-full`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${platform.textColor || 'text-gray-900'}`}>
                            {platform.name}
                          </h3>
                          <p className={`text-sm ${platform.textColor ? 'text-gray-400' : 'text-gray-500'}`}>
                            {platform.volume} monthly searches
                          </p>
                        </div>
                      </div>
                      <p className={`${platform.textColor ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                        {platform.description}
                      </p>
                      <span className={`inline-flex items-center gap-1 font-medium ${platform.textColor ? 'text-cyan-400' : 'text-primary-600'} group-hover:gap-2 transition-all`}>
                        Pick {platform.name} Winner <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Creators Love Cleack</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The most complete giveaway picker tool on the market.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Giveaway Resources</h2>
              <p className="text-gray-600">Learn how to run successful social media giveaways.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/en/guides/" className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  Giveaway Guides
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Step-by-step guides for running successful giveaways on every platform.
                </p>
                <span className="inline-flex items-center gap-1 text-primary-600 font-medium group-hover:gap-2 transition-all">
                  View Guides <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link to="/en/tools/" className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  Free Tools
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Rules generator, participant counter, and other free giveaway tools.
                </p>
                <span className="inline-flex items-center gap-1 text-primary-600 font-medium group-hover:gap-2 transition-all">
                  View Tools <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <Link to="/en/blog/" className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  Blog & Tips
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Expert tips, ideas, and best practices for social media giveaways.
                </p>
                <span className="inline-flex items-center gap-1 text-primary-600 font-medium group-hover:gap-2 transition-all">
                  Read Blog <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Pick Your Winner?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join over 50,000 creators who trust Cleack for fair and transparent giveaways.
              </p>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Pick a Winner Free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GiveawayHubPage;
