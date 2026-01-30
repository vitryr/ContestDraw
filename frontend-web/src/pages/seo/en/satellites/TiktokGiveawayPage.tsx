import { Link } from 'react-router-dom';
import { Play, Sparkles, Gift } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/tiktok-giveaway/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'TikTok Giveaway Picker', url: '/en/tiktok-giveaway-picker/' },
  { name: 'TikTok Giveaway', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "How do I run a TikTok giveaway?", answer: "Post a video announcing your giveaway, collect comments, then use Cleack to pick a random winner." },
  { question: "What are the best TikTok giveaway formats?", answer: "'Comment to win', 'Follow + comment', and challenge-based giveaways work best on TikTok." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/giveaway-tiktok/' },
  { lang: 'en', url: 'https://cleack.io/en/tiktok-giveaway/' },
  { lang: 'x-default', url: 'https://cleack.io/en/tiktok-giveaway/' },
];

const TiktokGiveawayPage = () => (
  <>
    <SEOHead
      title="TikTok Giveaway Guide - How to Run TikTok Contests | Cleack"
      description="Learn how to run successful TikTok giveaways. Pick random winners from comments with proof video."
      keywords="tiktok giveaway, tiktok contest, how to run tiktok giveaway, tiktok giveaway picker"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gift className="w-4 h-4" /> TikTok Giveaway
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">TikTok Giveaway</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Run <strong className="text-white">TikTok giveaways</strong> that go viral. Pick fair winners with Cleack.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
            <Play className="w-5 h-5" /> Pick TikTok Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>How to Run a TikTok Giveaway</h2>
            <ol>
              <li>Create an engaging video announcing your giveaway</li>
              <li>Set clear rules (comment, follow, etc.)</li>
              <li>Use trending sounds to boost visibility</li>
              <li>When the giveaway ends, use Cleack to pick a winner</li>
              <li>Post a video announcing the winner with the proof video</li>
            </ol>
          </div>
          <FAQSection items={faqItems} title="TikTok Giveaway FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="tiktok" /></div>
        </div>
      </section>
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Start Your TikTok Giveaway</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default TiktokGiveawayPage;
