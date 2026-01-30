import { Link } from 'react-router-dom';
import { Instagram, Sparkles, Calendar } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/blog/how-to-pick-instagram-winner/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Blog', url: '/en/blog/' },
  { name: 'How to Pick Instagram Winner', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "What's the fairest way to pick an Instagram winner?", answer: "Use a verified random picker like Cleack that generates proof video. This ensures true randomness and transparency." },
  { question: "Can I pick multiple winners?", answer: "Yes, most tools including Cleack let you pick multiple winners in one draw." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/blog/comment-faire-tirage-au-sort-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/blog/how-to-pick-instagram-winner/' },
  { lang: 'x-default', url: 'https://cleack.io/en/blog/how-to-pick-instagram-winner/' },
];

const HowToPickInstagramWinnerPage = () => (
  <>
    <SEOHead
      title="How to Pick a Winner on Instagram - Complete Guide | Cleack"
      description="Learn how to pick a random Instagram giveaway winner fairly. Step-by-step guide with free tools and best practices."
      keywords="how to pick a winner on instagram, instagram winner picker, pick instagram giveaway winner, random instagram winner"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>January 15, 2025</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to Pick a Winner on Instagram
            </h1>
            <p className="text-xl text-gray-600">
              The complete guide to selecting a random, fair winner for your Instagram giveaway.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Why Random Selection Matters</h2>
            <p>
              When running an Instagram giveaway, picking a winner fairly is crucial for maintaining 
              trust with your audience. Manual selection or biased picks can damage your reputation.
            </p>

            <h2>Methods to Pick an Instagram Winner</h2>
            
            <h3>1. Use a Giveaway Picker Tool (Recommended)</h3>
            <p>
              The best method is using a dedicated tool like Cleack. Here's why:
            </p>
            <ul>
              <li>True random selection</li>
              <li>Proof video for transparency</li>
              <li>Bot and fake account detection</li>
              <li>Handles unlimited comments</li>
            </ul>

            <h3>2. Manual Screenshot Method (Not Recommended)</h3>
            <p>
              Some people scroll through comments and screenshot a random one. Problems:
            </p>
            <ul>
              <li>Not truly random</li>
              <li>Time-consuming for large giveaways</li>
              <li>No proof it was fair</li>
              <li>Misses newer comments</li>
            </ul>

            <h2>Step-by-Step with Cleack</h2>
            <ol>
              <li>Go to your Instagram giveaway post</li>
              <li>Copy the post URL</li>
              <li>Paste into Cleack</li>
              <li>Set any filters (required tags, etc.)</li>
              <li>Click "Pick Winner"</li>
              <li>Download and share the proof video</li>
            </ol>

            <h2>Best Practices</h2>
            <ul>
              <li>Always use a verified random selection tool</li>
              <li>Share proof of the draw (video or screenshot)</li>
              <li>Pick backup winners in case the first doesn't respond</li>
              <li>Announce publicly and contact the winner privately</li>
              <li>Set a response deadline (48-72 hours)</li>
            </ul>
          </div>

          <div className="mt-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Pick Your Instagram Winner Now</h3>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>

          <div className="mt-12">
            <FAQSection items={faqItems} title="Winner Selection FAQ" />
          </div>
        </div>
      </article>
    </div>
  </>
);

export default HowToPickInstagramWinnerPage;
