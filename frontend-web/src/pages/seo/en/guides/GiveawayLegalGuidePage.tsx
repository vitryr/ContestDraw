import { Link } from 'react-router-dom';
import { Scale, Sparkles, AlertTriangle } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/guides/giveaway-legal-guide/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: '/en/guides/' },
  { name: 'Legal Guide', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Are Instagram giveaways legal?", answer: "Yes, when run properly. They're classified as sweepstakes (no purchase required) which are legal in most jurisdictions." },
  { question: "Do I need to pay taxes on giveaway prizes?", answer: "In the US, prizes over $600 require a 1099 form. Check your local tax laws." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/guide/legal-jeu-concours-france/' },
  { lang: 'en', url: 'https://cleack.io/en/guides/giveaway-legal-guide/' },
  { lang: 'x-default', url: 'https://cleack.io/en/guides/giveaway-legal-guide/' },
];

const GiveawayLegalGuidePage = () => (
  <>
    <SEOHead
      title="Giveaway Legal Guide - Is Your Contest Legal? | Cleack"
      description="Everything you need to know about running legally compliant social media giveaways in the US and internationally."
      keywords="is instagram giveaway legal, giveaway legal guide, social media contest law, giveaway compliance"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4" /> Legal Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Giveaway Legal Guide
            </h1>
            <p className="text-xl text-gray-600">
              Run legally compliant social media giveaways without worry.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800">Disclaimer</h4>
                <p className="text-amber-700 text-sm">This is general guidance, not legal advice. Consult a lawyer for specific situations.</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Types of Promotions</h2>
            <p>Understanding the difference is crucial for compliance:</p>
            <ul>
              <li><strong>Sweepstakes</strong> - Winner selected by chance, no purchase required (most giveaways)</li>
              <li><strong>Contests</strong> - Winner selected by skill/merit (photo contests, etc.)</li>
              <li><strong>Lotteries</strong> - Requires purchase + chance = ILLEGAL for private parties</li>
            </ul>

            <h2>Key Legal Requirements (US)</h2>
            <ul>
              <li><strong>No purchase necessary</strong> - Can't require buying anything to enter</li>
              <li><strong>Official rules</strong> - Clear, accessible rules are required</li>
              <li><strong>Disclosure</strong> - State "Not sponsored by Instagram/TikTok/etc."</li>
              <li><strong>Age restrictions</strong> - Minimum 13 (platform requirement), often 18+</li>
              <li><strong>Void where prohibited</strong> - Some states have extra requirements</li>
            </ul>

            <h2>Platform-Specific Rules</h2>
            <h3>Instagram</h3>
            <ul>
              <li>Must acknowledge the promotion is not associated with Instagram</li>
              <li>Can't require shares to personal timelines to enter</li>
              <li>Must include official rules</li>
            </ul>

            <h3>TikTok</h3>
            <ul>
              <li>Follow TikTok Community Guidelines</li>
              <li>Disclose any sponsored content</li>
              <li>Don't promise guaranteed outcomes</li>
            </ul>

            <h2>International Considerations</h2>
            <p>Different countries have different rules:</p>
            <ul>
              <li><strong>EU</strong> - GDPR applies to data collection</li>
              <li><strong>UK</strong> - ASA advertising rules apply</li>
              <li><strong>Canada</strong> - Quebec has special requirements</li>
              <li><strong>Australia</strong> - Each state has different permit requirements</li>
            </ul>

            <h2>Best Practices</h2>
            <ol>
              <li>Always have official rules</li>
              <li>Never require purchase to enter</li>
              <li>Be clear about eligibility</li>
              <li>Use a transparent winner selection method (like Cleack)</li>
              <li>Keep records of your draw</li>
              <li>Announce winners publicly</li>
            </ol>
          </div>

          <div className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Run Transparent Giveaways</h3>
            <p className="mb-6 text-emerald-100">Cleack generates proof videos to show your giveaway was fair</p>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner with Proof
            </Link>
          </div>

          <div className="mt-12">
            <FAQSection items={faqItems} title="Legal FAQ" />
          </div>
        </div>
      </article>
    </div>
  </>
);

export default GiveawayLegalGuidePage;
