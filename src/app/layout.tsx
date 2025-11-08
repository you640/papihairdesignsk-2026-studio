import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { i18n } from '@/i18n-config';
import { AppProvider } from '@/components/layout/AppProvider';
import './globals.css';
import { getDictionary } from '@/get-dictionary';

// Font definitions remain in the server component
const inter = Inter({
  subsets: ['latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// Metadata is correctly exported from a Server Component
export const metadata: Metadata = {
  title: 'PAPI Hair DESIGN Studio',
  description: 'Profesionálne kadernícke štúdio v Košiciach.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: "/favicon.ico",
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/favicon.ico',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary();

  return (
    <html lang={i18n.defaultLocale} className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* meta[name=theme-color] is not supported by Firefox, Firefox for Android, Opera. Supported by Chrome/Edge for PWA. Safe to keep for best PWA experience. */}
        <meta name="theme-color" content="#D4AF37" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HairSalon",
            "name": "PAPI Hair Design",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "52"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Trieda SNP 61",
              "addressLocality": "Košice",
              "addressCountry": "SK"
            }
          })
        }} />
      </head>
      <body>
        <AppProvider dictionary={dictionary}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
