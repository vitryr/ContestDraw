import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

// TikTok icon (not in lucide)
const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface LinkItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  platform?: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'twitter';
}

interface InternalLinksProps {
  title?: string;
  subtitle?: string;
  links: LinkItem[];
  variant?: 'grid' | 'list' | 'cards';
  className?: string;
  columns?: 2 | 3 | 4;
}

const platformIcons = {
  instagram: <Instagram className="w-5 h-5" />,
  tiktok: <TikTokIcon className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
};

const platformColors = {
  instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
  tiktok: 'bg-black',
  facebook: 'bg-blue-600',
  youtube: 'bg-red-600',
  twitter: 'bg-sky-500',
};

export const InternalLinks: React.FC<InternalLinksProps> = ({
  title = "Articles Connexes",
  subtitle,
  links,
  variant = 'grid',
  className = '',
  columns = 3,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  if (variant === 'list') {
    return (
      <section className={`py-8 ${className}`}>
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-ink-secondary mb-6">{subtitle}</p>
          )}
          <ul className="space-y-3">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.url}
                  className="flex items-center gap-3 text-primary-600 hover:text-primary-700 hover:underline group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (variant === 'cards') {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-6xl mx-auto">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2 text-center">{title}</h2>
          )}
          {subtitle && (
            <p className="text-ink-secondary mb-8 text-center">{subtitle}</p>
          )}
          <div className={`grid gap-6 ${gridCols[columns]}`}>
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                className="group bg-bg-elevated rounded-xl border border-white/10 p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
              >
                {link.platform && (
                  <div className={`w-12 h-12 rounded-lg ${platformColors[link.platform]} text-white flex items-center justify-center mb-4`}>
                    {platformIcons[link.platform]}
                  </div>
                )}
                {link.icon && !link.platform && (
                  <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                    {link.icon}
                  </div>
                )}
                <h3 className="font-semibold text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {link.title}
                </h3>
                {link.description && (
                  <p className="text-ink-secondary text-sm">{link.description}</p>
                )}
                <span className="inline-flex items-center gap-1 text-primary-600 text-sm mt-3 group-hover:gap-2 transition-all">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: grid variant
  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        )}
        {subtitle && (
          <p className="text-ink-secondary mb-6">{subtitle}</p>
        )}
        <div className={`grid gap-4 ${gridCols[columns]}`}>
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              className="flex items-center gap-3 p-4 bg-bg-elevated rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors group"
            >
              {link.platform && (
                <span className={`p-2 rounded-lg ${platformColors[link.platform]} text-white`}>
                  {platformIcons[link.platform]}
                </span>
              )}
              {link.icon && !link.platform && (
                <span className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  {link.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <span className="font-medium text-white group-hover:text-primary-700">
                  {link.title}
                </span>
                {link.description && (
                  <p className="text-sm text-ink-tertiary truncate">{link.description}</p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pre-configured link sets for common use cases
export const PlatformLinks: React.FC<{ currentPlatform?: string; className?: string }> = ({ 
  currentPlatform, 
  className = '' 
}) => {
  const allPlatforms: LinkItem[] = [
    {
      title: "Tirage au Sort Instagram",
      url: "/tirage-au-sort-instagram/",
      description: "Commentaires, likes, stories et reels",
      platform: 'instagram',
    },
    {
      title: "Tirage au Sort TikTok",
      url: "/tirage-au-sort-tiktok/",
      description: "Commentaires et giveaways TikTok",
      platform: 'tiktok',
    },
    {
      title: "Tirage au Sort Facebook",
      url: "/tirage-au-sort-facebook/",
      description: "Pages et groupes Facebook",
      platform: 'facebook',
    },
    {
      title: "Tirage au Sort YouTube",
      url: "/tirage-au-sort-youtube/",
      description: "Commentaires vidéos et shorts",
      platform: 'youtube',
    },
    {
      title: "Tirage au Sort Twitter/X",
      url: "/tirage-au-sort-twitter/",
      description: "Retweets et likes Twitter",
      platform: 'twitter',
    },
  ];

  const filteredPlatforms = currentPlatform
    ? allPlatforms.filter(p => !p.url.includes(currentPlatform))
    : allPlatforms;

  return (
    <InternalLinks
      title="Découvrez nos autres outils"
      subtitle="Faites des tirages au sort sur toutes les plateformes"
      links={filteredPlatforms}
      variant="cards"
      columns={currentPlatform ? 4 : 3}
      className={className}
    />
  );
};

export default InternalLinks;
