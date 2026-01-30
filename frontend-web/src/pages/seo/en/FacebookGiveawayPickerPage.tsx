import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
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
  Share2,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../../components/seo';

// Constants
const CANONICAL_URL = 'https://cleack.io/en/facebook-giveaway-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Facebook Giveaway Picker', url: CANONICAL_URL },
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
    question: "Is the Facebook giveaway picker free?",
    answer: "Yes! Cleack offers a <strong>100% free</strong> Facebook giveaway picker. Pick up to 3 winners for free per draw."
  },
  {
    question: "How does the Facebook comment picker work?",
    answer: "Paste your Facebook post URL into Cleack. We fetch all comments and randomly select a winner with a <strong>proof video</strong>."
  },
  {
    question: "Does it work with Facebook Page posts?",
    answer: "Yes! Cleack works with posts from <strong>personal profiles, Pages, and Groups</strong>. The post just needs to be public."
  },
  {
    question: "Can I filter Facebook giveaway participants?",
    answer: "Yes, use filters like required tags, minimum reactions, duplicate exclusion, and fake account detection."
  },
  {
    question: "Is running a Facebook giveaway legal?",
    answer: "Yes, but you must follow Facebook's Promotion Guidelines. Include official rules and don't require sharing on timelines to enter."
  },
  {
    question: "Can Cleack pick winners from reactions too?",
    answer: "Yes! Pick winners from those who reacted (liked, loved, etc.) to your Facebook post, not just commenters."
  },
];

const howToSteps = [
  {
    name: "Copy your Facebook post link",
    text: "Click the three dots on your post and select 'Copy link'. The post must be public.",
  },
  {
    name: "Paste into Cleack",
    text: "Paste the URL into Cleack. All comments and reactions are fetched automatically.",
  },
  {
    name: "Configure your draw",
    text: "Set number of winners, enable filters for tags or reactions.",
  },
  {
    name: "Pick winner",
    text: "Click 'Pick Winner' and share the proof video on your Page.",
  },
];

const softwareFeatures = [
  "Facebook comment picker",
  "Facebook reaction picker",
  "Page and Group support",
  "Certified proof video",
  "Bot detection",
  "Tag requirement filters",
  "Multiple winners",
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-facebook/' },
  { lang: 'en', url: 'https://cleack.io/en/facebook-giveaway-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/facebook-giveaway-picker/' },
];

