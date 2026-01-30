import { Link } from 'react-router-dom';
import { Instagram, CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/guides/instagram-giveaway-guide/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: '/en/guides/' },
  { name: 'Instagram Giveaway Guide', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "How long should an Instagram giveaway last?", answer: "5-7 days is optimal. Long enough for participation, short enough for urgency." },
  { question: "What's the best entry method?", answer: "'Like + comment + tag a friend' is the sweet spot for engagement and reach." },
  { question: "Do I need official rules?", answer: "Yes, always have official rules to protect yourself legally and set clear expectations." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/guide/organiser-jeu-concours/' },
  { lang: 'en', url: 'https://cleack.io/en/guides/instagram-giveaway-guide/' },
  { lang: 'x-default', url: 'https://cleack.io/en/guides/instagram-giveaway-guide/' },
];

const HowToRunInstagramGiveawayPage = () => (
  <>
    <SEOHead
      title="How to Run an Instagram Giveaway - Complete Guide 2025 | Cleack"
      description="Learn how to run a successful Instagram giveaway step by step. Entry methods, rules, timing, promotion tips, and how to pick winners fairly."
      keywords="how to do a giveaway on instagram, instagram giveaway guide, run instagram contest, instagram giveaway tutorial"
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
              <BookOpen className="w-4 h-4" /> Complete Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to Run an Instagram Giveaway
            </h1>
            <p className="text-xl text-gray-600">
              The complete guide to running successful Instagram giveaways that grow your audience and engagement.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Why Run an Instagram Giveaway?</h2>
            <p>
              Instagram giveaways are one of the most effective ways to grow your account organically. 
              When done right, they can:
            </p>
            <ul>
              <li>Dramatically increase your follower count</li>
              <li>Boost engagement rates</li>
              <li>Build brand awareness</li>
              <li>Reward your existing community</li>
            </ul>

            <h2>Step 1: Choose Your Prize</h2>
            <p>
              The prize is everything. Choose something that:
            </p>
            <ul>
              <li><strong>Matches your niche</strong> - A tech prize for a tech account</li>
              <li><strong>Has perceived value</strong> - People need to want it</li>
              <li><strong>Is relevant to your brand</strong> - Your own products work great</li>
            </ul>

            <h2>Step 2: Set Your Entry Requirements</h2>
            <p>Common entry methods ranked by effectiveness:</p>
            <ol>
              <li><strong>Like + Comment + Tag friends</strong> - Best for growth</li>
              <li><strong>Like + Comment + Follow</strong> - Best for followers</li>
              <li><strong>Share to story + Tag</strong> - Best for reach</li>
              <li><strong>Just comment</strong> - Best for simplicity</li>
            </ol>

            <h2>Step 3: Create Your Rules</h2>
            <p>
              Every giveaway needs official rules. Include:
            </p>
            <ul>
              <li>Eligibility (age, location)</li>
              <li>Entry requirements</li>
              <li>Prize description</li>
              <li>Draw date and method</li>
              <li>How winners will be notified</li>
            </ul>
            <p>
              <Link to="/en/guides/giveaway-rules-template/" className="text-emerald-600 hover:underline">
                Get our free rules template →
              </Link>
            </p>

            <h2>Step 4: Create Compelling Content</h2>
            <p>Your giveaway post should:</p>
            <ul>
              <li>Feature the prize prominently</li>
              <li>Have clear, readable text saying "GIVEAWAY"</li>
              <li>List entry requirements in the caption</li>
              <li>Include the end date to create urgency</li>
            </ul>

            <h2>Step 5: Promote Your Giveaway</h2>
            <p>Don't just post once! Promote across:</p>
            <ul>
              <li>Stories (multiple times)</li>
              <li>Reels (for extra reach)</li>
              <li>Other social platforms</li>
              <li>Email newsletter</li>
            </ul>

            <h2>Step 6: Pick Your Winner with Cleack</h2>
            <p>
              When the giveaway ends, use Cleack to pick a fair winner:
            </p>
            <ol>
              <li>Copy your Instagram post URL</li>
              <li>Paste it into Cleack</li>
              <li>Set your filters (required tags, etc.)</li>
              <li>Click "Pick Winner"</li>
              <li>Share the proof video</li>
            </ol>
          </div>

          <div className="mt-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Pick Your Winner?</h3>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>

          <div className="mt-12">
            <FAQSection items={faqItems} title="Instagram Giveaway FAQ" />
          </div>
        </div>
      </article>
    </div>
  </>
);

export default HowToRunInstagramGiveawayPage;
