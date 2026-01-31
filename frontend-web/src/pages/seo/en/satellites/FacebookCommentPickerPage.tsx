import { Link } from 'react-router-dom';
import { Facebook, Play, Sparkles, MessageCircle } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/facebook-comment-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Facebook Giveaway Picker', url: '/en/facebook-giveaway-picker/' },
  { name: 'Comment Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "How does Facebook comment picking work?", answer: "Paste your Facebook post URL, and Cleack fetches all comments for random winner selection." },
  { question: "Does it work with Facebook Pages?", answer: "Yes! Works with personal profiles, business Pages, and Groups." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-commentaires-facebook/' },
  { lang: 'en', url: 'https://cleack.io/en/facebook-comment-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/facebook-comment-picker/' },
];

const FacebookCommentPickerPage = () => (
  <>
    <SEOHead
      title="Facebook Comment Picker - Pick Random Comment Winner | Cleack"
      description="Pick a random winner from Facebook comments. Works with Pages and Groups. Free with proof video."
      keywords="facebook comment picker, random facebook comment, facebook comment winner, facebook giveaway comment"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" /> Comment Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Facebook Comment Picker</h1>
          <p className="text-xl text-ink-secondary mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>Facebook comments</strong>. Works with Pages, Groups, and personal profiles.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all">
            <Play className="w-5 h-5" /> Pick Facebook Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>Pick Facebook Comment Winners</h2>
            <p>Facebook comment giveaways are popular for business Pages and Groups. Cleack makes picking winners easy.</p>
          </div>
          <FAQSection items={faqItems} title="Facebook Comment Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="facebook" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your Facebook Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-bg-elevated text-accent-secondary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default FacebookCommentPickerPage;
