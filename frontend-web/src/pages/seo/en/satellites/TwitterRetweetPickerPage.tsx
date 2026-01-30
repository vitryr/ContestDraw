import { Link } from 'react-router-dom';
import { Twitter, Play, Sparkles, Repeat2 } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/twitter-retweet-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Twitter Giveaway Picker', url: '/en/twitter-giveaway-picker/' },
  { name: 'Retweet Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Can I pick from retweets?", answer: "Yes! Paste your tweet URL and Cleack fetches all retweets for random selection." },
  { question: "Why use retweet giveaways?", answer: "Retweets maximize reach. Every RT exposes your giveaway to a new audience." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-retweets/' },
  { lang: 'en', url: 'https://cleack.io/en/twitter-retweet-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/twitter-retweet-picker/' },
];

const TwitterRetweetPickerPage = () => (
  <>
    <SEOHead
      title="Twitter Retweet Picker - Pick Random Retweeter Winner | Cleack"
      description="Pick a random winner from Twitter retweets. Maximize reach with RT giveaways. Free with proof."
      keywords="twitter retweet picker, random retweet picker, pick from retweets, twitter rt giveaway"
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
            <Repeat2 className="w-4 h-4" /> Retweet Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Twitter Retweet Picker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>Twitter retweets</strong>. Maximize your giveaway's reach.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-sky-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sky-600 transition-all">
            <Play className="w-5 h-5" /> Pick RT Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>Retweet Giveaways</h2>
            <p>RTs are the best way to spread your giveaway. Each retweet = exposure to a new audience.</p>
          </div>
          <FAQSection items={faqItems} title="Retweet Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="twitter" lang="en" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-sky-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your RT Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default TwitterRetweetPickerPage;
