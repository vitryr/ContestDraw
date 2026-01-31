import { Link } from 'react-router-dom';
import { Shield, Sparkles, Calendar } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/instagram-giveaway-rules/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Blog', url: '/en/blog/' },
  { name: 'Instagram Giveaway Rules', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  { question: "Does Instagram have official giveaway rules?", answer: "Yes, Instagram has promotion guidelines that require you to acknowledge the giveaway isn't affiliated with Instagram and to have official rules." },
  { question: "Can I require people to share to their story?", answer: "Yes, but you can't require shares to personal timelines (regular posts). Stories are allowed." },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/blog/regles-jeu-concours-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/instagram-giveaway-rules/' },
  { lang: 'x-default', url: 'https://cleack.io/en/instagram-giveaway-rules/' },
];

const InstagramGiveawayRulesPage = () => (
  <>
    <SEOHead
      title="Instagram Giveaway Rules - What You Need to Know | Cleack"
      description="Complete guide to Instagram giveaway rules and guidelines. Stay compliant and run successful contests."
      keywords="instagram giveaway rules, instagram contest rules, instagram promotion guidelines, instagram giveaway requirements"
      canonicalUrl={CANONICAL_URL}
      hrefLangAlternates={hrefLangAlternates}
      breadcrumbs={breadcrumbItems}
      faqItems={faqItems}
    />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-bg-elevated to-bg-primary">
      <div className="max-w-7xl mx-auto px-4 pt-4"><Breadcrumb items={breadcrumbItems} /></div>
      
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-sm text-ink-muted mb-4">
              <Calendar className="w-4 h-4" />
              <span>January 5, 2025</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Instagram Giveaway Rules
            </h1>
            <p className="text-xl text-ink-secondary">
              Everything you need to know about running compliant Instagram giveaways.
            </p>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <h2>Instagram's Official Guidelines</h2>
            <p>
              Instagram has specific rules for promotions. Violating them can get your account 
              suspended or your giveaway removed. Here's what Instagram requires:
            </p>

            <h3>Required Acknowledgement</h3>
            <p>
              Every giveaway must acknowledge that:
            </p>
            <ul>
              <li>The promotion is not sponsored, endorsed, or administered by Instagram</li>
              <li>Instagram is released from any liability</li>
            </ul>
            <p>Add this to your caption or rules.</p>

            <h3>Official Rules Required</h3>
            <p>
              You must have official rules that include eligibility, entry requirements, 
              and prize details. Link to them or include them in your post.
            </p>

            <h3>No Timeline Shares</h3>
            <p>
              You <strong>cannot</strong> require participants to share your post to their 
              timeline (regular posts) to enter. Story shares are allowed.
            </p>

            <h3>Accurate Tagging</h3>
            <p>
              Don't encourage tagging people in photos they're not in, or tagging 
              accounts that aren't relevant.
            </p>

            <h2>What You CAN Require</h2>
            <ul>
              <li>✅ Like the post</li>
              <li>✅ Comment on the post</li>
              <li>✅ Tag friends in comments</li>
              <li>✅ Follow your account</li>
              <li>✅ Share to story (with a tag)</li>
              <li>✅ Save the post</li>
            </ul>

            <h2>What You CANNOT Require</h2>
            <ul>
              <li>❌ Share to timeline/feed</li>
              <li>❌ Tag people in photos they're not in</li>
              <li>❌ Make a purchase to enter</li>
              <li>❌ Tag celebrities/brands without their permission</li>
            </ul>

            <h2>Best Practices</h2>
            <ol>
              <li>Always include the Instagram disclaimer</li>
              <li>Have official rules accessible</li>
              <li>Be clear about entry requirements</li>
              <li>State start and end dates</li>
              <li>Use a verified random picker for transparency</li>
              <li>Announce winners publicly</li>
            </ol>
          </div>

          <div className="mt-12 bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Run a Compliant Giveaway</h3>
            <Link to="/draw/new" className="inline-flex items-center gap-2 bg-bg-primary text-accent-primary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              <Sparkles className="w-5 h-5" /> Pick Winner Free
            </Link>
          </div>

          <div className="mt-12">
            <FAQSection items={faqItems} title="Instagram Rules FAQ" />
          </div>
        </div>
      </article>
    </div>
  </>
);

export default InstagramGiveawayRulesPage;
