'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function BookingRedirectPage() {
  const router = useRouter();
  const bookingUrl = 'https://services.bookio.com/papi-hair-design/widget?lang=sk';

  useEffect(() => {
    window.location.href = bookingUrl;
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center py-12">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
      <h1 className="text-2xl font-bold">Presmerovávam na rezervačný systém...</h1>
      <p className="mt-2 text-muted-foreground">
        Ak nebudete presmerovaný automaticky,{' '}
        <a href={bookingUrl} className="underline font-semibold text-primary">
          kliknite sem
        </a>
        .
      </p>
    </div>
  );
}
