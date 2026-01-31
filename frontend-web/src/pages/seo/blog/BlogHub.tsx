import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { SEOHead, Breadcrumb } from '../../../components/seo';

// Types
interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: 'tutoriel' | 'idees' | 'comparatif' | 'legal' | 'guide';
  datePublished: string;
  dateModified: string;
  readTime: number;
  keywords: string[];
  featured?: boolean;
}

// Articles data
const articles: BlogArticle[] = [
  // TUTORIELS
  {
    slug: 'comment-faire-tirage-au-sort-instagram',
    title: 'Comment Faire un Tirage au Sort Instagram en 2025 (Guide Complet)',
    excerpt: 'Apprenez à organiser un tirage au sort Instagram étape par étape. Méthode gratuite, légale et équitable pour désigner un gagnant parmi vos commentaires.',
    category: 'tutoriel',
    datePublished: '2024-09-15',
    dateModified: '2025-01-20',
    readTime: 8,
    keywords: ['comment faire tirage au sort instagram', 'tirage instagram tutoriel'],
    featured: true,
  },
  {
    slug: 'comment-faire-tirage-au-sort-tiktok',
    title: 'Comment Faire un Tirage au Sort TikTok : Tutoriel 2025',
    excerpt: 'Guide complet pour organiser un giveaway TikTok réussi. Choisissez un gagnant parmi les commentaires de vos vidéos facilement.',
    category: 'tutoriel',
    datePublished: '2024-10-05',
    dateModified: '2025-01-15',
    readTime: 7,
    keywords: ['comment faire tirage tiktok', 'giveaway tiktok tutoriel'],
  },
  {
    slug: 'comment-faire-tirage-au-sort-facebook',
    title: 'Comment Organiser un Tirage au Sort Facebook (Guide 2025)',
    excerpt: 'Tout savoir pour réaliser un tirage au sort sur Facebook : pages, groupes, publications. Méthode conforme aux règles de la plateforme.',
    category: 'tutoriel',
    datePublished: '2024-10-12',
    dateModified: '2025-01-10',
    readTime: 6,
    keywords: ['tirage au sort facebook', 'concours facebook comment faire'],
  },
  {
    slug: 'comment-faire-tirage-au-sort-youtube',
    title: 'Tirage au Sort YouTube : Comment Choisir un Gagnant (2025)',
    excerpt: 'Méthode simple pour sélectionner aléatoirement un gagnant parmi les commentaires YouTube. Compatible avec les Shorts et vidéos classiques.',
    category: 'tutoriel',
    datePublished: '2024-11-01',
    dateModified: '2025-01-12',
    readTime: 6,
    keywords: ['tirage au sort youtube', 'choisir gagnant youtube'],
  },
  {
    slug: 'comment-choisir-gagnant-concours-instagram',
    title: 'Comment Choisir un Gagnant sur Instagram : 5 Méthodes Fiables',
    excerpt: 'Découvrez les meilleures méthodes pour sélectionner équitablement un gagnant parmi vos participants Instagram. Comparatif et conseils.',
    category: 'tutoriel',
    datePublished: '2024-11-15',
    dateModified: '2025-01-18',
    readTime: 7,
    keywords: ['choisir gagnant instagram', 'sélectionner vainqueur concours'],
  },
  
  // IDÉES & INSPIRATION
  {
    slug: 'idees-concours-instagram-2025',
    title: '10 Idées de Concours Instagram pour 2025 (+ Exemples)',
    excerpt: 'Inspirez-vous de ces 10 idées originales de jeux concours Instagram pour booster votre engagement et gagner des abonnés.',
    category: 'idees',
    datePublished: '2024-12-01',
    dateModified: '2025-01-22',
    readTime: 10,
    keywords: ['idées concours instagram', 'jeu concours instagram idées'],
    featured: true,
  },
  {
    slug: 'concours-noel-instagram',
    title: 'Concours de Noël Instagram : Guide Complet et Idées 2024',
    excerpt: 'Organisez un concours de Noël mémorable sur Instagram. Calendrier de l\'avent, gifts, stratégies gagnantes pour les fêtes.',
    category: 'idees',
    datePublished: '2024-11-20',
    dateModified: '2024-12-15',
    readTime: 9,
    keywords: ['concours noel instagram', 'calendrier avent instagram'],
  },
  {
    slug: 'idees-concours-ete-instagram',
    title: 'Concours d\'Été Instagram : 8 Idées Rafraîchissantes',
    excerpt: 'Des idées de giveaways estivaux pour engager votre communauté pendant les vacances. Photos, challenges, collaborations.',
    category: 'idees',
    datePublished: '2024-06-15',
    dateModified: '2024-08-20',
    readTime: 7,
    keywords: ['concours été instagram', 'giveaway vacances'],
  },
  {
    slug: 'idees-giveaway-tiktok',
    title: 'Idées de Giveaway TikTok : 12 Concepts Viraux',
    excerpt: 'Les meilleures idées de giveaways TikTok qui marchent vraiment. Duets, challenges, réactions : boostez votre visibilité.',
    category: 'idees',
    datePublished: '2024-09-20',
    dateModified: '2025-01-05',
    readTime: 8,
    keywords: ['idées giveaway tiktok', 'concours tiktok viral'],
  },
  
  // COMPARATIFS
  {
    slug: 'meilleur-outil-tirage-au-sort',
    title: 'Comparatif 2025 : Les Meilleurs Outils de Tirage au Sort',
    excerpt: 'Analyse détaillée des outils de tirage au sort en ligne. Cleack, Wask, App Sorteos... Lequel choisir pour vos concours ?',
    category: 'comparatif',
    datePublished: '2024-10-25',
    dateModified: '2025-01-25',
    readTime: 12,
    keywords: ['meilleur outil tirage au sort', 'comparatif tirage en ligne'],
    featured: true,
  },
  {
    slug: 'cleack-vs-app-sorteos',
    title: 'Cleack vs App Sorteos : Quel Outil Choisir en 2025 ?',
    excerpt: 'Comparaison détaillée entre Cleack et App Sorteos. Fonctionnalités, prix, facilité d\'utilisation : notre verdict.',
    category: 'comparatif',
    datePublished: '2024-11-10',
    dateModified: '2025-01-08',
    readTime: 8,
    keywords: ['cleack vs app sorteos', 'alternative app sorteos'],
  },
  {
    slug: 'cleack-vs-easypromos',
    title: 'Cleack vs Easypromos : Comparatif Complet 2025',
    excerpt: 'Easypromos ou Cleack ? Découvrez les différences clés entre ces deux solutions de tirage au sort pour faire le bon choix.',
    category: 'comparatif',
    datePublished: '2024-11-18',
    dateModified: '2025-01-10',
    readTime: 9,
    keywords: ['cleack vs easypromos', 'alternative easypromos gratuite'],
  },
  
  // LÉGAL & RÈGLES
  {
    slug: 'regles-jeu-concours-instagram',
    title: 'Règles d\'un Jeu Concours Instagram : Guide Légal 2025',
    excerpt: 'Tout ce qu\'il faut savoir sur les règles légales des concours Instagram en France. Règlement, mentions obligatoires, dépôt.',
    category: 'legal',
    datePublished: '2024-08-20',
    dateModified: '2025-01-20',
    readTime: 11,
    keywords: ['règles jeu concours instagram', 'règlement concours instagram'],
    featured: true,
  },
  {
    slug: 'jeu-concours-legal-france',
    title: 'Jeu Concours en France : Cadre Légal Complet 2025',
    excerpt: 'Le guide juridique des jeux concours en France. Loteries, tirages au sort, règlements : restez conforme à la loi.',
    category: 'legal',
    datePublished: '2024-07-15',
    dateModified: '2025-01-15',
    readTime: 15,
    keywords: ['jeu concours légal france', 'loi concours france'],
  },
  {
    slug: 'modeles-reglement-concours',
    title: 'Modèles de Règlement de Concours : Templates Gratuits 2025',
    excerpt: 'Téléchargez nos modèles de règlement de jeu concours prêts à l\'emploi. Conformes à la législation française.',
    category: 'legal',
    datePublished: '2024-09-01',
    dateModified: '2025-01-12',
    readTime: 6,
    keywords: ['modèle règlement concours', 'template règlement jeu concours'],
  },
  
  // GUIDES AVANCÉS
  {
    slug: 'augmenter-engagement-instagram-concours',
    title: 'Augmenter l\'Engagement Instagram avec les Concours',
    excerpt: 'Stratégies avancées pour maximiser l\'engagement de vos concours Instagram. Timing, hashtags, collaborations.',
    category: 'guide',
    datePublished: '2024-10-01',
    dateModified: '2025-01-18',
    readTime: 10,
    keywords: ['augmenter engagement instagram', 'concours engagement instagram'],
  },
  {
    slug: 'eviter-faux-comptes-giveaway',
    title: 'Comment Éviter les Faux Comptes dans vos Giveaways',
    excerpt: 'Apprenez à détecter et filtrer les bots et faux comptes pour des tirages au sort équitables. Outils et techniques.',
    category: 'guide',
    datePublished: '2024-09-25',
    dateModified: '2025-01-05',
    readTime: 8,
    keywords: ['faux comptes giveaway', 'détecter bots concours instagram'],
  },
  {
    slug: 'optimiser-concours-instagram',
    title: 'Optimiser vos Concours Instagram : Le Guide Ultime',
    excerpt: 'Tous les secrets pour des concours Instagram performants. De la création à l\'analyse des résultats.',
    category: 'guide',
    datePublished: '2024-08-10',
    dateModified: '2025-01-22',
    readTime: 14,
    keywords: ['optimiser concours instagram', 'améliorer giveaway instagram'],
  },
];

