import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
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
  Download,
  Share2,
} from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks, TableOfContents } from '../../../components/seo';
import type { FAQItem, TOCItem, BreadcrumbItem } from '../../../components/seo';

// Constants
const CANONICAL_URL = 'https://cleack.io/en/instagram-giveaway-picker/';

// Breadcrumb data
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Instagram Giveaway Picker', url: CANONICAL_URL },
];

// Table of contents
const tocItems: TOCItem[] = [
  { id: 'how-it-works', title: 'How It Works', level: 2 },
  { id: 'features', title: 'Features', level: 2 },
  { id: 'giveaway-types', title: 'Giveaway Types', level: 2 },
  { id: 'why-cleack', title: 'Why Cleack', level: 2 },
  { id: 'tutorial', title: 'Complete Guide', level: 2 },
  { id: 'tips', title: 'Pro Tips', level: 2 },
  { id: 'faq', title: 'FAQ', level: 2 },
];

// FAQ data
const faqItems: FAQItem[] = [
  {
    question: "Is the Instagram giveaway picker really free?",
    answer: "Yes, Cleack offers a <strong>100% free</strong> Instagram giveaway picker. You can select up to 3 winners for free per draw. For advanced features (unlimited draws, CSV export, API access), premium plans start at $9/month."
  },
  {
    question: "How does the Instagram giveaway picker work?",
    answer: "It's super simple: paste your Instagram post URL into Cleack. Our tool automatically fetches all comments, then randomly selects one or more winners. A <strong>proof video</strong> is generated to guarantee transparency."
  },
  {
    question: "Do I need to give access to my Instagram account?",
    answer: "No, <strong>no login required</strong>. Cleack works only with your public post URL. Your credentials stay private and we never access your account."
  },
  {
    question: "How many comments can Cleack analyze?",
    answer: "There's <strong>no limit</strong>. Cleack can analyze posts with thousands or even tens of thousands of comments. Our infrastructure is built to handle large volumes quickly."
  },
  {
    question: "Can I filter giveaway participants?",
    answer: "Yes, you get advanced filters: <ul><li>Required mentions (@friend)</li><li>Required hashtags</li><li>Minimum word count</li><li>Exclude private accounts</li><li>Bot and fake account detection</li><li>Duplicate exclusion</li></ul>"
  },
  {
    question: "Does it work with Instagram Reels and Stories?",
    answer: "Yes! Cleack supports all formats: <strong>regular posts, Reels, carousels</strong>, and even <strong>Stories</strong> (for mentions and replies). Check our dedicated pages for each format."
  },
  {
    question: "Is it legal to run an Instagram giveaway?",
    answer: "Yes, it's perfectly legal in the US and most countries as long as you follow certain rules: write clear rules, don't require a purchase to enter, and comply with Instagram's promotion guidelines. Check our <a href='/en/guides/giveaway-legal-guide/'>legal guide</a> for details."
  },
  {
    question: "How do I contact the winner after the draw?",
    answer: "Once the draw is complete, you can contact the winner several ways: <strong>public comment</strong> on your post, <strong>Instagram DM</strong>, or share the proof video in your story and tag them."
  },
  {
    question: "Can I redo a draw if the winner doesn't respond?",
    answer: "Absolutely! Keep your participant list and run a new draw excluding the first winner. That's why we recommend setting a response deadline in your rules (usually 48h to 7 days)."
  },
  {
    question: "Does Cleack store my data or participants' data?",
    answer: "No, Cleack <strong>doesn't store any personal data</strong>. Comments are analyzed in real-time and deleted immediately after the draw. We're 100% GDPR compliant."
  },
];

// HowTo steps for Schema.org
const howToSteps = [
  {
    name: "Copy your Instagram post link",
    text: "Go to your Instagram post (photo, carousel or Reel), tap the three dots (...) and select 'Copy Link'.",
  },
  {
    name: "Paste the link into Cleack",
    text: "Paste the copied URL into the field on Cleack. The tool automatically fetches all comments from your post in seconds.",
  },
  {
    name: "Configure your filters",
    text: "Set the number of winners you want and enable optional filters: required mentions, required hashtags, duplicate exclusion, bot detection.",
  },
  {
    name: "Run the giveaway draw",
    text: "Click 'Pick Winner'. Cleack randomly selects the winner(s) and automatically generates a proof video you can share.",
  },
];

