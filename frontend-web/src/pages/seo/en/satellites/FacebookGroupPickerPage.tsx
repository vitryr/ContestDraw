import { Link } from 'react-router-dom';
import { Facebook, Play, Sparkles, Users } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/facebook-group-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Facebook Giveaway Picker', url: '/en/facebook-giveaway-picker/' },
  { name: 'Group Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Can I pick from Facebook Group posts?", answer: "Yes! Paste the Group post URL and Cleack will fetch all comments." },
  { question: "Do Group posts need to be public?", answer: "The post needs to be accessible. Public groups work best." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-groupe-facebook/' },
  { lang: 'en', url: 'https://cleack.io/en/facebook-group-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/facebook-group-picker/' },
];

const FacebookGroupPickerPage = () => (
  <>
    <SEOHead
      title="Facebook Group Picker - Pick Winner from Group Comments | Cleack"
      description="Pick a random winner from Facebook Group comments. Perfect for community giveaways."
      keywords="facebook group picker, facebook group giveaway, pick from facebook group, group comment winner"
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
            <Users className="w-4 h-4" /> Group Picker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Facebook Group Picker</h1>
          <p className="text-xl text-ink-secondary mb-8 max-w-2xl mx-auto">
            Pick winners from <strong>Facebook Group</strong> posts. Perfect for community giveaways.
          </p>
          <Link to="/draw/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all">
            <Play className="w-5 h-5" /> Pick Group Winner Free
          </Link>
        </div>
      </section>
      <section className="py-16 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none mb-12">
            <h2>Facebook Group Giveaways</h2>
            <p>Groups are perfect for community giveaways. Members are engaged and contests drive activity.</p>
          </div>
          <FAQSection items={faqItems} title="Group Picker FAQ" />
          <div className="mt-12"><PlatformLinks currentPlatform="facebook" /></div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Pick Your Group Winner</h2>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-bg-elevated text-accent-secondary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default FacebookGroupPickerPage;
