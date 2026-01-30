import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Twitter,
  CheckCircle2,
  Play,
  Shield,
  Zap,
  Users,
  Video,
  Bot,
  Clock,
  Star,
  ArrowRight,
  MessageCircle,
  Heart,
  BookOpen,
  Gift,
  Trophy,
  Sparkles,
  Filter,
  Repeat2,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/twitter-giveaway-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Twitter Giveaway Picker', url: CANONICAL_URL },
];

const tocItems: TOCItem[] = [
  { id: 'how-it-works', title: 'How It Works', level: 2 },
  { id: 'features', title: 'Features', level: 2 },
  { id: 'giveaway-types', title: 'Giveaway Types', level: 2 },
  { id: 'tips', title: 'Pro Tips', level: 2 },
  { id: 'faq', title: 'FAQ', level: 2 },
];

const faqItems: FAQItem[] = [
  {
    question: "Is the Twitter/X giveaway picker free?",
    answer: "Yes! Cleack offers a <strong>100% free</strong> Twitter giveaway picker. Pick up to 3 winners per draw for free."
  },
  {
    question: "How does the Twitter comment picker work?",
    answer: "Paste your tweet URL into Cleack. We fetch all replies and randomly pick a winner with a <strong>proof video</strong>."
  },
  {
    question: "Can I pick from retweets?",
    answer: "Yes! Pick winners from retweets, quote tweets, replies, or likes. Filter by engagement type."
  },
  {
    question: "Does it work with Twitter/X?",
    answer: "Yes, Cleack works with both Twitter and X. The platform name changed but our tool works the same."
  },
  {
    question: "Can I filter giveaway participants?",
    answer: "Yes, use filters for required hashtags, mentions, follower count, and duplicate exclusion."
  },
  {
    question: "Do I need to connect my Twitter account?",
    answer: "No, <strong>no Twitter login required</strong>. Works with public tweet URLs only."
  },
];

const howToSteps = [
  {
    name: "Copy your tweet link",
    text: "Click 'Share' on your tweet and select 'Copy link'.",
  },
  {
    name: "Paste into Cleack",
    text: "Paste the tweet URL. All replies, retweets, and likes are fetched.",
  },
  {
    name: "Configure filters",
    text: "Choose engagement type and set optional filters.",
  },
  {
    name: "Pick winner",
    text: "Click 'Pick Winner' and share the proof.",
  },
];

const softwareFeatures = [
  "Twitter reply picker",
  "Retweet picker",
  "Quote tweet picker",
  "Likes picker",
  "Certified proof video",
  "Bot detection",
  "Hashtag filters",
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-twitter/' },
  { lang: 'en', url: 'https://cleack.io/en/twitter-giveaway-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/twitter-giveaway-picker/' },
];

