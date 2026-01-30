import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
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
  Music,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../../components/seo';

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

// Constants
const CANONICAL_URL = 'https://cleack.io/en/tiktok-giveaway-picker/';

// Breadcrumb data
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'TikTok Giveaway Picker', url: CANONICAL_URL },
];

// Table of contents
const tocItems: TOCItem[] = [
  { id: 'how-it-works', title: 'How It Works', level: 2 },
  { id: 'features', title: 'Features', level: 2 },
  { id: 'giveaway-types', title: 'Giveaway Types', level: 2 },
  { id: 'why-cleack', title: 'Why Cleack', level: 2 },
  { id: 'tips', title: 'Pro Tips', level: 2 },
  { id: 'faq', title: 'FAQ', level: 2 },
];

// FAQ data
const faqItems: FAQItem[] = [
  {
    question: "Is the TikTok giveaway picker free?",
    answer: "Yes, Cleack offers a <strong>100% free</strong> TikTok giveaway picker. Pick up to 3 winners for free per draw. Premium plans unlock unlimited draws and advanced features."
  },
  {
    question: "How does the TikTok comment picker work?",
    answer: "Simply paste your TikTok video URL into Cleack. We automatically fetch all comments and randomly select a winner. A <strong>proof video</strong> is generated for transparency."
  },
  {
    question: "Do I need to connect my TikTok account?",
    answer: "No, <strong>no TikTok login required</strong>. Cleack works with public video URLs only. Your account credentials stay private."
  },
  {
    question: "Can Cleack handle viral TikTok videos with thousands of comments?",
    answer: "Absolutely! Cleack can process <strong>unlimited comments</strong>, even from viral TikToks with tens of thousands of entries."
  },
  {
    question: "Does it work with TikTok duets and stitches?",
    answer: "Yes! Cleack analyzes comments on all TikTok video types including regular videos, duets, stitches, and live replays."
  },
  {
    question: "Can I filter TikTok giveaway participants?",
    answer: "Yes, use our filters to require specific hashtags, mentions, minimum comment length, and automatically exclude duplicate entries and suspicious accounts."
  },
  {
    question: "Is running a TikTok giveaway legal?",
    answer: "Yes, TikTok giveaways are legal in most countries. Just follow TikTok's Community Guidelines and local laws. Don't require purchases and always disclose any sponsorships."
  },
  {
    question: "How do I announce my TikTok giveaway winner?",
    answer: "Post a new TikTok video sharing the Cleack proof video, comment the winner's username on the original video, and send them a direct message."
  },
];

// HowTo steps for Schema.org
const howToSteps = [
  {
    name: "Copy your TikTok video link",
    text: "Open your TikTok video, tap 'Share' and select 'Copy Link'.",
  },
  {
    name: "Paste the link into Cleack",
    text: "Paste the TikTok URL into Cleack. All comments are fetched automatically.",
  },
  {
    name: "Set your filters",
    text: "Choose number of winners and enable optional filters like required hashtags or duplicate exclusion.",
  },
  {
    name: "Pick your winner",
    text: "Click 'Pick Winner' and download the proof video to share with your audience.",
  },
];

// Software features for Schema.org
const softwareFeatures = [
  "TikTok comment picker",
  "TikTok giveaway winner selector",
  "Certified proof video",
  "Bot and fake account detection",
  "Advanced comment filters",
  "Multiple winner selection",
  "Works with viral videos",
  "No TikTok login required",
];

// Reviews for Schema.org
const reviews = [
  {
    author: "Alex T.",
    datePublished: "2024-03-20",
    reviewBody: "Used Cleack for my TikTok giveaway with 10k+ comments. Super fast and the proof video is perfect for showing followers the draw was fair!",
    ratingValue: 5,
  },
  {
    author: "Emma S.",
    datePublished: "2024-04-05",
    reviewBody: "Finally a giveaway picker that actually works with TikTok! No login needed and it's free. Love it!",
    ratingValue: 5,
  },
];

// Hreflang alternates
const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-tiktok/' },
  { lang: 'en', url: 'https://cleack.io/en/tiktok-giveaway-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/tiktok-giveaway-picker/' },
];

