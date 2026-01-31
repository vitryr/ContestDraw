import { Link } from 'react-router-dom';
import { Play, Sparkles, MessageCircle } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const CANONICAL_URL = 'https://cleack.io/en/tiktok-comment-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'TikTok Giveaway Picker', url: '/en/tiktok-giveaway-picker/' },
  { name: 'Comment Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "How does TikTok comment picking work?", answer: "Paste your TikTok video URL, Cleack fetches all comments, and you pick a random winner." },
  { question: "Can it handle viral TikToks?", answer: "Yes! Cleack processes unlimited comments, even from videos with 100,000+ comments." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-commentaires-tiktok/' },
  { lang: 'en', url: 'https://cleack.io/en/tiktok-comment-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/tiktok-comment-picker/' },
];

const TiktokCommentPickerPage = () => (
  <>
    <SEOHead
      title="TikTok Comment Picker - Pick Random Comment Winner | Cleack"
      description="Pick a random winner from TikTok comments. Works with viral videos. Free with proof video."
      keywords="tiktok comment picker, random tiktok comment, tiktok comment winner, tiktok giveaway comment"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-bg-primary0 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" /> Comment Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">TikTok Comment Picker</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Pick winners from <strong className="text-white">TikTok comments</strong>. Handle viral videos with thousands of comments.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-bg-primary0 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
            <Play className="w-5 h-5" /> Pick TikTok Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>Pick TikTok Comment Winners</h2>
            <p>TikTok videos can go viral quickly, generating thousands of comments. Cleack handles any volume.</p>
          </div>
          <FAQSection items={faqItems} title="TikTok Comment Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="tiktok" /></div>
        </div>
      </section>
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your TikTok Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-bg-elevated text-accent-primary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default TiktokCommentPickerPage;