const TwitterGiveawayPickerPage = () => {
  return (
    <>
      <SEOHead
        title="Free Twitter/X Giveaway Picker - Pick Random Winner | Cleack"
        description="Pick a random Twitter/X giveaway winner from replies, retweets, or likes. Free picker with proof video. Trusted by 50,000+ creators."
        keywords="twitter giveaway picker, x giveaway picker, twitter winner picker, twitter retweet picker, twitter contest picker, free twitter giveaway picker"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-twitter-giveaway-picker.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="How to Pick a Twitter Giveaway Winner"
        howToDescription="Step-by-step guide to randomly select a winner from Twitter engagement"
        howToTotalTime="PT1M"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={1123}
        softwareFeatures={softwareFeatures}
      />

      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Twitter className="w-4 h-4" />
                  #1 Twitter/X Giveaway Tool
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Twitter/X Giveaway Picker{' '}
                  <span className="text-sky-500">Free</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Pick a <strong>random winner</strong> from Twitter replies, retweets, or likes. 
                  Get a <strong>proof video</strong> for transparency.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-sky-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sky-600 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Pick Twitter Winner Free
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-sky-300 transition-all"
                  >
                    How It Works
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span>No Login Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Repeat2 className="w-5 h-5 text-sky-500" />
                    <span>Retweets & Replies</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-sky-500/10 p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Twitter className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Twitter/X Giveaway Picker</h2>
                    <p className="text-gray-500 mt-2">Paste your tweet link to pick a winner</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="https://twitter.com/user/status/..."
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                      readOnly
                    />
                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-sky-600 transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Pick Winner Free
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">30s</div>
                      <div className="text-sm text-gray-500">Average Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">∞</div>
                      <div className="text-sm text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-gray-900">4.8</span>
                      </div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} sticky />
            </aside>

            <main className="min-w-0">
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Running a <strong>Twitter/X giveaway</strong>? Cleack is the #1 free Twitter giveaway picker. 
                  Pick winners from replies, retweets, quote tweets, or likes with full transparency.
                </p>
              </div>

              {/* How It Works */}
              <section id="how-it-works" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  How to Pick a Twitter Giveaway Winner
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { step: 1, title: "Copy tweet link", description: "Click 'Share' on your tweet and select 'Copy link to Tweet'.", icon: <Twitter className="w-6 h-6" /> },
                    { step: 2, title: "Paste into Cleack", description: "Paste the URL and we'll fetch all engagement automatically.", icon: <Zap className="w-6 h-6" /> },
                    { step: 3, title: "Choose engagement type", description: "Pick from replies, retweets, quote tweets, or likes.", icon: <Filter className="w-6 h-6" /> },
                    { step: 4, title: "Pick winner", description: "Random selection with proof video you can quote tweet.", icon: <Trophy className="w-6 h-6" /> },
                  ].map((item) => (
                    <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-sky-600 mb-1">Step {item.step}</div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section id="features" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Why Use Cleack for Twitter Giveaways?
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: <Video className="w-6 h-6" />, title: "Proof Video", description: "Generate proof video to quote tweet to your followers.", highlight: true },
                    { icon: <Bot className="w-6 h-6" />, title: "Bot Detection", description: "AI filters out bot accounts and suspicious engagement.", highlight: true },
                    { icon: <Repeat2 className="w-6 h-6" />, title: "All Engagement Types", description: "Pick from replies, retweets, quote tweets, or likes." },
                    { icon: <Filter className="w-6 h-6" />, title: "Hashtag Filters", description: "Require specific hashtags in replies to qualify." },
                    { icon: <Users className="w-6 h-6" />, title: "Multiple Winners", description: "Pick multiple winners in one draw." },
                    { icon: <Shield className="w-6 h-6" />, title: "No Login", description: "Works with public tweets. No Twitter auth needed." },
                  ].map((feature, index) => (
                    <div key={index} className={`bg-white rounded-xl p-6 border ${feature.highlight ? 'border-sky-200 ring-2 ring-sky-100' : 'border-gray-100'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.highlight ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Giveaway Types */}
              <section id="giveaway-types" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Twitter Giveaway Types</h2>
                
                <div className="space-y-4">
                  {[
                    { icon: <Repeat2 className="w-6 h-6" />, title: "Retweet Giveaways", description: "Pick from everyone who retweeted. Most popular format for reach.", link: "/en/twitter-retweet-picker/" },
                    { icon: <MessageCircle className="w-6 h-6" />, title: "Reply Giveaways", description: "Pick from tweet replies. Great for engagement.", link: "/en/twitter-giveaway-picker/" },
                    { icon: <Heart className="w-6 h-6" />, title: "Like Giveaways", description: "Pick from people who liked your tweet.", link: "/en/twitter-likes-picker/" },
                    { icon: <Twitter className="w-6 h-6" />, title: "Quote Tweet Giveaways", description: "Pick from quote tweets for creative entries.", link: "/en/twitter-giveaway-picker/" },
                  ].map((type, index) => (
                    <Link key={index} to={type.link} className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sky-600">{type.title}</h3>
                          <p className="text-gray-600 text-sm">{type.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Tips */}
              <section id="tips" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Twitter Giveaway Tips</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: <Gift className="w-6 h-6" />, title: "Niche Prizes", description: "Choose prizes relevant to your Twitter audience. Tech, gaming, or exclusive access work great." },
                    { icon: <Clock className="w-6 h-6" />, title: "Short Duration", description: "Twitter moves fast. 2-3 days is optimal for giveaways. Pin the tweet for visibility." },
                    { icon: <Repeat2 className="w-6 h-6" />, title: "RT + Reply", description: "Combine retweet and reply requirements to maximize both reach and engagement." },
                    { icon: <BookOpen className="w-6 h-6" />, title: "Clear Rules", description: "State rules clearly in the tweet. Use a thread if needed. Include the deadline." },
                  ].map((tip, index) => (
                    <div key={index} className="bg-sky-50 rounded-xl p-6 border border-sky-100">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600 mb-4">
                        {tip.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-16">
                <FAQSection items={faqItems} title="Twitter Giveaway Picker FAQ" />
              </section>

              {/* Platform Links */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Platforms</h2>
                <PlatformLinks currentPlatform="twitter" lang="en" />
              </section>

              {/* CTA */}
              <section className="bg-sky-500 rounded-2xl p-8 md:p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Pick Your Twitter Winner?</h2>
                <p className="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
                  Fair, transparent, and free. Pick your Twitter/X giveaway winner in seconds.
                </p>
                <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
                  <Sparkles className="w-5 h-5" />
                  Pick Winner Free
                </Link>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwitterGiveawayPickerPage;
