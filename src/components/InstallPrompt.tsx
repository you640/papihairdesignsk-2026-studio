'use client';

import { useState, useEffect } from 'react';
import { PhdButton } from '@/components/ui/PhdButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';

// This interface is a subset of the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt({ dictionary }: { dictionary: any }) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we are on a mobile device and not in standalone mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
    
    if (isMobileDevice && !isRunningStandalone) {
      setIsMobile(true);
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setInstallEvent(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!installEvent) return;

    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // The prompt can only be used once.
    setInstallEvent(null);
    setIsVisible(false);
  };

  if (!isVisible || !isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", ease: "easeInOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-brand-secondary border-t border-primary/20 shadow-lg md:hidden"
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex-grow">
            <p className="font-semibold text-white">{dictionary.title}</p>
            <p className="text-sm text-neutral-400">{dictionary.description}</p>
          </div>
          <PhdButton onClick={handleInstallClick} className="shrink-0">
            <Package className="mr-2 h-4 w-4" />
            {dictionary.install_button}
          </PhdButton>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
