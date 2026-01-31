import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  // Always include home as first item
  const allItems: BreadcrumbItem[] = [
    { name: 'Accueil', url: 'https://cleack.io/' },
    ...items
  ];

  return (
    <nav 
      aria-label="Fil d'ariane" 
      className={`flex items-center text-sm text-ink-tertiary ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-1 text-ink-tertiary flex-shrink-0" />
              )}
              
              {isLast ? (
                <span 
                  className="text-ink-secondary font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url.replace('https://cleack.io', '')}
                  className="hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  {isFirst && <Home className="w-4 h-4" />}
                  <span>{isFirst ? '' : item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
