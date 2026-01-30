import { Link } from 'react-router-dom';
import { Trophy, Sparkles, CheckCircle2, X } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/guides/best-giveaway-tools/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: '/en/guides/' },
  { name: 'Best Tools', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "What's the best free giveaway picker?", answer: "Cleack offers the most features for free: proof video, bot detection, and unlimited comments." },
  { question: "Do I need to pay for a giveaway tool?", answer: "For basic giveaways, free tools like Cleack work great. Premium plans add advanced features." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/guide/meilleurs-outils-tirage/' },
  { lang: 'en', url: 'https://cleack.io/en/guides/best-giveaway-tools/' },
  { lang: 'x-default', url: 'https://cleack.io/en/guides/best-giveaway-tools/' },
];

const tools = [
  {
    name: 'Cleack',
    description: 'All-in-one giveaway picker with proof video and bot detection.',
    free: true,
    proofVideo: true,
    botDetection: true,
    multiPlatform: true,
    rating: 4.8,
    highlight: true,
  },
  {
    name: 'Comment Picker',
    description: 'Simple comment picker for Instagram.',
    free: true,
    proofVideo: false,
    botDetection: false,
    multiPlatform: false,
    rating: 4.2,
  },
  {
    name: 'Wask',
    description: 'Instagram giveaway tool with basic features.',
    free: 'Limited',
    proofVideo: false,
    botDetection: false,
    multiPlatform: true,
    rating: 4.0,
  },
  {
    name: 'Easypromos',
    description: 'Full-featured contest platform.',
    free: 'Limited',
    proofVideo: false,
    botDetection: false,
    multiPlatform: true,
    rating: 4.3,
  },
];

const BestGiveawayToolsPage = () => (
  <>
    <SEOHead
      title="Best Giveaway Picker Tools Compared 2025 | Cleack"
      description="Compare the best giveaway picker tools for Instagram, TikTok, YouTube and more. Free vs paid, features, and honest reviews."
      keywords="best giveaway picker, giveaway tool comparison, best comment picker, giveaway software review"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" /> Comparison
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Best Giveaway Picker Tools
            </h1>
            <p className="text-xl text-gray-600">
              Honest comparison of the top giveaway picker tools in 2025.
            </p>
          </div>

          <div className="overflow-x-auto mb-12">
            <table className="w-full bg-white rounded-xl border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold">Tool</th>
                  <th className="px-4 py-3 text-center font-semibold">Free</th>
                  <th className="px-4 py-3 text-center font-semibold">Proof Video</th>
                  <th className="px-4 py-3 text-center font-semibold">Bot Detection</th>
                  <th className="px-4 py-3 text-center font-semibold">Multi-Platform</th>
                  <th className="px-4 py-3 text-center font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tools.map((tool) => (
                  <tr key={tool.name} className={tool.highlight ? 'bg-emerald-50' : ''}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{tool.name}</div>
                      <div className="text-sm text-gray-500">{tool.description}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tool.free === true ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-500 text-sm">{tool.free}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tool.proofVideo ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tool.botDetection ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tool.multiPlatform ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">{tool.rating}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Our Verdict</h2>
            <p>
              <strong>Cleack</strong> is the clear winner for most users. It's the only tool that offers 
              proof video generation and bot detection for free. The multi-platform support means you can 
              use it for Instagram, TikTok, YouTube, Facebook, and Twitter giveaways.
            </p>

            <h2>What to Look For</h2>
            <ul>
              <li><strong>Proof video</strong> - Essential for transparency</li>
              <li><strong>Bot detection</strong> - Ensures fair draws</li>
              <li><strong>No login required</strong> - Privacy matters</li>
              <li><strong>Unlimited comments</strong> - Handle viral posts</li>
              <li><strong>Multiple winners</strong> - Select backup winners</li>
            </ul>
          </div>

          <div className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Try the #1 Giveaway Picker</h3>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>

          <div className="mt-12">
            <FAQSection items={faqItems} title="Tools FAQ" />
          </div>
        </div>
      </article>
    </div>
  </>
);

export default BestGiveawayToolsPage;
