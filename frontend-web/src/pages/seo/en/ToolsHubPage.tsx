import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  FileText,
  Users,
  UserCheck,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SEOHead, Breadcrumb } from '../../../components/seo';
import type { BreadcrumbItem } from '../../../components/seo';

const CANONICAL_URL = 'https://cleack.io/en/tools/';

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Free Giveaway Tools', url: CANONICAL_URL },
];

const hrefLangAlternates = [
  { lang: 'fr', url: 'https://cleack.io/outils/' },
  { lang: 'en', url: 'https://cleack.io/en/tools/' },
  { lang: 'x-default', url: 'https://cleack.io/en/tools/' },
];

const tools = [
  {
    title: 'Giveaway Rules Generator',
    description: 'Create legally compliant giveaway rules in minutes. Customize for any platform and jurisdiction.',
    icon: FileText,
    url: '/en/tools/rules-generator/',
    badge: 'Most Popular',
    color: 'bg-accent-secondary/100',
  },
  {
    title: 'Participant Counter',
    description: 'Count comments, likes, and entries on any social media post before your giveaway ends.',
    icon: Users,
    url: '/en/tools/participant-counter/',
    color: 'bg-green-500',
  },
  {
    title: 'Account Verifier',
    description: 'Check if a social media account is real or fake. Verify winner accounts before sending prizes.',
    icon: UserCheck,
    url: '/en/tools/account-verifier/',
    color: 'bg-accent-secondary/100',
  },
  {
    title: 'Giveaway Calendar',
    description: 'Plan your giveaways around holidays and seasonal events for maximum engagement.',
    icon: Calendar,
    url: '/en/tools/giveaway-calendar/',
    color: 'bg-bg-elevated0',
  },
];

const ToolsHubPage = () => {
  return (
    <>
      <SEOHead
        title="Free Giveaway Tools - Rules Generator, Participant Counter | Cleack"
        description="Free tools for social media giveaways. Generate rules, count participants, verify accounts, and plan your contests. No signup required."
        keywords="giveaway tools, giveaway rules generator, participant counter, account verifier, free giveaway tools, contest tools"
        canonicalUrl={CANONICAL_URL}
        ogImage="https://cleack.io/images/og-tools-hub.jpg"
        hrefLangAlternates={hrefLangAlternates}
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-bg-elevated to-bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Wrench className="w-4 h-4" />
                Free Tools
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Giveaway{' '}
                <span className="text-amber-600">Tools</span>
              </h1>

              <p className="text-xl text-ink-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                Free tools to help you run <strong>better social media giveaways</strong>. 
                Generate rules, count participants, verify accounts, and more.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={tool.url}
                      className="block bg-bg-primary rounded-2xl p-8 border border-white/10 hover:shadow-xl hover:border-amber-200 transition-all group h-full"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-amber-600 transition-colors">
                              {tool.title}
                            </h3>
                            {tool.badge && (
                              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-ink-secondary mb-4">{tool.description}</p>
                          <span className="inline-flex items-center gap-1 text-amber-600 font-medium group-hover:gap-2 transition-all">
                            Use Tool <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Giveaway Picker CTA */}
        <section className="py-16 bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-500 to-bg-primary0 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-4">The Main Event: Giveaway Picker</h2>
                  <p className="text-lg text-white/90 mb-6">
                    These tools help you prepare. When you're ready to pick a winner, 
                    use our #1 rated giveaway picker tool.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {['Proof video included', 'Bot detection', 'All platforms supported', '100% free'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/90">
                        <Sparkles className="w-4 h-4" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center md:text-right">
                  <Link
                    to="/draw/new"
                    className="inline-flex items-center gap-2 bg-bg-primary text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Pick a Winner Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Tools List */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">All Free Tools</h2>
            
            <div className="bg-bg-primary rounded-xl border border-white/10 divide-y divide-gray-100">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link
                    key={tool.title}
                    to={tool.url}
                    className="flex items-center gap-4 p-6 hover:bg-bg-elevated transition-colors group"
                  >
                    <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white group-hover:text-amber-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-ink-secondary text-sm truncate">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ToolsHubPage;