const FacebookGiveawayPickerPage = () => {
  return (
    <>
      <SEOHead
        title="Free Facebook Giveaway Picker - Pick Random Comment Winner | Cleack"
        description="Pick a random Facebook giveaway winner for free. Comment picker with proof video. Works with Pages and Groups. Trusted by 50,000+ creators."
        keywords="facebook giveaway picker, facebook comment picker, facebook winner picker, random facebook comment picker, facebook contest picker, free facebook giveaway"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-facebook-giveaway-picker.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="How to Pick a Facebook Giveaway Winner"
        howToDescription="Step-by-step guide to randomly select a winner from Facebook comments"
        howToTotalTime="PT1M"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={1432}
        softwareFeatures={softwareFeatures}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
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
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Facebook className="w-4 h-4" />
                  #1 Facebook Giveaway Tool
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Facebook Giveaway Picker{' '}
                  <span className="text-blue-600">Free</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Pick a <strong>random winner</strong> from Facebook comments in seconds. 
                  Works with Pages and Groups. Get a <strong>proof video</strong> for transparency.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Pick Facebook Winner Free
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-300 transition-all"
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
                    <Users className="w-5 h-5 text-purple-500" />
                    <span>Pages & Groups</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Facebook className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Facebook Giveaway Picker</h2>
                    <p className="text-gray-500 mt-2">Paste your post link to pick a winner</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="https://www.facebook.com/..."
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all"
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
                      <div className="text-sm text-gray-500">Comments</div>
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
                  Running a <strong>Facebook giveaway</strong> on your Page or in a Group? Cleack is the #1 free 
                  Facebook giveaway picker. Pick random winners from comments or reactions with full transparency.
                </p>
              </div>

              {/* How It Works */}
              <section id="how-it-works" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  How to Pick a Facebook Giveaway Winner
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { step: 1, title: "Copy post link", description: "Click the three dots on your Facebook post and select 'Copy link'.", icon: <Facebook className="w-6 h-6" /> },
                    { step: 2, title: "Paste into Cleack", description: "Paste the URL and we'll fetch all comments and reactions automatically.", icon: <Zap className="w-6 h-6" /> },
                    { step: 3, title: "Set filters", description: "Choose winners count, require tags, or pick from reactions only.", icon: <Filter className="w-6 h-6" /> },
                    { step: 4, title: "Pick winner", description: "Random selection with proof video you can share on your Page.", icon: <Trophy className="w-6 h-6" /> },
                  ].map((item) => (
                    <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-600 mb-1">Step {item.step}</div>
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
                  Why Use Cleack for Facebook Giveaways?
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: <Video className="w-6 h-6" />, title: "Proof Video", description: "Shareable proof video showing the random selection.", highlight: true },
                    { icon: <Bot className="w-6 h-6" />, title: "Bot Detection", description: "AI filters out fake accounts and spam comments.", highlight: true },
                    { icon: <Users className="w-6 h-6" />, title: "Pages & Groups", description: "Works with personal profiles, business Pages, and Groups." },
                    { icon: <Heart className="w-6 h-6" />, title: "Reaction Picker", description: "Pick from reactions (likes, loves, etc.) not just comments." },
                    { icon: <Filter className="w-6 h-6" />, title: "Tag Requirements", description: "Require participants to tag friends to qualify." },
                    { icon: <Shield className="w-6 h-6" />, title: "Privacy First", description: "No Facebook login needed. We never access your account." },
                  ].map((feature, index) => (
                    <div key={index} className={`bg-white rounded-xl p-6 border ${feature.highlight ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.highlight ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Facebook Giveaway Types</h2>
                
                <div className="space-y-4">
                  {[
                    { icon: <MessageCircle className="w-6 h-6" />, title: "Comment Giveaways", description: "Pick from everyone who commented. Most popular format.", link: "/en/facebook-comment-picker/" },
                    { icon: <Heart className="w-6 h-6" />, title: "Reaction Giveaways", description: "Pick from people who reacted (liked, loved, etc.) to your post.", link: "/en/facebook-giveaway-picker/" },
                    { icon: <Users className="w-6 h-6" />, title: "Group Giveaways", description: "Run giveaways in Facebook Groups with member-only access.", link: "/en/facebook-group-picker/" },
                    { icon: <Share2 className="w-6 h-6" />, title: "Share Giveaways", description: "Track and pick from people who shared your post.", link: "/en/facebook-giveaway-picker/" },
                  ].map((type, index) => (
                    <Link key={index} to={type.link} className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{type.title}</h3>
                          <p className="text-gray-600 text-sm">{type.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Tips */}
              <section id="tips" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Facebook Giveaway Tips</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: <BookOpen className="w-6 h-6" />, title: "Follow Facebook Rules", description: "Don't require timeline shares to enter. Always include official rules." },
                    { icon: <Clock className="w-6 h-6" />, title: "5-7 Day Duration", description: "Long enough for reach, short enough for excitement." },
                    { icon: <Gift className="w-6 h-6" />, title: "Relevant Prizes", description: "Choose prizes your Facebook audience actually wants." },
                    { icon: <Users className="w-6 h-6" />, title: "Boost Your Post", description: "Consider Facebook ads to reach more potential participants." },
                  ].map((tip, index) => (
                    <div key={index} className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-4">
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
                <FAQSection items={faqItems} title="Facebook Giveaway Picker FAQ" />
              </section>

              {/* Platform Links */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Platforms</h2>
                <PlatformLinks currentPlatform="facebook" />
              </section>

              {/* CTA */}
              <section className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Pick Your Facebook Winner?</h2>
                <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                  Fair, transparent, and free. Pick your Facebook giveaway winner in seconds.
                </p>
                <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
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

export default FacebookGiveawayPickerPage;
