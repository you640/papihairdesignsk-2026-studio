import React from 'react';
import type { Locale } from '@/i18n-config';

// This layout is now simplified as the core logic is in the root layout.
// It just passes children through.
export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale }
}) {
  return <>{children}</>;
}
