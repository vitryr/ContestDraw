import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, FileText, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';

const ONBOARDING_KEY = 'contestdraw_onboarding_completed';

export default function OnboardingModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const screens = [
    {
      icon: <Instagram className="w-16 h-16" />,
      color: 'from-pink-500 to-purple-500',
      title: t('onboarding.screen1.title'),
      description: t('onboarding.screen1.description')
    },
    {
      icon: <FileText className="w-16 h-16" />,
      color: 'from-cyan-500 to-blue-500',
      title: t('onboarding.screen2.title'),
      description: t('onboarding.screen2.description')
    },
    {
      icon: <Sparkles className="w-16 h-16" />,
      color: 'from-purple-500 to-pink-500',
      title: t('onboarding.screen3.title'),
      description: t('onboarding.screen3.description')
    }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="relative p-8">
              <Dialog.Close asChild>
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${screens[currentScreen].color} flex items-center justify-center text-white`}>
                    {screens[currentScreen].icon}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {screens[currentScreen].title}
                  </h2>

                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {screens[currentScreen].description}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-8">
                    {screens.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index === currentScreen
                            ? 'w-8 bg-primary-600'
                            : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {currentScreen < 2 ? (
                      <>
                        <button
                          onClick={handleSkip}
                          className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                          {t('onboarding.skip')}
                        </button>
                        <button
                          onClick={handleNext}
                          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                          {t('onboarding.next')}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleClose}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:opacity-90 transition-opacity"
                      >
                        {t('onboarding.done')}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
