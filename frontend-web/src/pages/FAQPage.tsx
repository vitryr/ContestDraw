import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Twitter,
  Shield,
  CreditCard,
  HelpCircle,
  FileText,
  Globe,
} from "lucide-react";
import Layout from "../components/Layout";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: "general-1",
    question: "What is ContestDraw and how does it work?",
    answer:
      "ContestDraw is an automated platform for running fair and transparent social media giveaways. Simply paste your Instagram, Facebook, TikTok, Twitter, or YouTube post URL, configure filters to exclude bots and fake accounts, and run a cryptographically secure random draw in under 2 minutes. You get a Story-format video and PDF certificate with SHA-256 hash as proof.",
    category: "general",
  },
  {
    id: "general-2",
    question: "Why should I use ContestDraw instead of manual drawing?",
    answer:
      "Manual drawing takes hours, is prone to errors, and lacks transparency. ContestDraw saves you 95% of the time, automatically filters out bots and fake accounts, provides cryptographic proof of fairness, and ensures GDPR compliance. Your audience trusts the results because they're verifiable.",
    category: "general",
  },
  {
    id: "general-3",
    question: "How long does it take to run a draw?",
    answer:
      "A complete draw takes 2-3 minutes: 30 seconds to connect your account, 10-60 seconds to fetch participants (depending on volume), 1-2 minutes to configure filters (optional), and 5 seconds for the actual draw. Much faster than hours of manual work!",
    category: "general",
  },

  // Instagram Specific
  {
    id: "instagram-1",
    question: "Do I need an Instagram Pro account?",
    answer:
      "Yes, you need an Instagram Business or Creator account (both called \"Pro\" accounts). This is because Meta's API only works with professional accounts. Don't worry—it's completely free to upgrade in your Instagram settings (Settings > Account > Switch to Professional Account).",
    category: "instagram",
  },
  {
    id: "instagram-2",
    question: "Why can't ContestDraw access my Instagram account?",
    answer:
      "Common reasons: 1) Your account is not a Pro account (Business/Creator). 2) You didn't grant all required permissions during OAuth. 3) Instagram is experiencing API issues. 4) Your account was recently converted to Pro (wait 24-48h). Solution: Disconnect and reconnect your account, ensuring you're using a Pro account and granting all permissions.",
    category: "instagram",
  },
  {
    id: "instagram-3",
    question: "Can ContestDraw post on my behalf?",
    answer:
      "No, never. ContestDraw only has read-only access to your account. We can only: 1) Read comments on your posts, 2) Verify follower status, 3) Check engagement metrics. We cannot and will never: post, delete content, send DMs, or modify your account in any way.",
    category: "instagram",
  },
  {
    id: "instagram-4",
    question: "Does this work with Instagram Stories and Reels?",
    answer:
      "Yes! ContestDraw works with: 1) Feed posts (photos/videos), 2) Reels (short videos), 3) Story mentions (with Business account). For Stories, participants must mention your @username. The system automatically detects all mentions within the contest period.",
    category: "instagram",
  },
  {
    id: "instagram-5",
    question: "How many comments can ContestDraw handle?",
    answer:
      "ContestDraw can handle up to 50,000 comments per draw. Most giveaways have 100-5,000 comments. For extremely viral posts (>50K comments), contact our support team for enterprise solutions.",
    category: "instagram",
  },

  // Other Platforms
  {
    id: "platforms-1",
    question: "Which social media platforms are supported?",
    answer:
      "ContestDraw supports: Instagram (posts, reels, stories), Facebook (posts, comments), TikTok (video comments), Twitter/X (retweets, replies), and YouTube (video comments). More platforms coming soon!",
    category: "platforms",
  },
  {
    id: "platforms-2",
    question: "Can I run a giveaway across multiple platforms?",
    answer:
      "Yes! You can create separate draws for each platform or manually combine participant lists. A multi-platform draw feature (combined Instagram + TikTok + YouTube in one draw) is coming in Q2 2025.",
    category: "platforms",
  },
  {
    id: "platforms-3",
    question: "Do I need a Pro account for Facebook/TikTok/Twitter?",
    answer:
      "Facebook: Business Page recommended. TikTok: Creator or Business account. Twitter: Standard account works. YouTube: Standard account works. Only Instagram strictly requires a Pro account.",
    category: "platforms",
  },

  // Filters and Bot Detection
  {
    id: "filters-1",
    question: "How does bot detection work?",
    answer:
      "ContestDraw uses 7+ advanced filters: 1) Account age (exclude accounts <30 days old), 2) Follower ratio (identify fake/bot accounts), 3) Duplicate entries, 4) Generic spam comments, 5) Following verification, 6) Engagement history, 7) Custom blacklist. Our AI-powered system has a 95%+ accuracy rate.",
    category: "filters",
  },
  {
    id: "filters-2",
    question: "What filters should I use for my giveaway?",
    answer:
      "Recommended filters for most giveaways: 1) Remove duplicates (ON), 2) Must follow your account (ON), 3) Min account age: 30 days, 4) Max entries per person: 1-5. For high-value prizes (>€100), also enable: hashtag requirements, mention requirements, and blacklist known bot accounts.",
    category: "filters",
  },
  {
    id: "filters-3",
    question: "Can I manually exclude specific users?",
    answer:
      "Yes! You can add usernames to your custom blacklist before running the draw. Common uses: exclude yourself, your team, previous winners, or known spam accounts. You can also import CSV blacklists.",
    category: "filters",
  },
  {
    id: "filters-4",
    question: 'What are "required hashtags" and "required mentions"?',
    answer:
      'Required hashtags: Only count entries that include specific hashtags (e.g., #contest, #giveaway). Required mentions: Only count entries that tag X number of friends (e.g., "Tag 2 friends"). Example: Require #MyBrandContest + @friend1 @friend2 to qualify.',
    category: "filters",
  },

  // Pricing and Credits
  {
    id: "pricing-1",
    question: "How much does ContestDraw cost?",
    answer:
      "Flexible pricing: Pay-per-draw (1 credit = €2.49, or buy packs: 10 credits = €15), OR Unlimited subscriptions (€19.99/month for unlimited draws, €199/year with premium features, €49/month Enterprise for teams). Credits never expire.",
    category: "pricing",
  },
  {
    id: "pricing-2",
    question: "What's the difference between credits and subscriptions?",
    answer:
      "Credits: Pay once, use anytime (no expiration). Best for occasional giveaways (1-2/month). Subscriptions: Unlimited draws, better value for frequent use (3+ draws/month). Subscriptions also include priority support and premium features (white-label, API access).",
    category: "pricing",
  },
  {
    id: "pricing-3",
    question: "Do my credits expire?",
    answer:
      "No! Purchased credits never expire. Use them anytime, even years later. This is different from monthly subscription credits, which reset each billing cycle.",
    category: "pricing",
  },
  {
    id: "pricing-4",
    question: "Why are prices higher on iOS?",
    answer:
      "Apple charges a 30% commission on all App Store purchases. To maintain our business, iOS prices are approximately 30% higher than web prices. We recommend purchasing credits via our website (contestdraw.com) for the best price.",
    category: "pricing",
  },
  {
    id: "pricing-5",
    question: "Can I get a refund?",
    answer:
      "Yes! Refund policy: 1) Full refund if technical issues prevent draw execution, 2) Full refund for duplicate charges, 3) Pro-rated refund within 7 days of first subscription payment. No refunds for: successfully executed draws, user error, or dissatisfaction with results. Contact support@contestdraw.com for refund requests.",
    category: "pricing",
  },
  {
    id: "pricing-6",
    question: "Is there a free trial?",
    answer:
      "Yes! New users get 1 free credit to test the platform (no credit card required). You can also request a live demo with our team to see all features: https://contestdraw.com/demo",
    category: "pricing",
  },

  // GDPR and Legal
  {
    id: "legal-1",
    question: "Is ContestDraw GDPR compliant?",
    answer:
      "100% GDPR compliant. We ensure: 1) EU hosting (AWS Frankfurt, France), 2) Designated Data Protection Officer (DPO), 3) Encrypted data (SSL/TLS + AES-256), 4) Automatic data deletion (30 days for participants, 1 year for winners), 5) Full data export/deletion on request, 6) Standard Contractual Clauses (SCCs) for any non-EU processing.",
    category: "legal",
  },
  {
    id: "legal-2",
    question: "Where is my data stored?",
    answer:
      "All data is stored in the European Union (AWS Frankfurt region, Germany). We never transfer personal data to the US or other non-EU countries, ensuring full GDPR compliance. Backup servers are also in the EU (Paris, France).",
    category: "legal",
  },
  {
    id: "legal-3",
    question: "Do I need a contest rules document?",
    answer:
      "Yes! French and EU law requires a complete contest rules document (règlement de jeu-concours) with: organizer info, duration, prizes, GDPR mentions, and participant rights. ContestDraw provides a free rules generator: https://contestdraw.com/tools/rules-generator",
    category: "legal",
  },
  {
    id: "legal-4",
    question: "How long do you keep participant data?",
    answer:
      "Data retention periods: 1) Non-winning participants: 30 days after draw, then automatically deleted, 2) Winners: 1 year after prize delivery (legal requirement), 3) Draw certificates: 3 years (accounting requirement), 4) Anonymized analytics: indefinitely. You can request immediate deletion anytime.",
    category: "legal",
  },
  {
    id: "legal-5",
    question: "Can I use participant emails for marketing?",
    answer:
      "Only with explicit opt-in consent. You CANNOT automatically add giveaway participants to your email list—this violates GDPR. You must: 1) Include a separate opt-in checkbox (unchecked by default), 2) Clearly explain what they're subscribing to, 3) Provide easy unsubscribe. ContestDraw can help you collect consent during winner notification.",
    category: "legal",
  },

  // Technical
  {
    id: "technical-1",
    question: "How does the random selection algorithm work?",
    answer:
      "ContestDraw uses cryptographically secure random number generation (CSRNG) based on /dev/urandom and Web Crypto API. Each draw is seeded with: current timestamp, participant count, and a random salt. The SHA-256 hash of the draw is included in the certificate for independent verification.",
    category: "technical",
  },
  {
    id: "technical-2",
    question: "What is the SHA-256 hash certificate?",
    answer:
      "The SHA-256 hash is a cryptographic fingerprint of your draw. It proves that the draw wasn't tampered with. The certificate includes: draw date/time, participant count, filter settings, winner selection, and the hash. Anyone can verify the draw's authenticity using this certificate.",
    category: "technical",
  },
  {
    id: "technical-3",
    question: "Can I download the draw video?",
    answer:
      "Yes! After each draw, you get a 9:16 Story-format MP4 video showing the random selection animation. Perfect for Instagram/TikTok Stories. Videos are stored for 30 days and can be downloaded anytime during this period.",
    category: "technical",
  },
  {
    id: "technical-4",
    question: "What happens if Instagram is down during my draw?",
    answer:
      "If Instagram's API is down, ContestDraw will: 1) Notify you immediately, 2) Retry automatically (up to 3 times), 3) If still failing after 30 minutes, you can either wait or request a manual CSV import (contact support). No credits are charged for failed draws.",
    category: "technical",
  },

  // Support
  {
    id: "support-1",
    question: "How can I contact support?",
    answer:
      "Multiple support channels: 1) Live chat (bottom-right corner, 24/7 for Pro users), 2) Email: support@contestdraw.com (response within 24h), 3) Help center: docs.contestdraw.com, 4) Community forum: community.contestdraw.com. Premium users get priority support (response within 2 hours).",
    category: "support",
  },
  {
    id: "support-2",
    question: "Is support available in my language?",
    answer:
      "Yes! ContestDraw support is available in: French, English, Spanish, German, and Italian. The platform interface is available in French and English, with more languages coming in 2025.",
    category: "support",
  },

  // Features
  {
    id: "features-1",
    question: "Can I select multiple winners?",
    answer:
      "Yes! You can select up to 100 winners per draw. ContestDraw also automatically selects alternates (backup winners) in case your primary winners don't respond. Example: select 3 winners + 3 alternates.",
    category: "features",
  },
  {
    id: "features-2",
    question: "What if a winner doesn't respond?",
    answer:
      "ContestDraw automatically selects alternates. If your winner doesn't respond within your specified timeframe (e.g., 48 hours), you can mark them as non-responsive and draw from your alternate list. The certificate updates automatically.",
    category: "features",
  },
  {
    id: "features-3",
    question: "Can I export participant data?",
    answer:
      "Yes! You can export: 1) Participant list (CSV/Excel), 2) Draw certificate (PDF), 3) Draw video (MP4), 4) Full draw history (JSON). Exports comply with GDPR—participant data is anonymized after 30 days.",
    category: "features",
  },
  {
    id: "features-4",
    question: "Can I schedule a draw for later?",
    answer:
      "Yes! The scheduled draws feature allows you to: 1) Set a future date/time for automatic execution, 2) Configure all settings in advance, 3) Receive an email notification when complete. Available on Pro and Enterprise plans.",
    category: "features",
  },
];