// Software features for Schema.org
const softwareFeatures = [
  "Instagram comment picker",
  "Instagram likes picker",
  "Instagram story picker",
  "Instagram Reels picker",
  "Certified proof video",
  "Automatic fake account and bot detection",
  "Advanced filters (mentions, hashtags, minimum words)",
  "CSV export of participants",
  "API for automation",
  "Multiple winners in one click",
];

// Reviews for Schema.org
const reviews = [
  {
    author: "Sarah M.",
    datePublished: "2024-03-15",
    reviewBody: "Amazing tool! Picked my Instagram giveaway winner in under 30 seconds. The proof video is perfect for showing my followers it was fair.",
    ratingValue: 5,
  },
  {
    author: "Mike D.",
    datePublished: "2024-02-28",
    reviewBody: "Finally a tool that detects fake accounts! My giveaways are so much fairer now. 100% recommend.",
    ratingValue: 5,
  },
  {
    author: "Jessica K.",
    datePublished: "2024-04-10",
    reviewBody: "Used it for my giveaway with 5000+ comments. Fast, reliable, and free. What more could you ask for?",
    ratingValue: 5,
  },
];

// Hreflang alternates
const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-au-sort-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/instagram-giveaway-picker/' },
  { lang: 'es', url: 'https://cleack.io/es/sorteo-instagram/' },
  { lang: 'x-default', url: 'https://cleack.io/en/instagram-giveaway-picker/' },
];

