import { useState, useEffect } from 'react';
import { List, ChevronUp } from 'lucide-react';

export interface TOCItem {
  id: string;
  title: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TOCItem[];
  title?: string;
  className?: string;
  sticky?: boolean;
  showBackToTop?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  title = "Sommaire",
  className = '',
  sticky = false,
  showBackToTop = true,
}) => {
  const [activeId, setActiveId] = useState<string>('');

  // Track scroll position and highlight active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerClasses = sticky
    ? `${className} sticky top-24`
    : className;

  return (
    <nav
      aria-label="Table des matières"
      className={`bg-gray-50 rounded-xl p-6 ${containerClasses}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-primary-600" />
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>

      <ol className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={item.level === 3 ? 'ml-4' : ''}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-left w-full py-1 px-2 rounded transition-colors text-sm ${
                activeId === item.id
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2 text-gray-400">{index + 1}.</span>
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 hover:text-primary-600 transition-colors w-full"
        >
          <ChevronUp className="w-4 h-4" />
          Retour en haut
        </button>
      )}
    </nav>
  );
};

// Auto-generate TOC from page content (useful for dynamic content)
export const useAutoTOC = (containerRef: React.RefObject<HTMLElement>): TOCItem[] => {
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const headings = containerRef.current.querySelectorAll('h2, h3');
    const tocItems: TOCItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      
      // Ensure heading has an ID
      if (!heading.id && id) {
        heading.id = id;
      }

      tocItems.push({
        id: heading.id,
        title: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });

    setItems(tocItems);
  }, [containerRef]);

  return items;
};

export default TableOfContents;
