import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Youtube,
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
  ThumbsUp,
  BookOpen,
  Gift,
  Trophy,
  Sparkles,
  Filter,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/youtube-comment-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'YouTube Comment Picker', url: CANONICAL_URL },
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
    question: "Is the YouTube comment picker free?",
    answer: "Yes! Cleack offers a <strong>100% free</strong> YouTube comment picker. Pick up to 3 winners per draw for free."
  },
  {
    question: "How does the YouTube giveaway picker work?",
    answer: "Paste your YouTube video URL into Cleack. We fetch all comments and randomly pick a winner with a <strong>proof video</strong>."
  },
  {
    question: "Can it handle videos with thousands of comments?",
    answer: "Absolutely! Cleack processes <strong>unlimited comments</strong>, even from viral videos with 100,000+ comments."
  },
  {
    question: "Does it work with YouTube Shorts?",
    answer: "Yes! Cleack supports regular videos, Shorts, premieres, and live stream replays."
  },
  {
    question: "Can I filter YouTube giveaway participants?",
    answer: "Yes, use filters for required keywords, subscriber-only comments, duplicate exclusion, and bot detection."
  },
  {
    question: "Do I need to connect my YouTube channel?",
    answer: "No, <strong>no YouTube login required</strong>. Works with public video URLs only."
  },
];

const howToSteps = [
  {
    name: "Copy your YouTube video link",
    text: "Click 'Share' under your video and copy the link.",
  },
  {
    name: "Paste into Cleack",
    text: "Paste the YouTube URL. All comments are fetched automatically.",
  },
  {
    name: "Configure filters",
    text: "Set winners count and enable optional filters.",
  },
  {
    name: "Pick winner",
    text: "Click 'Pick Winner' and share the proof video.",
  },
];

const softwareFeatures = [
  "YouTube comment picker",
  "YouTube Shorts support",
  "Live stream comment picker",
  "Certified proof video",
  "Bot detection",
  "Keyword filters",
  "Multiple winners",
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-youtube/' },
  { lang: 'en', url: 'https://cleack.io/en/youtube-comment-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/youtube-comment-picker/' },
];

