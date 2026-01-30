import { Link } from 'react-router-dom';
import { Instagram, Play, Sparkles } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/instagram-story-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Instagram Giveaway Picker', url: '/en/instagram-giveaway-picker/' },
  { name: 'Story Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Can I pick winners from story replies?", answer: "Yes! Cleack can analyze story replies and mentions to pick random winners." },
  { question: "How do story giveaways work?", answer: "Participants reply to your story or share it and mention you. Cleack collects these interactions and picks a winner." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-stories-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/instagram-story-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/instagram-story-picker/' },
];

const InstagramStoryPickerPage = () => (
  <>
    <SEOHead
      title="Instagram Story Picker - Pick Winner from Story Replies | Cleack"
      description="Pick a random winner from Instagram story replies and mentions. Run engaging story giveaways with proof video."
      keywords="instagram story picker, instagram story giveaway, story reply picker, instagram story contest"
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
            <Instagram className="w-4 h-4" /> Story Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Instagram Story Picker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>Instagram story replies</strong> and mentions. Perfect for interactive giveaways.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
            <Play className="w-5 h-5" /> Pick Story Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>How Story Giveaways Work</h2>
            <p>Story giveaways are highly engaging because they require active participation. Common formats:</p>
            <ul>
              <li><strong>"Reply to enter"</strong> - Participants send a DM or reply to your story</li>
              <li><strong>"Share to your story"</strong> - Participants repost and tag you</li>
              <li><strong>"Answer the poll"</strong> - Pick from poll participants</li>
            </ul>
          </div>
          <FAQSection items={faqItems} title="Story Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="instagram" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your Story Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default InstagramStoryPickerPage;