const TiktokGiveawayPickerPage = () => {
  return (
    <>
      <SEOHead
        title="Free TikTok Giveaway Picker - Pick Random Comment Winner | Cleack"
        description="Pick a random TikTok giveaway winner in seconds. Free comment picker with proof video and bot detection. Works with viral videos. Trusted by 50,000+ creators."
        keywords="tiktok giveaway picker, tiktok comment picker, tiktok winner picker, random tiktok comment picker, tiktok contest picker, free tiktok giveaway picker"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tiktok-giveaway-picker.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="How to Pick a TikTok Giveaway Winner"
        howToDescription="Step-by-step guide to randomly select a winner from TikTok comments"
        howToTotalTime="PT1M"
        includeSoftwareSchema
        softwareRating={4.9}
        softwareRatingCount={1876}
        softwareFeatures={softwareFeatures}
        reviews={reviews}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} dark />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <TikTokIcon className="w-4 h-4" />
                  #1 TikTok Giveaway Tool
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  TikTok Giveaway Picker{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                    Free
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Pick a <strong className="text-white">random winner</strong> from TikTok comments in seconds. 
                  Works with viral videos. Get a{' '}
                  <strong className="text-white">proof video</strong> for your followers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Pick TikTok Winner Free
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                  >
                    How It Works
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>No Login Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>50,000+ Creators</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Tool Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TikTokIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">TikTok Giveaway Picker</h2>
                    <p className="text-gray-400 mt-2">Paste your video link to pick a winner</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://www.tiktok.com/@user/video/..."
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        readOnly
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <TikTokIcon className="w-5 h-5" />
                      </span>
                    </div>

                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Pick Winner Free
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">30s</div>
                      <div className="text-sm text-gray-400">Pick Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">∞</div>
                      <div className="text-sm text-gray-400">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-white">4.9</span>
                      </div>
                      <div className="text-sm text-gray-400">Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-[280px_1fr] gap-12">
              {/* Sidebar TOC */}
              <aside className="hidden lg:block">
                <TableOfContents items={tocItems} sticky />
              </aside>

              {/* Main Content */}
              <main className="min-w-0">
                {/* Intro */}
                <div className="prose prose-lg max-w-none mb-12">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Running a <strong>TikTok giveaway</strong> and need to pick a fair winner? Cleack is the #1 
                    free TikTok giveaway picker, trusted by creators worldwide. Pick winners from comments on 
                    any TikTok video, even viral ones with thousands of entries.
                  </p>
                </div>

                {/* How It Works */}
                <section id="how-it-works" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    How to Pick a TikTok Giveaway Winner
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        step: 1,
                        title: "Copy your TikTok video link",
                        description: "Open your TikTok video, tap the 'Share' button and select 'Copy Link'. Works on mobile and desktop.",
                        icon: <TikTokIcon className="w-6 h-6" />,
                      },
                      {
                        step: 2,
                        title: "Paste into Cleack",
                        description: "Paste the URL into Cleack. We automatically fetch all comments from your video in seconds.",
                        icon: <Zap className="w-6 h-6" />,
                      },
                      {
                        step: 3,
                        title: "Configure filters",
                        description: "Set winner count and enable filters: required hashtags, duplicate removal, fake account detection.",
                        icon: <Filter className="w-6 h-6" />,
                      },
                      {
                        step: 4,
                        title: "Pick winner & share",
                        description: "Click 'Pick Winner' to randomly select. Download the proof video to share with your audience.",
                        icon: <Trophy className="w-6 h-6" />,
                      },
                    ].map((item) => (
                      <div key={item.step} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-pink-600 mb-1">Step {item.step}</div>
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
                    Why Cleack for TikTok Giveaways?
                  </h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        icon: <Video className="w-6 h-6" />,
                        title: "Proof Video",
                        description: "Automatically generate a shareable proof video showing the random selection process.",
                        highlight: true,
                      },
                      {
                        icon: <Bot className="w-6 h-6" />,
                        title: "Fake Account Detection",
                        description: "AI-powered detection automatically filters out bots and suspicious accounts.",
                        highlight: true,
                      },
                      {
                        icon: <Zap className="w-6 h-6" />,
                        title: "Handles Viral Videos",
                        description: "Process thousands of comments from viral TikToks without any issues.",
                      },
                      {
                        icon: <Shield className="w-6 h-6" />,
                        title: "No Login Required",
                        description: "Works with public URLs only. Never need to connect your TikTok account.",
                      },
                      {
                        icon: <Filter className="w-6 h-6" />,
                        title: "Smart Filters",
                        description: "Require hashtags, mentions, or specific keywords. Exclude duplicates automatically.",
                      },
                      {
                        icon: <Users className="w-6 h-6" />,
                        title: "Multiple Winners",
                        description: "Pick multiple winners at once. Perfect for giveaways with multiple prizes.",
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className={`bg-white rounded-xl p-6 border ${
                          feature.highlight ? 'border-pink-200 ring-2 ring-pink-100' : 'border-gray-100'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                          feature.highlight 
                            ? 'bg-gradient-to-br from-cyan-400 to-pink-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    TikTok Giveaway Types We Support
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: <MessageCircle className="w-6 h-6" />,
                        title: "Comment Giveaways",
                        description: "The most popular format. Pick a winner from everyone who commented on your TikTok video.",
                        link: "/en/tiktok-comment-picker/",
                      },
                      {
                        icon: <Heart className="w-6 h-6" />,
                        title: "Like + Comment Giveaways",
                        description: "Require both likes and comments for entry. Filter to only include participants who did both.",
                        link: "/en/tiktok-giveaway/",
                      },
                      {
                        icon: <Music className="w-6 h-6" />,
                        title: "Duet/Stitch Giveaways",
                        description: "Running a creative challenge? Pick from comments on duets or stitched videos too.",
                        link: "/en/tiktok-giveaway-picker/",
                      },
                    ].map((type, index) => (
                      <Link
                        key={index}
                        to={type.link}
                        className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-pink-100 rounded-xl flex items-center justify-center text-pink-600 group-hover:from-cyan-400 group-hover:to-pink-500 group-hover:text-white transition-all">
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 mb-2">
                              {type.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{type.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Why Cleack */}
                <section id="why-cleack" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Cleack vs Other TikTok Pickers
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-xl border border-gray-200">
                      <thead>
                        <tr className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white">
                          <th className="px-6 py-4 text-left font-semibold">Feature</th>
                          <th className="px-6 py-4 text-center font-semibold">Cleack</th>
                          <th className="px-6 py-4 text-center font-semibold">Others</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { feature: "Free to use", cleack: true, others: "Limited" },
                          { feature: "Proof video", cleack: true, others: false },
                          { feature: "Bot detection", cleack: true, others: false },
                          { feature: "Viral video support", cleack: true, others: "Varies" },
                          { feature: "No login required", cleack: true, others: false },
                          { feature: "Advanced filters", cleack: true, others: "Basic" },
                        ].map((row, index) => (
                          <tr key={index}>
                            <td className="px-6 py-3 font-medium text-gray-900">{row.feature}</td>
                            <td className="px-6 py-3 text-center">
                              {row.cleack === true ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-500">{row.cleack}</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {row.others === true ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                              ) : row.others === false ? (
                                <span className="text-red-500">✕</span>
                              ) : (
                                <span className="text-gray-500">{row.others}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Tips */}
                <section id="tips" className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    TikTok Giveaway Tips
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: <Gift className="w-6 h-6" />,
                        title: "Prize Matters",
                        description: "Choose a prize that resonates with your TikTok audience. Trending products or exclusive experiences work best.",
                      },
                      {
                        icon: <Clock className="w-6 h-6" />,
                        title: "Optimal Duration",
                        description: "TikTok moves fast. 3-5 days is ideal for giveaways. Longer durations lose momentum.",
                      },
                      {
                        icon: <Video className="w-6 h-6" />,
                        title: "Create Hype",
                        description: "Post multiple videos promoting your giveaway. Use trending sounds to maximize reach.",
                      },
                      {
                        icon: <BookOpen className="w-6 h-6" />,
                        title: "Clear Rules",
                        description: "State entry rules clearly in your video and caption. 'Comment + follow to enter' is simple and effective.",
                      },
                    ].map((tip, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4">
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
                  <FAQSection
                    items={faqItems}
                    title="TikTok Giveaway Picker FAQ"
                    subtitle="Common questions about picking TikTok giveaway winners"
                  />
                </section>

                {/* Platform Links */}
                <section className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Platforms</h2>
                  <PlatformLinks currentPlatform="tiktok" lang="en" />
                </section>

                {/* Final CTA */}
                <section className="bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white">
                  <h2 className="text-3xl font-bold mb-4">Ready to Pick Your TikTok Winner?</h2>
                  <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                    Join thousands of TikTok creators using Cleack for fair giveaways. Free, fast, and with proof video.
                  </p>
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Pick TikTok Winner Free
                  </Link>
                </section>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TiktokGiveawayPickerPage;
