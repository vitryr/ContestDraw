import { Link } from 'react-router-dom';
import { Instagram, Play, Sparkles, Video } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/instagram-reels-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Instagram Giveaway Picker', url: '/en/instagram-giveaway-picker/' },
  { name: 'Reels Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Can I pick from Reels comments?", answer: "Yes! Paste your Reels URL and Cleack fetches all comments for random selection." },
  { question: "Do Reels giveaways work the same as regular posts?", answer: "Exactly the same! The process is identical - paste URL, set filters, pick winner." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-reels-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/instagram-reels-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/instagram-reels-picker/' },
];

const InstagramReelsPickerPage = () => (
  <>
    <SEOHead
      title="Instagram Reels Picker - Pick Winner from Reels Comments | Cleack"
      description="Pick a random winner from Instagram Reels comments. Perfect for viral Reels giveaways with proof video."
      keywords="instagram reels picker, reels comment picker, instagram reels giveaway, reels contest winner"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Video className="w-4 h-4" /> Reels Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Instagram Reels Picker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>Instagram Reels comments</strong>. Reels often go viral - handle thousands of comments easily.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
            <Play className="w-5 h-5" /> Pick Reels Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>Why Run Giveaways on Reels?</h2>
            <p>Reels have the highest organic reach on Instagram. A giveaway Reel can:</p>
            <ul>
              <li>Reach millions of people organically</li>
              <li>Generate thousands of comments quickly</li>
              <li>Go viral and massively boost engagement</li>
            </ul>
            <p>Cleack handles Reels with any number of comments - even 100,000+.</p>
          </div>
          <FAQSection items={faqItems} title="Reels Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="instagram" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your Reels Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default InstagramReelsPickerPage;
