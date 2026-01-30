import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Shield,
  CreditCard,
  HelpCircle,
  FileText,
  Globe,
  Sparkles,
  Mail,
} from "lucide-react";

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
    question: "What is Cleack and how does it work?",
    answer:
      "Cleack is an automated platform for running fair and transparent social media giveaways. Simply paste your Instagram, Facebook, TikTok, Twitter, or YouTube post URL, configure filters to exclude bots and fake accounts, and run a cryptographically secure random draw in under 2 minutes. You get a Story-format video and PDF certificate with SHA-256 hash as proof.",
    category: "general",
  },
  {
    id: "general-2",
    question: "Why should I use Cleack instead of manual drawing?",
    answer:
      "Manual drawing takes hours, is prone to errors, and lacks transparency. Cleack saves you 95% of the time, automatically filters out bots and fake accounts, provides cryptographic proof of fairness, and ensures GDPR compliance. Your audience trusts the results because they're verifiable.",
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
    question: "Why can't Cleack access my Instagram account?",
    answer:
      "Common reasons: 1) Your account is not a Pro account (Business/Creator). 2) You didn't grant all required permissions during OAuth. 3) Instagram is experiencing API issues. 4) Your account was recently converted to Pro (wait 24-48h). Solution: Disconnect and reconnect your account, ensuring you're using a Pro account and granting all permissions.",
    category: "instagram",
  },
  {
    id: "instagram-3",
    question: "Can Cleack post on my behalf?",
    answer:
      "No, never. Cleack only has read-only access to your account. We can only: 1) Read comments on your posts, 2) Verify follower status, 3) Check engagement metrics. We cannot and will never: post, delete content, send DMs, or modify your account in any way.",
    category: "instagram",
  },
  // Other Platforms
  {
    id: "platforms-1",
    question: "Which social media platforms are supported?",
    answer:
      "Cleack supports: Instagram (posts, reels, stories), Facebook (posts, comments), TikTok (video comments), Twitter/X (retweets, replies), and YouTube (video comments). More platforms coming soon!",
    category: "platforms",
  },
  // Filters
  {
    id: "filters-1",
    question: "How does bot detection work?",
    answer:
      "Cleack uses 7+ advanced filters: 1) Account age (exclude accounts <30 days old), 2) Follower ratio (identify fake/bot accounts), 3) Duplicate entries, 4) Generic spam comments, 5) Following verification, 6) Engagement history, 7) Custom blacklist. Our AI-powered system has a 95%+ accuracy rate.",
    category: "filters",
  },
  {
    id: "filters-2",
    question: "What filters should I use for my giveaway?",
    answer:
      "Recommended filters for most giveaways: 1) Remove duplicates (ON), 2) Must follow your account (ON), 3) Min account age: 30 days, 4) Max entries per person: 1-5. For high-value prizes (>€100), also enable: hashtag requirements, mention requirements, and blacklist known bot accounts.",
    category: "filters",
  },
  // Pricing
  {
    id: "pricing-1",
    question: "How much does Cleack cost?",
    answer:
      "Flexible pricing: Pay-per-draw (1 credit = €2.49, or buy packs: 10 credits = €15), OR Unlimited subscriptions (€19.99/month for unlimited draws, €199/year with premium features, €49/month Enterprise for teams). Credits never expire.",
    category: "pricing",
  },
  {
    id: "pricing-2",
    question: "Do my credits expire?",
    answer:
      "No! Purchased credits never expire. Use them anytime, even years later. This is different from monthly subscription credits, which reset each billing cycle.",
    category: "pricing",
  },
  {
    id: "pricing-3",
    question: "Is there a free trial?",
    answer:
      "Yes! New users get 1 free credit to test the platform (no credit card required). You can also request a live demo with our team.",
    category: "pricing",
  },
  // Legal
  {
    id: "legal-1",
    question: "Is Cleack GDPR compliant?",
    answer:
      "100% GDPR compliant. We ensure: 1) EU hosting (AWS Frankfurt, France), 2) Designated Data Protection Officer (DPO), 3) Encrypted data (SSL/TLS + AES-256), 4) Automatic data deletion (30 days for participants, 1 year for winners), 5) Full data export/deletion on request.",
    category: "legal",
  },
  {
    id: "legal-2",
    question: "Where is my data stored?",
    answer:
      "All data is stored in the European Union (AWS Frankfurt region, Germany). We never transfer personal data to the US or other non-EU countries, ensuring full GDPR compliance. Backup servers are also in the EU (Paris, France).",
    category: "legal",
  },
  // Technical
  {
    id: "technical-1",
    question: "How does the random selection algorithm work?",
    answer:
      "Cleack uses cryptographically secure random number generation (CSRNG) based on /dev/urandom and Web Crypto API. Each draw is seeded with: current timestamp, participant count, and a random salt. The SHA-256 hash of the draw is included in the certificate for independent verification.",
    category: "technical",
  },
  // Features
  {
    id: "features-1",
    question: "Can I select multiple winners?",
    answer:
      "Yes! You can select up to 100 winners per draw. Cleack also automatically selects alternates (backup winners) in case your primary winners don't respond.",
    category: "features",
  },
  {
    id: "features-2",
    question: "Can I download the draw video?",
    answer:
      "Yes! After each draw, you get a 9:16 Story-format MP4 video showing the random selection animation. Perfect for Instagram/TikTok Stories. Videos are stored for 30 days.",
    category: "features",
  },
  // Support
  {
    id: "support-1",
    question: "How can I contact support?",
    answer:
      "Multiple support channels: 1) Email: support@cleack.io (response within 24h), 2) Help center: docs.cleack.io. Premium users get priority support (response within 2 hours).",
    category: "support",
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
  { id: "features", name: "Features", icon: Sparkles },
  { id: "support", name: "Support", icon: Mail },
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
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 50, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-secondary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0, 50, 0],
            y: [0, 30, -50, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-accent-primary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary mb-6">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-ink-secondary mb-8">
              Everything you need to know about Cleack
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 text-lg bg-bg-card border border-white/10 rounded-xl text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none transition-all"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink-muted"
                size={24}
              />
            </div>
          </motion.div>
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
                      ? "bg-gradient-to-r from-accent-secondary to-accent-primary text-white shadow-lg scale-105"
                      : "bg-bg-card text-ink-secondary hover:bg-bg-elevated border border-white/[0.06]"
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
              <p className="text-xl text-ink-muted">
                No results found for "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-accent-secondary hover:text-accent-tertiary font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFAQs.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-bg-elevated transition-colors"
                  >
                    <span className="text-lg font-semibold text-white pr-4">
                      {item.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp
                        className="flex-shrink-0 text-accent-secondary"
                        size={24}
                      />
                    ) : (
                      <ChevronDown
                        className="flex-shrink-0 text-ink-muted"
                        size={24}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-ink-secondary leading-relaxed border-t border-white/[0.06] pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Still Have Questions? */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

            <div className="relative z-10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
              <p className="text-lg text-white/80 mb-6">
                Our support team is here to help 24/7
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:support@cleack.io"
                  className="px-6 py-3 bg-white text-accent-secondary rounded-xl font-semibold hover:bg-white/90 transition-all"
                >
                  Email Support
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Resources */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Popular Resources
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/docs/user-guide/getting-started"
              className="block p-6 bg-bg-card border border-white/[0.06] rounded-xl hover:bg-bg-elevated transition-colors"
            >
              <h4 className="font-bold text-white mb-2">
                Getting Started Guide
              </h4>
              <p className="text-ink-secondary text-sm">
                Step-by-step tutorial for your first giveaway
              </p>
            </a>
            <a
              href="/docs/user-guide/filters-guide"
              className="block p-6 bg-bg-card border border-white/[0.06] rounded-xl hover:bg-bg-elevated transition-colors"
            >
              <h4 className="font-bold text-white mb-2">Advanced Filters</h4>
              <p className="text-ink-secondary text-sm">
                Learn how to filter bots and fake accounts
              </p>
            </a>
            <a
              href="/privacy"
              className="block p-6 bg-bg-card border border-white/[0.06] rounded-xl hover:bg-bg-elevated transition-colors"
            >
              <h4 className="font-bold text-white mb-2">GDPR Compliance</h4>
              <p className="text-ink-secondary text-sm">
                Understand our data protection practices
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
