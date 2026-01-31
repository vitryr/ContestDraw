import { Link } from 'react-router-dom';
import { Youtube, Play, Sparkles, MessageCircle } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/youtube-random-comment-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'YouTube Comment Picker', url: '/en/youtube-comment-picker/' },
  { name: 'Random Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "How random is the selection?", answer: "Cleack uses cryptographically secure random selection, ensuring complete fairness." },
  { question: "Can I see all comments before picking?", answer: "Yes! View the full list of comments and filter before selection." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-commentaires-youtube/' },
  { lang: 'en', url: 'https://cleack.io/en/youtube-random-comment-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/youtube-random-comment-picker/' },
];

const YoutubeRandomCommentPickerPage = () => (
  <>
    <SEOHead
      title="YouTube Random Comment Picker - Pick Random Winner | Cleack"
      description="Pick a truly random winner from YouTube comments. Cryptographically secure selection with proof video."
      keywords="youtube random comment picker, random youtube comment, youtube random winner, pick random youtube comment"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-bg-primary via-bg-elevated to-bg-primary">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" /> Random Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">YouTube Random Comment Picker</h1>
          <p className="text-xl text-ink-secondary mb-8 max-w-2xl mx-auto">
            <strong>Truly random</strong> YouTube comment selection. Cryptographically secure with proof video.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-all">
            <Play className="w-5 h-5" /> Pick Random Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>Fair Random Selection</h2>
            <p>Our random selection is cryptographically secure, ensuring every comment has an equal chance.</p>
          </div>
          <FAQSection items={faqItems} title="Random Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="youtube" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your YouTube Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-bg-elevated text-red-400 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default YoutubeRandomCommentPickerPage;
