import { Link } from 'react-router-dom';
import { Instagram, Play, Sparkles, Heart } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/instagram-likes-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Instagram Giveaway Picker', url: '/en/instagram-giveaway-picker/' },
  { name: 'Likes Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Can I pick from people who liked my post?", answer: "Yes! Cleack can pick random winners from people who liked your Instagram post." },
  { question: "Why choose likes over comments?", answer: "Likes require less effort, so you get more participation. Great for quick, simple giveaways." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-likes-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/instagram-likes-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/instagram-likes-picker/' },
];

const InstagramLikesPickerPage = () => (
  <>
    <SEOHead
      title="Instagram Likes Picker - Pick Random Winner from Likes | Cleack"
      description="Pick a random winner from Instagram likes. Simple giveaways with maximum participation. Free with proof video."
      keywords="instagram likes picker, pick from instagram likes, instagram like giveaway, random like picker"
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
            <Heart className="w-4 h-4" /> Likes Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Instagram Likes Picker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>Instagram likes</strong>. Maximum participation with minimum effort from your audience.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
            <Play className="w-5 h-5" /> Pick Likes Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>When to Use Likes Giveaways</h2>
            <p>Likes-based giveaways are perfect when you want:</p>
            <ul>
              <li><strong>Maximum participation</strong> - Liking is effortless</li>
              <li><strong>Quick giveaways</strong> - Simple to enter and run</li>
              <li><strong>To reward silent followers</strong> - People who engage but don't comment</li>
            </ul>
          </div>
          <FAQSection items={faqItems} title="Likes Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="instagram" lang="en" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your Likes Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default InstagramLikesPickerPage;
