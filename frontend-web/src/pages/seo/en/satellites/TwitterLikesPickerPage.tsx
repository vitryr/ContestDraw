import { Link } from 'react-router-dom';
import { Twitter, Play, Sparkles, Heart } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/twitter-likes-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Twitter Giveaway Picker', url: '/en/twitter-giveaway-picker/' },
  { name: 'Likes Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Can I pick from Twitter likes?", answer: "Yes! Cleack can fetch everyone who liked your tweet and pick a random winner." },
  { question: "Why use likes for giveaways?", answer: "Likes are effortless, so you get maximum participation with minimal friction." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-likes-twitter/' },
  { lang: 'en', url: 'https://cleack.io/en/twitter-likes-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/twitter-likes-picker/' },
];

const TwitterLikesPickerPage = () => (
  <>
    <SEOHead
      title="Twitter Likes Picker - Pick Random Winner from Likes | Cleack"
      description="Pick a random winner from Twitter likes. Easy participation, maximum entries. Free with proof."
      keywords="twitter likes picker, pick from twitter likes, twitter like giveaway, random like winner"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" /> Likes Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Twitter Likes Picker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>Twitter likes</strong>. Maximum participation with minimum effort.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-sky-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sky-600 transition-all">
            <Play className="w-5 h-5" /> Pick Likes Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>Likes-Based Giveaways</h2>
            <p>Likes are the easiest way to enter - just one tap. Perfect for quick, high-participation giveaways.</p>
          </div>
          <FAQSection items={faqItems} title="Likes Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="twitter" lang="en" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-sky-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your Likes Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default TwitterLikesPickerPage;
