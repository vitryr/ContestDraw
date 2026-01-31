import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  defaultOpenIndex?: number;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  items,
  title = "Questions Fréquentes",
  subtitle,
  className = '',
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-12 ${className}`} aria-labelledby="faq-title">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 
            id="faq-title" 
            className="text-3xl font-bold text-white mb-3"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-ink-secondary text-lg">{subtitle}</p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-lg overflow-hidden bg-bg-elevated shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="font-semibold text-white text-lg pr-4">
                  {item.question}
                </h3>
                <span className="flex-shrink-0 text-primary-600">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-ink-secondary leading-relaxed border-t border-white/10 pt-4">
                      {/* Support for HTML content with links */}
                      <div 
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                        className="prose prose-sm max-w-none prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