const InstagramGiveawayPickerPage = () => {
  return (
    <>
      <SEOHead
        title="Free Instagram Giveaway Picker - Pick Random Winner | Cleack"
        description="Pick a random Instagram giveaway winner in 30 seconds. Free comment picker with proof video, bot detection, and advanced filters. Trusted by 50,000+ creators worldwide."
        keywords="instagram giveaway picker, instagram winner picker, random comment picker instagram, instagram contest picker, giveaway picker, comment picker instagram, free instagram giveaway picker"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-instagram-giveaway-picker.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="How to Pick an Instagram Giveaway Winner"
        howToDescription="Step-by-step guide to randomly select a winner for your Instagram giveaway with Cleack"
        howToTotalTime="PT2M"
        includeSoftwareSchema
        softwareRating={4.8}
        softwareRatingCount={2847}
        softwareFeatures={softwareFeatures}
        reviews={reviews}
      />

      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Instagram className="w-4 h-4" />
                  #1 Giveaway Picker Tool
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Instagram Giveaway Picker{' '}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Free
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Pick a <strong>random winner</strong> for your Instagram giveaways in 30 seconds. 
                  Comments, likes, stories or Reels — Cleack handles it all with{' '}
                  <strong>certified proof video</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Pick a Winner Free
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-pink-300 hover:text-pink-600 transition-all"
                  >
                    How It Works
                  </a>
                </div>

                {/* Trust badges */}
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
                    <span>50,000+ Users</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Tool Preview / CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-pink-500/10 p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Instagram className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Instagram Giveaway Picker</h2>
                    <p className="text-gray-500 mt-2">Paste your link and pick a winner</p>
                  </div>

                  {/* Simulated input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="https://www.instagram.com/p/..."
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        readOnly
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Instagram className="w-5 h-5" />
                      </span>
                    </div>

                    <Link
                      to="/draw/new"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Pick Winner Free
                    </Link>
                  </div>

                  {/* Stats */}
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

        {/* Main Content with TOC */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} sticky />
            </aside>

            {/* Main Content */}
            <main className="min-w-0">
              {/* Intro paragraph for SEO */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Running an <strong>Instagram giveaway</strong> and looking for a simple, fast, and reliable way 
                  to <strong>pick a random winner</strong> from your participants? Cleack is the #1 free Instagram 
                  giveaway picker, trusted by over 50,000 content creators, influencers, and brands worldwide to 
                  select winners fairly and transparently.
                </p>
                <p className="text-gray-600">
                  Whether you want to pick a winner from Instagram comments, likes, story replies, or Reels comments, 
                  Cleack handles all formats. Our tool automatically generates a <strong>proof video</strong> that 
                  you can share on your story to show your community that the draw was 100% random and fair.
                </p>
              </div>

              {/* Section: How It Works */}
              <section id="how-it-works" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  How to Pick an Instagram Giveaway Winner
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Picking an Instagram giveaway winner has never been easier. In just 4 steps and under 30 seconds, 
                  you can select a winner from thousands of participants. Here's how:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      step: 1,
                      title: "Copy your Instagram post link",
                      description: "Go to your Instagram post (photo, carousel or Reel), tap the three dots (...) and select 'Copy Link'. You can also copy the URL directly from your browser on desktop.",
                      icon: <Instagram className="w-6 h-6" />,
                    },
                    {
                      step: 2,
                      title: "Paste the link into Cleack",
                      description: "Head to Cleack and paste the URL into the field. Our tool automatically analyzes your post and fetches all comments in seconds, even if there are thousands.",
                      icon: <Zap className="w-6 h-6" />,
                    },
                    {
                      step: 3,
                      title: "Configure your filters",
                      description: "Set how many winners you want to select. Enable optional filters: required mentions (@friend), required hashtags, duplicate exclusion, bot and fake account detection.",
                      icon: <Filter className="w-6 h-6" />,
                    },
                    {
                      step: 4,
                      title: "Pick winner and share",
                      description: "Click 'Pick Winner'. Cleack randomly selects the winner(s) and generates a proof video you can download and share on Instagram to prove transparency.",
                      icon: <Trophy className="w-6 h-6" />,
                    },
                  ].map((item) => (
                    <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
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

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <Clock className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Total time: under 30 seconds</h4>
                      <p className="text-gray-600 text-sm">
                        Unlike manual methods that take hours, Cleack automates the entire process. 
                        You save precious time that you can spend on your content and community.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Features */}
              <section id="features" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Cleack for Your Instagram Giveaways?
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Cleack isn't just a random number generator. It's a professional tool built specifically 
                  for social media giveaways, with exclusive features you won't find anywhere else.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Certified Proof Video",
                      description: "Cleack is the only tool that automatically generates a video of the draw. Share it on Instagram Stories to prove to your followers the pick was fair and transparent.",
                      highlight: true,
                    },
                    {
                      icon: <Bot className="w-6 h-6" />,
                      title: "Fake Account Detection",
                      description: "Our AI algorithm identifies and automatically excludes bots, suspicious accounts, and fraudulent entries to guarantee a 100% fair giveaway.",
                      highlight: true,
                    },
                    {
                      icon: <Zap className="w-6 h-6" />,
                      title: "Fast & No Login Required",
                      description: "No account needed for simple draws. Paste your Instagram link and get a winner in under 30 seconds. No Instagram login required either.",
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: "Secure & GDPR Compliant",
                      description: "Your data and participants' data are never stored. Cleack is 100% compliant with GDPR and privacy regulations.",
                    },
                    {
                      icon: <Filter className="w-6 h-6" />,
                      title: "Advanced Filters",
                      description: "Customize your draw with powerful filters: required mentions, required hashtags, minimum word count, exclude private accounts, and more.",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Multiple Winners",
                      description: "Select multiple winners in a single draw. Perfect for giveaways with multiple prizes or when you need backup winners.",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-xl p-6 border ${
                        feature.highlight ? 'border-pink-200 ring-2 ring-pink-100' : 'border-gray-100'
                      } hover:shadow-lg transition-shadow`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        feature.highlight 
                          ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                      {feature.highlight && (
                        <span className="inline-block mt-3 text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded">
                          Cleack Exclusive
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Giveaway Types */}
              <section id="giveaway-types" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Supported Instagram Giveaway Types
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Cleack adapts to all Instagram content formats. Whether you're running a giveaway on a regular 
                  post, viral Reel, or even Stories, our tool fetches and analyzes all participants.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      title: "Instagram Comment Picker",
                      description: "The most popular format. Pick a random winner from everyone who commented on your post. Perfect for 'comment to enter' or 'tag a friend to enter' giveaways.",
                      link: "/en/instagram-comment-picker/",
                      stats: "Most popular",
                    },
                    {
                      icon: <Heart className="w-6 h-6" />,
                      title: "Instagram Likes Picker",
                      description: "Reward silent engagement! Pick a winner from people who liked your post. Ideal for quick contests where you want to maximize participation with minimal effort.",
                      link: "/en/instagram-likes-picker/",
                      stats: "Easy engagement",
                    },
                    {
                      icon: <Play className="w-6 h-6" />,
                      title: "Instagram Story Picker",
                      description: "Analyze story replies or account mentions. Perfect for interactive contests like quizzes, polls, or 'share this story to enter' giveaways.",
                      link: "/en/instagram-story-picker/",
                      stats: "Interactive",
                    },
                    {
                      icon: <Video className="w-6 h-6" />,
                      title: "Instagram Reels Picker",
                      description: "Reels often generate thousands of comments. Cleack analyzes all Reels comments, even on viral posts, and picks a winner completely randomly.",
                      link: "/en/instagram-reels-picker/",
                      stats: "High virality",
                    },
                  ].map((type, index) => (
                    <Link
                      key={index}
                      to={type.link}
                      className="block bg-white rounded-xl p-6 border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center text-pink-600 flex-shrink-0 group-hover:from-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                              {type.title}
                            </h3>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {type.stats}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                          <span className="inline-flex items-center gap-1 text-pink-600 text-sm font-medium group-hover:gap-2 transition-all">
                            Learn more <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section: Why Cleack */}
              <section id="why-cleack" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Cleack vs. Competitors: Full Comparison
                </h2>
                
                <p className="text-gray-600 mb-8">
                  There are several Instagram giveaway picker tools on the market. Here's why Cleack stands 
                  out and why over 50,000 creators trust us.
                </p>

                <div className="overflow-x-auto mb-8">
                  <table className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        <th className="px-6 py-4 text-left font-semibold">Feature</th>
                        <th className="px-6 py-4 text-center font-semibold">Cleack</th>
                        <th className="px-6 py-4 text-center font-semibold">Wask</th>
                        <th className="px-6 py-4 text-center font-semibold">Easypromos</th>
                        <th className="px-6 py-4 text-center font-semibold">Comment Picker</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { feature: "Free to use", cleack: true, wask: "Limited", easypromos: "Limited", commentPicker: true },
                        { feature: "Proof video", cleack: true, wask: false, easypromos: false, commentPicker: false },
                        { feature: "Bot detection", cleack: true, wask: false, easypromos: false, commentPicker: false },
                        { feature: "No login required", cleack: true, wask: false, easypromos: false, commentPicker: true },
                        { feature: "Reels support", cleack: true, wask: true, easypromos: true, commentPicker: false },
                        { feature: "Stories support", cleack: true, wask: false, easypromos: false, commentPicker: false },
                        { feature: "Multiple winners", cleack: true, wask: true, easypromos: true, commentPicker: false },
                        { feature: "Advanced filters", cleack: true, wask: "Basic", easypromos: "Basic", commentPicker: false },
                        { feature: "CSV export", cleack: true, wask: "Premium", easypromos: "Premium", commentPicker: false },
                        { feature: "API available", cleack: true, wask: false, easypromos: false, commentPicker: false },
                      ].map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-3 font-medium text-gray-900">{row.feature}</td>
                          <td className="px-6 py-3 text-center">
                            {row.cleack === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.cleack === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.cleack}</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {row.wask === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.wask === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.wask}</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {row.easypromos === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.easypromos === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.easypromos}</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {row.commentPicker === true ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : row.commentPicker === false ? (
                              <span className="text-red-500">✕</span>
                            ) : (
                              <span className="text-gray-500 text-sm">{row.commentPicker}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Cleack: The Professional Choice</h4>
                      <p className="text-gray-600 text-sm">
                        With proof video, bot detection, and advanced filters, Cleack is the most complete 
                        and reliable tool on the market. That's why top influencers and brands use it 
                        for their Instagram giveaways.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Tutorial */}
              <section id="tutorial" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Complete Guide: Running an Instagram Giveaway
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Beyond just picking a winner, here's a complete guide to running a successful Instagram 
                  giveaway from creating your post to announcing the winner.
                </p>

                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      Define Your Giveaway Rules
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        Before posting, clearly define participation rules. Common requirements include:
                      </p>
                      <ul>
                        <li><strong>Like the post</strong> - Basic requirement to show interest</li>
                        <li><strong>Leave a comment</strong> - Increases engagement and visibility</li>
                        <li><strong>Tag friends</strong> - Each tag = one entry, great for virality</li>
                        <li><strong>Follow your account</strong> - Gain quality followers</li>
                        <li><strong>Share to story</strong> - Maximize reach</li>
                      </ul>
                      <p>
                        <strong>Pro tip:</strong> Don't overload requirements. "Like + comment + tag 2 friends" 
                        is the optimal format to maximize participation while keeping rules simple.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      Create Official Rules
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        For legal compliance, every giveaway should have official rules that include:
                      </p>
                      <ul>
                        <li>Organizer name and contact info</li>
                        <li>Start and end dates</li>
                        <li>Entry requirements</li>
                        <li>Prize description and value</li>
                        <li>How winners will be selected</li>
                        <li>How and when winners will be notified</li>
                      </ul>
                      <p>
                        Use our <Link to="/en/tools/rules-generator/" className="text-pink-600 hover:underline">free rules generator</Link> to 
                        create compliant rules in 2 minutes.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      Create an Eye-Catching Visual
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        A great giveaway visual should be instantly recognizable and make people want to enter:
                      </p>
                      <ul>
                        <li><strong>Feature the prize</strong> with a beautiful photo</li>
                        <li>Use <strong>bright, attention-grabbing colors</strong></li>
                        <li>Add clear text: <strong>"GIVEAWAY"</strong> or <strong>"WIN"</strong></li>
                        <li>Include <strong>main entry requirements</strong> on the image</li>
                        <li>Show the <strong>end date</strong> to create urgency</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                      Promote Your Giveaway
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        A giveaway isn't just a single post. To maximize entries:
                      </p>
                      <ul>
                        <li><strong>Share to Stories</strong> multiple times during the giveaway</li>
                        <li>Create a <strong>Reel showcasing the prize</strong></li>
                        <li><strong>Collaborate with other creators</strong> to expand reach</li>
                        <li>Schedule <strong>reminder posts</strong> before the deadline</li>
                        <li>Reply to comments to <strong>boost the algorithm</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">5</span>
                      Pick the Winner with Cleack
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        Once the giveaway ends, head to Cleack to pick your winner:
                      </p>
                      <ol>
                        <li>Copy your Instagram post link</li>
                        <li>Paste it into Cleack</li>
                        <li>Configure filters if needed (required tags, etc.)</li>
                        <li>Click "Pick Winner"</li>
                        <li>Download the proof video</li>
                      </ol>
                    </div>
                    <Link
                      to="/draw/new"
                      className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      Pick My Winner Now
                    </Link>
                  </div>

                  {/* Step 6 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">6</span>
                      Announce the Winner Publicly
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p>
                        Announcing the winner is just as important as the giveaway itself:
                      </p>
                      <ul>
                        <li><strong>Share the Cleack proof video</strong> in your Story</li>
                        <li><strong>Comment on your post</strong> with the winner's name</li>
                        <li>Send a <strong>DM</strong> to the winner</li>
                        <li>Ask the winner to <strong>share when they receive the prize</strong></li>
                        <li>Keep <strong>backup winners</strong> if the first doesn't respond</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Tips */}
              <section id="tips" className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Expert Tips for Successful Instagram Giveaways
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      icon: <Gift className="w-6 h-6" />,
                      title: "Choose a Relevant Prize",
                      description: "The prize should match your audience and niche. Tech prize for tech audience, beauty product for beauty audience. Avoid generic prizes like cash that attract non-targeted participants.",
                    },
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: "Optimal Duration: 5-7 Days",
                      description: "Too short and not everyone can enter. Too long and you lose urgency. 5-7 days is the sweet spot for maximizing participation while maintaining excitement.",
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: "Limit Required Tags",
                      description: "Asking to tag 2-3 friends is optimal. Beyond that, you discourage participation. Each additional required tag reduces participation by about 20%.",
                    },
                    {
                      icon: <BookOpen className="w-6 h-6" />,
                      title: "Reply to Comments",
                      description: "Comments on your giveaway post boost Instagram's algorithm. Take time to reply to questions and thank participants. This increases your post's visibility.",
                    },
                    {
                      icon: <Download className="w-6 h-6" />,
                      title: "Archive Everything",
                      description: "Screenshot the post, comments, and draw. Keep the Cleack proof video. If there's any dispute, you'll have all the evidence you need.",
                    },
                    {
                      icon: <Share2 className="w-6 h-6" />,
                      title: "Create Recurring Giveaways",
                      description: "Regular giveaways build loyalty. A monthly giveaway creates anticipation and habit among your followers. They'll naturally check back for new contests.",
                    },
                  ].map((tip, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-4">
                        {tip.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  ))}
                </div>

                {/* Mistakes to Avoid */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">❌ Mistakes to Avoid</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "No official rules or terms",
                      "Too many entry requirements",
                      "Forgetting to mention dates",
                      "Not announcing winner publicly",
                      "Using unreliable or manual methods",
                      "Ignoring participant comments",
                      "Prize unrelated to your audience",
                      "No backup winners planned",
                    ].map((mistake, index) => (
                      <div key={index} className="flex items-start gap-2 text-red-700">
                        <span className="text-red-500 mt-1">✕</span>
                        <span className="text-sm">{mistake}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section: FAQ */}
              <section id="faq" className="mb-16">
                <FAQSection
                  items={faqItems}
                  title="Frequently Asked Questions"
                  subtitle="Everything you need to know about running Instagram giveaways"
                />
              </section>

              {/* Internal Links */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Helpful Resources</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Guide: How to Run an Instagram Giveaway", url: "/en/guides/instagram-giveaway-guide/", icon: <BookOpen className="w-5 h-5" /> },
                    { title: "Giveaway Rules Template", url: "/en/guides/giveaway-rules-template/", icon: <Shield className="w-5 h-5" /> },
                    { title: "Instagram Giveaway Ideas", url: "/en/blog/instagram-giveaway-ideas/", icon: <Gift className="w-5 h-5" /> },
                    { title: "Best Giveaway Picker Tools", url: "/en/guides/best-giveaway-tools/", icon: <Trophy className="w-5 h-5" /> },
                  ].map((resource, index) => (
                    <Link
                      key={index}
                      to={resource.url}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group"
                    >
                      <div className="p-2 bg-pink-50 rounded-lg text-pink-600 group-hover:bg-pink-100">
                        {resource.icon}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-pink-600">{resource.title}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Platform Links */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Platforms</h2>
                <PlatformLinks currentPlatform="instagram" lang="en" />
              </section>

              {/* Final CTA */}
              <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 md:p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Pick Your Instagram Winner?</h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Join over 50,000 creators who trust Cleack for fair and transparent giveaways. 
                  Pick your first winner free in under 30 seconds.
                </p>
                <Link
                  to="/draw/new"
                  className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-white/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Pick a Winner Free
                </Link>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstagramGiveawayPickerPage;
