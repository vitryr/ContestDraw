import { Link } from 'react-router-dom';
import { Shield, Sparkles, BookOpen, Copy } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/guides/giveaway-rules-template/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: '/en/guides/' },
  { name: 'Giveaway Rules Template', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Do I legally need giveaway rules?", answer: "Yes, in most jurisdictions. Rules protect you legally and set clear expectations." },
  { question: "Where should I post my rules?", answer: "Link to them in your bio, include a link in your giveaway post, or post them as a separate image." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/guide/reglement-jeu-concours/' },
  { lang: 'en', url: 'https://cleack.io/en/guides/giveaway-rules-template/' },
  { lang: 'x-default', url: 'https://cleack.io/en/guides/giveaway-rules-template/' },
];

const GiveawayRulesTemplatePage = () => (
  <>
    <SEOHead
      title="Free Giveaway Rules Template - Instagram Contest Rules | Cleack"
      description="Free giveaway rules template for Instagram, TikTok, and social media contests. Copy and customize for your giveaway."
      keywords="giveaway rules template, instagram giveaway rules, contest rules template, social media giveaway rules"
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
              <Shield className="w-4 h-4" /> Free Template
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Giveaway Rules Template
            </h1>
            <p className="text-xl text-gray-600">
              Free, customizable giveaway rules for Instagram, TikTok, and other social media platforms.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Why You Need Official Rules</h2>
            <p>
              Official giveaway rules protect you legally and set clear expectations for participants. 
              Most platforms require them, and they help prevent disputes.
            </p>

            <h2>What to Include</h2>
            <ul>
              <li><strong>Sponsor information</strong> - Your name/company and contact</li>
              <li><strong>Eligibility</strong> - Age, location restrictions</li>
              <li><strong>Entry period</strong> - Start and end dates</li>
              <li><strong>Entry method</strong> - How to enter</li>
              <li><strong>Prize description</strong> - What the winner receives</li>
              <li><strong>Winner selection</strong> - How and when</li>
              <li><strong>Winner notification</strong> - How they'll be contacted</li>
              <li><strong>Disclaimer</strong> - Not sponsored by Instagram/TikTok/etc.</li>
            </ul>

            <h2>Template</h2>
          </div>

          <div className="bg-gray-100 rounded-xl p-6 my-8 font-mono text-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Giveaway Rules Template</span>
              <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-gray-700">
{`OFFICIAL GIVEAWAY RULES

1. SPONSOR
This giveaway is sponsored by [Your Name/Company], located at [Your Address].

2. ELIGIBILITY
Open to residents of [Countries/States] who are [Age]+ years old. Employees of [Company] and their immediate families are not eligible.

3. ENTRY PERIOD
The giveaway begins on [Start Date] at [Time] [Timezone] and ends on [End Date] at [Time] [Timezone].

4. HOW TO ENTER
To enter:
- Follow @[your_account] on [Platform]
- Like this post
- Comment with [requirement]
- Tag [number] friends

Each person may enter [number] time(s).

5. PRIZE
The winner will receive [Prize Description] (approximate retail value: $[Value]).

6. WINNER SELECTION
Winner will be selected randomly using Cleack.io on [Draw Date]. The selection will be recorded on video for transparency.

7. WINNER NOTIFICATION
Winner will be notified via [Method] within [Timeframe] of selection. If winner doesn't respond within [Days] days, an alternate winner will be selected.

8. DISCLAIMER
This giveaway is not sponsored, endorsed, or administered by [Platform]. By entering, you release [Platform] from all liability.

9. GOVERNING LAW
This giveaway is governed by the laws of [State/Country].

For questions, contact [Email].`}
            </pre>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Tips for Giveaway Rules</h2>
            <ul>
              <li>Keep language simple and clear</li>
              <li>Be specific about dates and times (include timezone)</li>
              <li>Clearly describe the prize</li>
              <li>Explain exactly how to enter</li>
              <li>State how the winner will be chosen</li>
            </ul>
          </div>

          <div className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Use Our Rules Generator</h3>
            <p className="mb-6 text-emerald-100">Create custom rules with our interactive tool</p>
            <Link to="/en/tools/rules-generator/" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Generate Rules
            </Link>
          </div>

          <div className="mt-12">
            <FAQSection items={faqItems} title="Rules Template FAQ" />
          </div>
        </div>
      </article>
    </div>
  </>
);

export default GiveawayRulesTemplatePage;
