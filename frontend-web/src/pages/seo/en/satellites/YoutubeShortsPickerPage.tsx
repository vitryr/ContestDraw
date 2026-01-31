import { Link } from 'react-router-dom';
import { Youtube, Play, Sparkles, Video } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/youtube-shorts-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'YouTube Comment Picker', url: '/en/youtube-comment-picker/' },
  { name: 'Shorts Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Does it work with YouTube Shorts?", answer: "Yes! Paste your Shorts URL and pick winners from comments just like regular videos." },
  { question: "Do Shorts get more engagement?", answer: "Shorts often get higher engagement rates, making them great for giveaways." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/giveaway-youtube-shorts/' },
  { lang: 'en', url: 'https://cleack.io/en/youtube-shorts-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/youtube-shorts-picker/' },
];

const YoutubeShortsPickerPage = () => (
  <>
    <SEOHead
      title="YouTube Shorts Picker - Pick Winner from Shorts Comments | Cleack"
      description="Pick a random winner from YouTube Shorts comments. Perfect for short-form content giveaways."
      keywords="youtube shorts picker, shorts comment picker, youtube shorts giveaway, pick shorts winner"
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
            <Video className="w-4 h-4" /> Shorts Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">YouTube Shorts Picker</h1>
          <p className="text-xl text-ink-secondary mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>YouTube Shorts</strong> comments. Short-form content, big engagement.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-all">
            <Play className="w-5 h-5" /> Pick Shorts Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>YouTube Shorts Giveaways</h2>
            <p>Shorts are perfect for quick, viral giveaways. High engagement + easy participation = success.</p>
          </div>
          <FAQSection items={faqItems} title="Shorts Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="youtube" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your Shorts Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-bg-elevated text-red-400 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default YoutubeShortsPickerPage;
