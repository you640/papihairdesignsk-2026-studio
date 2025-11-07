'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FirebaseClientProvider } from '@/firebase/provider';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PageTransition from '@/components/PageTransition';
import PushNotificationManager from '@/components/PushNotificationManager';
import { usePathname } from 'next/navigation';

type Theme = 'dark' | 'light';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function AppProvider({ 
  children,
  dictionary
}: { 
  children: React.ReactNode,
  dictionary: any 
}) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  if (!dictionary) {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background">
            {/* Minimal loading state if dictionary is not ready */}
        </div>
    );
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      <div className={cn('relative flex min-h-dvh flex-col bg-background font-body antialiased')}>
        <FirebaseClientProvider>
            <>
              <PushNotificationManager />
              <Header dictionary={dictionary.navigation} />
              <main className="flex-1">
                <PageTransition>
                    {children}
                </PageTransition>
              </main>
              <Footer dictionary={dictionary} />
            </>
          <Toaster richColors theme={theme} position="bottom-right" />
        </FirebaseClientProvider>
      </div>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