// Categories config
const categories = [
  { id: 'all', name: 'Tous les articles', icon: '📚' },
  { id: 'tutoriel', name: 'Tutoriels', icon: '📖' },
  { id: 'idees', name: 'Idées & Inspiration', icon: '💡' },
  { id: 'comparatif', name: 'Comparatifs', icon: '⚖️' },
  { id: 'legal', name: 'Légal & Règles', icon: '⚖️' },
  { id: 'guide', name: 'Guides Avancés', icon: '🎯' },
];

const getCategoryLabel = (category: BlogArticle['category']) => {
  const labels = {
    tutoriel: { name: 'Tutoriel', color: 'bg-accent-secondary/20 text-blue-800' },
    idees: { name: 'Idées', color: 'bg-accent-secondary/20 text-purple-800' },
    comparatif: { name: 'Comparatif', color: 'bg-orange-500/20 text-orange-800' },
    legal: { name: 'Légal', color: 'bg-red-500/20 text-red-800' },
    guide: { name: 'Guide', color: 'bg-bg-elevated0/20 text-green-800' },
  };
  return labels[category];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Article Card Component
const ArticleCard = ({ article, featured = false }: { article: BlogArticle; featured?: boolean }) => {
  const categoryInfo = getCategoryLabel(article.category);
  
  return (
    <article 
      className={`bg-bg-primary rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-white/10 group ${
        featured ? 'md:col-span-2 md:flex' : ''
      }`}
    >
      {/* Image placeholder */}
      <div className={`bg-gradient-to-br from-primary-500 to-primary-700 ${featured ? 'md:w-2/5' : 'h-48'} flex items-center justify-center`}>
        <span className="text-6xl opacity-50">{categories.find(c => c.id === article.category)?.icon || '📝'}</span>
      </div>
      
      <div className={`p-6 ${featured ? 'md:w-3/5' : ''}`}>
        {/* Category & Meta */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
            {categoryInfo.name}
          </span>
          {featured && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-800">
              ⭐ À la une
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className={`font-bold text-white mb-2 group-hover:text-primary-600 transition-colors ${
          featured ? 'text-2xl' : 'text-lg'
        }`}>
          <Link to={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className={`text-ink-secondary mb-4 ${featured ? '' : 'line-clamp-2'}`}>
          {article.excerpt}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-ink-muted mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(article.dateModified)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {article.readTime} min
          </span>
        </div>
        
        {/* Read more link */}
        <Link 
          to={`/blog/${article.slug}`}
          className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Lire l'article
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export const BlogHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);
  
  // Featured articles
  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);
  
  // SEO data
  const breadcrumbItems = [
    { name: 'Articles', url: 'https://cleack.io/articles/' },
  ];
  
  // Schema.org BlogPosting list
  const blogPostingSchema = articles.map(article => ({
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified,
    "author": {
      "@type": "Organization",
      "name": "Cleack"
    },
    "url": `https://cleack.io/${article.slug}/`
  }));

  return (
    <>
      <SEOHead
        title="Blog Cleack - Guides, Tutoriels et Astuces Tirage au Sort"
        description="Découvrez nos guides complets sur les tirages au sort Instagram, TikTok, Facebook. Tutoriels, idées de concours, aspects légaux et comparatifs d'outils."
        keywords="blog tirage au sort, tutoriel concours instagram, guide giveaway, règles jeu concours"
        canonicalUrl="https://cleack.io/"
        ogType="website"
        breadcrumbs={breadcrumbItems}
        articleData={{
          datePublished: '2024-06-01',
          dateModified: '2025-01-25',
        }}
      />
      
      {/* Additional Schema.org for Blog */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog Cleack",
          "description": "Guides et tutoriels sur les tirages au sort et concours en ligne",
          "url": "https://cleack.io/",
          "publisher": {
            "@type": "Organization",
            "name": "Cleack",
            "url": "https://cleack.io"
          },
          "blogPost": blogPostingSchema
        })}
      </script>
      
      <div className="min-h-screen bg-bg-elevated">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} className="mb-6 text-primary-100" />
            
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Blog Cleack
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Guides, tutoriels et conseils pour réussir vos tirages au sort et concours sur les réseaux sociaux.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Filter */}
        <section className="bg-bg-primary border-b border-white/10 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-4 overflow-x-auto">
              <Filter className="w-5 h-5 text-ink-muted flex-shrink-0" />
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-bg-card text-ink-secondary hover:bg-bg-hover'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Articles Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Results count */}
            <p className="text-ink-secondary mb-6">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            </p>
            
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  ⭐ Articles à la une
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map(article => (
                    <ArticleCard key={article.slug} article={article} featured />
                  ))}
                </div>
              </div>
            )}
            
            {/* Regular Articles */}
            {regularArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  📚 Tous les articles
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map(article => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}
            
            {/* No results */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-ink-muted text-lg">
                  Aucun article trouvé pour cette recherche.
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="mt-4 text-primary-600 font-medium hover:underline"
                >
                  Voir tous les articles
                </button>
              </div>
            )}
          </div>
        </section>
        
        {/* Newsletter CTA */}
        <section className="bg-bg-elevated py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Restez informé
            </h2>
            <p className="text-ink-secondary mb-8 max-w-2xl mx-auto">
              Recevez nos derniers guides et astuces pour réussir vos concours sur les réseaux sociaux.
            </p>
            <Link
              to="/tirage-au-sort-instagram"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Essayer Cleack gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
        
        {/* Internal Links Section */}
        <section className="py-12 bg-bg-primary">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Ressources complémentaires
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Link to="/tirage-au-sort-instagram" className="p-6 bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl hover:shadow-md transition-shadow text-center">
                <span className="text-3xl mb-2 block">📸</span>
                <h3 className="font-bold text-white">Tirage Instagram</h3>
                <p className="text-sm text-ink-secondary mt-1">L'outil n°1 en France</p>
              </Link>
              <Link to="/tirage-au-sort-tiktok" className="p-6 bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl hover:shadow-md transition-shadow text-center">
                <span className="text-3xl mb-2 block">🎵</span>
                <h3 className="font-bold text-white">Tirage TikTok</h3>
                <p className="text-sm text-ink-secondary mt-1">Giveaways viraux</p>
              </Link>
              <Link to="/guide" className="p-6 bg-gradient-to-br from-bg-primary to-bg-primary rounded-xl hover:shadow-md transition-shadow text-center">
                <span className="text-3xl mb-2 block">📖</span>
                <h3 className="font-bold text-white">Guides</h3>
                <p className="text-sm text-ink-secondary mt-1">Tutoriels complets</p>
              </Link>
              <Link to="/outils" className="p-6 bg-gradient-to-br from-bg-primary to-amber-50 rounded-xl hover:shadow-md transition-shadow text-center">
                <span className="text-3xl mb-2 block">🛠️</span>
                <h3 className="font-bold text-white">Outils</h3>
                <p className="text-sm text-ink-secondary mt-1">Générateurs gratuits</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogHub;