const categories = [
  { id: "all", name: "All Questions", icon: HelpCircle },
  { id: "general", name: "General", icon: HelpCircle },
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "platforms", name: "Other Platforms", icon: Globe },
  { id: "filters", name: "Filters & Bots", icon: Shield },
  { id: "pricing", name: "Pricing", icon: CreditCard },
  { id: "legal", name: "Legal & GDPR", icon: FileText },
  { id: "technical", name: "Technical", icon: HelpCircle },
  { id: "features", name: "Features", icon: HelpCircle },
  { id: "support", name: "Support", icon: HelpCircle },
];

const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to know about ContestDraw
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none transition-colors"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={24}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                  }`}
                >
                  <Icon size={18} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No results found for "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFAQs.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-4">
                      {item.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp
                        className="flex-shrink-0 text-blue-600"
                        size={24}
                      />
                    ) : (
                      <ChevronDown
                        className="flex-shrink-0 text-gray-400"
                        size={24}
                      />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions? */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg mb-6 opacity-90">
              Our support team is here to help 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:support@contestdraw.com"
                className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Email Support
              </a>
              <a
                href="/demo"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>

        {/* Popular Resources */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Resources
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/docs/user-guide/getting-started"
              className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h4 className="font-bold text-gray-900 mb-2">
                Getting Started Guide
              </h4>
              <p className="text-gray-600 text-sm">
                Step-by-step tutorial for your first giveaway
              </p>
            </a>
            <a
              href="/docs/user-guide/filters-guide"
              className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h4 className="font-bold text-gray-900 mb-2">Advanced Filters</h4>
              <p className="text-gray-600 text-sm">
                Learn how to filter bots and fake accounts
              </p>
            </a>
            <a
              href="/docs/legal/privacy-policy"
              className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h4 className="font-bold text-gray-900 mb-2">GDPR Compliance</h4>
              <p className="text-gray-600 text-sm">
                Understand our data protection practices
              </p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
