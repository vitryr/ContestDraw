import { Link } from 'react-router-dom';
import { Lightbulb, Sparkles, Instagram } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/guides/instagram-giveaway-ideas/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Guides', url: '/en/guides/' },
  { name: 'Giveaway Ideas', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "What's the best giveaway format?", answer: "'Comment + tag a friend' drives the most growth while keeping entry simple." },
  { question: "How often should I run giveaways?", answer: "Monthly or quarterly keeps your audience engaged without fatigue." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/blog/idees-concours-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/guides/instagram-giveaway-ideas/' },
  { lang: 'x-default', url: 'https://cleack.io/en/guides/instagram-giveaway-ideas/' },
];

const InstagramGiveawayIdeasPage = () => (
  <>
    <SEOHead
      title="25+ Instagram Giveaway Ideas That Actually Work | Cleack"
      description="Creative Instagram giveaway ideas to grow your audience. Entry formats, prize ideas, and promotional strategies that drive engagement."
      keywords="instagram giveaway ideas, contest ideas instagram, creative giveaway ideas, instagram promotion ideas"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-bg-primary via-bg-elevated to-bg-primary">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent-secondary/20 text-accent-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4" /> Creative Ideas
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Instagram Giveaway Ideas
            </h1>
            <p className="text-xl text-ink-secondary">
              25+ creative giveaway ideas that actually grow your Instagram.
            </p>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <h2>Entry Format Ideas</h2>
            
            <h3>1. Comment + Tag</h3>
            <p>The classic. "Comment and tag 2 friends to enter." Each tag can count as an extra entry.</p>

            <h3>2. Caption This</h3>
            <p>Post a funny photo and ask followers to write captions. Most creative wins (or pick randomly).</p>

            <h3>3. Share Your Story</h3>
            <p>"Tell us about [topic] in the comments." Gets genuine engagement and user stories.</p>

            <h3>4. Photo Challenge</h3>
            <p>Ask followers to post photos with a branded hashtag. Pick winners from submissions.</p>

            <h3>5. Quiz Giveaway</h3>
            <p>Post a quiz question. Everyone who answers correctly enters the draw.</p>

            <h3>6. Fill in the Blank</h3>
            <p>"My favorite [topic] is ______." Simple and engaging.</p>

            <h2>Prize Ideas by Niche</h2>

            <h3>Fashion & Beauty</h3>
            <ul>
              <li>Product bundles</li>
              <li>Shopping sprees</li>
              <li>Exclusive early access</li>
            </ul>

            <h3>Tech & Gaming</h3>
            <ul>
              <li>Latest gadgets</li>
              <li>Game codes</li>
              <li>Subscriptions</li>
            </ul>

            <h3>Food & Lifestyle</h3>
            <ul>
              <li>Gift cards</li>
              <li>Experience packages</li>
              <li>Product samplers</li>
            </ul>

            <h3>Business & Education</h3>
            <ul>
              <li>Free courses</li>
              <li>1:1 consultations</li>
              <li>Software subscriptions</li>
            </ul>

            <h2>Seasonal Ideas</h2>
            <ul>
              <li><strong>New Year:</strong> "New year, new [product]" giveaway</li>
              <li><strong>Valentine's:</strong> Tag your bestie/partner</li>
              <li><strong>Summer:</strong> Beach/vacation themed prizes</li>
              <li><strong>Back to School:</strong> Student-focused prizes</li>
              <li><strong>Holiday:</strong> 12 days of giveaways</li>
            </ul>

            <h2>Collaboration Ideas</h2>
            <ul>
              <li>Partner with complementary brands</li>
              <li>Influencer collaborations</li>
              <li>Community-driven prizes</li>
            </ul>
          </div>

          <div className="mt-12 bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Run Your Giveaway?</h3>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-bg-primary text-accent-primary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>

          <div className="mt-12">
            <FAQSection items={faqItems} title="Giveaway Ideas FAQ" />
          </div>
        </div>
      </article>
    </div>
  </>
);

export default InstagramGiveawayIdeasPage;
