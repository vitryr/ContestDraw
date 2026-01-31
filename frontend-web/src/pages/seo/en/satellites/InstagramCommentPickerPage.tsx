import { Link } from 'react-router-dom';
import { Instagram, CheckCircle2, Play, Sparkles, ArrowRight } from 'lucide-react';
import { SEOHead, Breadcrumb, FAQSection, PlatformLinks } from '../../../../components/seo';
import type { FAQItem, BreadcrumbItem } from '../../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/instagram-comment-picker/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Instagram Giveaway Picker', url: '/en/instagram-giveaway-picker/' },
  { name: 'Comment Picker', url: CANONICAL_URL },
];

const faqItems: FAQItem[] = [
  {
    question: "How does the Instagram comment picker work?",
    answer: "Paste your Instagram post URL, and Cleack fetches all comments automatically. Then click 'Pick Winner' to randomly select a winner from commenters."
  },
  {
    question: "Can I require commenters to tag friends?",
    answer: "Yes! Use our filter to require a minimum number of @mentions in comments. Only comments with tags will qualify."
  },
  {
    question: "Does it work with posts that have thousands of comments?",
    answer: "Absolutely! Cleack can process unlimited comments, even from viral posts with 100,000+ comments."
  },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/tirage-commentaires-instagram/' },
  { lang: 'en', url: 'https://cleack.io/en/instagram-comment-picker/' },
  { lang: 'x-default', url: 'https://cleack.io/en/instagram-comment-picker/' },
];

const InstagramCommentPickerPage = () => {
  return (
    <>
      <SEOHead
        title="Instagram Comment Picker - Pick Random Comment Winner | Cleack"
        description="Pick a random winner from Instagram comments for free. Filter by tags, exclude duplicates, and get a proof video. Fast and reliable."
        keywords="instagram comment picker, random comment picker instagram, instagram comment winner, pick instagram comment winner"
        canonicalUrl={CANONICAL_URL}
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
        faqItems={faqItems}
      />

      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-bg-primary0 to-bg-primary0 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Instagram className="w-4 h-4" />
              Comment Picker
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Instagram Comment Picker
            </h1>

            <p className="text-xl text-ink-secondary mb-8 max-w-2xl mx-auto">
              Pick a <strong>random winner</strong> from Instagram comments. The most popular 
              way to run giveaways - simple, fair, and transparent.
            </p>

            <Link
              to="/draw/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-bg-primary0 to-bg-primary0 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
            >
              <Play className="w-5 h-5" />
              Pick Comment Winner Free
            </Link>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-bg-elevated">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-lg max-w-none mb-12">
              <h2>How to Pick a Random Instagram Comment Winner</h2>
              <p>
                The Instagram comment picker is the most common way to run giveaways. 
                Participants comment on your post, and you pick a random winner from all comments.
              </p>
              
              <h3>Steps:</h3>
              <ol>
                <li>Copy your Instagram post link</li>
                <li>Paste it into Cleack</li>
                <li>Configure filters (optional): require @mentions, exclude duplicates</li>
                <li>Click "Pick Winner"</li>
                <li>Share the proof video with your audience</li>
              </ol>

              <h3>Popular Comment Giveaway Formats</h3>
              <ul>
                <li><strong>"Comment to enter"</strong> - Simplest format, maximum participation</li>
                <li><strong>"Tag a friend"</strong> - Each tag = one entry, great for virality</li>
                <li><strong>"Answer a question"</strong> - Drives engagement and comments</li>
                <li><strong>"Comment + follow"</strong> - Grow followers while running giveaways</li>
              </ul>
            </div>

            {/* FAQ */}
            <FAQSection items={faqItems} title="Comment Picker FAQ" />

            {/* Related */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-4">Other Instagram Picker Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Instagram Likes Picker', url: '/en/instagram-likes-picker/', desc: 'Pick from people who liked your post' },
                  { title: 'Instagram Story Picker', url: '/en/instagram-story-picker/', desc: 'Pick from story replies and mentions' },
                  { title: 'Instagram Reels Picker', url: '/en/instagram-reels-picker/', desc: 'Pick from Reels comments' },
                ].map((item) => (
                  <Link key={item.url} to={item.url} className="p-4 bg-bg-elevated rounded-lg hover:bg-bg-elevated transition-colors group">
                    <h4 className="font-semibold text-white group-hover:text-accent-primary">{item.title}</h4>
                    <p className="text-sm text-ink-secondary">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div className="mt-12">
              <PlatformLinks currentPlatform="instagram" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-r from-bg-primary0 to-bg-primary0 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to Pick Your Comment Winner?</h2>
              <Link
                to="/draw/new"
                className="inline-flex items-center gap-2 bg-bg-elevated text-accent-primary px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Pick Winner Free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InstagramCommentPickerPage;