const YoutubeCommentPickerPage = () => {
  return (
    <>
      <SEOHead
        title="Free YouTube Comment Picker - Pick Random Giveaway Winner | Cleack"
        description="Pick a random YouTube giveaway winner from comments. Free comment picker with proof video. Works with Shorts and live streams. Trusted by 50,000+ creators."
        keywords="youtube comment picker, youtube giveaway picker, youtube random comment picker, youtube winner picker, youtube contest picker, free youtube comment picker"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-youtube-comment-picker.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="How to Pick a YouTube Comment Winner"
        howToDescription="Step-by-step guide to randomly select a winner from YouTube comments"
        howToTotalTime="PT1M"
        includeSoftwareSchema
        softwareRating={4.9}
        softwareRatingCount={1654}
        softwareFeatures={softwareFeatures}
      />

      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
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
                <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Youtube className="w-4 h-4" />
                  #1 YouTube Comment Picker
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  YouTube Comment Picker{' '}
                  <span className="text-red-600">Free</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Pick a <strong>random winner</strong> from YouTube comments in seconds. 
                  Works with videos, Shorts, and live streams. Get a <strong>proof video</strong> for transparency.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Pick YouTube Winner Free
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-red-300 transition-all"
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
                    <Video className="w-5 h-5 text-red-500" />
                    <span>Shorts Support</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-red-500/10 p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Youtube className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">YouTube Comment Picker</h2>
                    <p className="text-gray-500 mt-2">Paste your video link to pick a winner</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                      readOnly
                    />
                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all"
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
                        <span className="text-2xl font-bold text-gray-900">4.9</span>
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
                  Running a <strong>YouTube giveaway</strong>? Cleack is the #1 free YouTube comment picker. 
                  Pick random winners from video comments, Shorts, or live stream replays with full transparency.
                </p>
              </div>

              {/* How It Works */}
              <section id="how-it-works" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  How to Pick a YouTube Giveaway Winner
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { step: 1, title: "Copy video link", description: "Click 'Share' under your YouTube video and copy the link.", icon: <Youtube className="w-6 h-6" /> },
                    { step: 2, title: "Paste into Cleack", description: "Paste the URL and we'll fetch all comments automatically.", icon: <Zap className="w-6 h-6" /> },
                    { step: 3, title: "Set filters", description: "Choose winners count, require keywords, or exclude duplicates.", icon: <Filter className="w-6 h-6" /> },
                    { step: 4, title: "Pick winner", description: "Random selection with proof video you can show in your next video.", icon: <Trophy className="w-6 h-6" /> },
                  ].map((item) => (
                    <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-red-600 mb-1">Step {item.step}</div>
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
                  Why Use Cleack for YouTube Giveaways?
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: <Video className="w-6 h-6" />, title: "Proof Video", description: "Generate proof video to show in your next upload.", highlight: true },
                    { icon: <Bot className="w-6 h-6" />, title: "Bot Detection", description: "AI filters spam comments and fake accounts.", highlight: true },
                    { icon: <Play className="w-6 h-6" />, title: "Shorts Support", description: "Works with YouTube Shorts and regular videos." },
                    { icon: <MessageCircle className="w-6 h-6" />, title: "Live Streams", description: "Pick from live stream replay comments." },
                    { icon: <Filter className="w-6 h-6" />, title: "Keyword Filters", description: "Require specific words or hashtags in comments." },
                    { icon: <Users className="w-6 h-6" />, title: "Multiple Winners", description: "Pick multiple winners in one draw." },
                  ].map((feature, index) => (
                    <div key={index} className={`bg-white rounded-xl p-6 border ${feature.highlight ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.highlight ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-8">YouTube Giveaway Types</h2>
                
                <div className="space-y-4">
                  {[
                    { icon: <MessageCircle className="w-6 h-6" />, title: "Video Comment Giveaways", description: "Pick from comments on regular YouTube videos.", link: "/en/youtube-comment-picker/" },
                    { icon: <Video className="w-6 h-6" />, title: "Shorts Comment Giveaways", description: "Pick winners from YouTube Shorts comments.", link: "/en/youtube-shorts-picker/" },
                    { icon: <Play className="w-6 h-6" />, title: "Live Stream Giveaways", description: "Pick from live chat or replay comments.", link: "/en/youtube-comment-picker/" },
                    { icon: <ThumbsUp className="w-6 h-6" />, title: "Like + Comment Giveaways", description: "Require both likes and comments to enter.", link: "/en/youtube-comment-picker/" },
                  ].map((type, index) => (
                    <Link key={index} to={type.link} className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">{type.title}</h3>
                          <p className="text-gray-600 text-sm">{type.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Tips */}
              <section id="tips" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">YouTube Giveaway Tips</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: <Gift className="w-6 h-6" />, title: "Subscriber Prizes", description: "Offer prizes your YouTube audience actually wants - merch, exclusive content, or collab opportunities." },
                    { icon: <Clock className="w-6 h-6" />, title: "Pin Your Rules", description: "Pin a comment with giveaway rules and deadline. This helps viewers understand how to enter." },
                    { icon: <Video className="w-6 h-6" />, title: "Announce on Video", description: "Create a dedicated giveaway video or include the announcement at the start of your video." },
                    { icon: <BookOpen className="w-6 h-6" />, title: "Follow Guidelines", description: "Follow YouTube's Community Guidelines. Don't require off-platform actions to enter." },
                  ].map((tip, index) => (
                    <div key={index} className="bg-red-50 rounded-xl p-6 border border-red-100">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-600 mb-4">
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
                <FAQSection items={faqItems} title="YouTube Comment Picker FAQ" />
              </section>

              {/* Platform Links */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Platforms</h2>
                <PlatformLinks currentPlatform="youtube" lang="en" />
              </section>

              {/* CTA */}
              <section className="bg-red-600 rounded-2xl p-8 md:p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Pick Your YouTube Winner?</h2>
                <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
                  Fair, transparent, and free. Pick your YouTube giveaway winner in seconds.
                </p>
                <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
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

export default YoutubeCommentPickerPage;
