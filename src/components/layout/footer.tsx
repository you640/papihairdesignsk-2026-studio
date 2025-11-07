'use client';

import Link from "next/link";
import { PhdButton } from "@/components/ui/PhdButton";
import { getOpeningStatus } from "@/lib/openingHours";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const InstallPrompt = dynamic(() => import('@/components/InstallPrompt').then(mod => mod.default), { ssr: false });


const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/papi_hair_design/", name: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/papihairdesign/", name: "Facebook" },
];

export default function Footer({ dictionary }: { dictionary: any }) {
  const [openingStatus, setOpeningStatus] = useState({ isOpen: false, text: '' });
  const t = dictionary.footer;
  const openingHoursDict = t.opening_hours;

  useEffect(() => {
    const updateStatus = () => setOpeningStatus(getOpeningStatus(openingHoursDict));
    updateStatus();
    const interval = setInterval(updateStatus, 60000); 

    return () => clearInterval(interval);
  }, [openingHoursDict]);

  const navLinks = [
    { href: `/cennik`, label: t.pricelist },
  ];
  const bookingUrl = `https://services.bookio.com/papi-hair-design/widget?lang=sk`;
  const obchodUrl = `http://www.goldhaircare.sk/affiliate/2208`;

  return (
    <footer className="bg-brand-secondary text-neutral-300 font-body border-t-2 border-primary/20 relative">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_50%_-50%,rgba(212,175,55,0.15),transparent_70%)] -z-10" />
      <div className="container py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          
          <div className="md:col-span-1 lg:col-span-1 space-y-4">
            <h3 className="font-headline text-xl font-semibold text-white">PAPI Hair Design</h3>
            <div className="space-y-3 text-sm">
                <a href="https://www.google.com/maps/search/?api=1&query=Papi+Hair+Design+Trieda+SNP+61+Košice" target="_blank" rel="noopener noreferrer" className="flex items-start transition-colors hover:text-primary">
                    <MapPin className="h-4 w-4 mr-3 mt-1 shrink-0" />
                    <span>Trieda SNP 61, Košice</span>
                </a>
                <a href="tel:+421949459624" className="flex items-center transition-colors hover:text-primary" aria-label="Telefónne číslo">
                    <Phone className="h-4 w-4 mr-3 shrink-0" />
                    <span>+421 949 459 624</span>
                </a>
                <a href="mailto:papihairdesign@gmail.com" className="flex items-center transition-colors hover:text-primary" aria-label="Emailová adresa">
                    <Mail className="h-4 w-4 mr-3 shrink-0" />
                    <span>papihairdesign@gmail.com</span>
                </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-headline text-xl font-semibold text-white">{t.quick_links}</h3>
            <ul className="space-y-2 text-sm">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
               <li>
                  <a href={obchodUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                    {t.shop}
                  </a>
                </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline text-xl font-semibold text-white">{t.follow_us}</h3>
             <div className="flex space-x-4">
                {socialLinks.map((social) => (
                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="transition-colors hover:text-primary">
                    <social.icon className="h-6 w-6" />
                    </a>
                ))}
             </div>
             <p className="text-sm text-neutral-400">@papi_hair_design</p>
          </div>
          
          <div className="space-y-4">
             <h3 className="font-headline text-xl font-semibold text-white">{openingHoursDict.title}</h3>
             <ul className="space-y-1 text-sm">
                <li>{openingHoursDict.weekdays}: 08:00 - 17:00</li>
                <li>{openingHoursDict.weekends}: {openingHoursDict.closed}</li>
             </ul>
             <div className="pt-2">
                {openingStatus.text ? (
                    <span className={`flex items-center text-sm font-semibold ${openingStatus.isOpen ? 'text-green-400' : 'text-neutral-400'}`}>
                        <span className={`h-2 w-2 rounded-full mr-2 ${openingStatus.isOpen ? 'bg-green-400' : 'bg-neutral-500'}`}></span>
                        {openingStatus.text}
                    </span>
                ) : (
                    <span className="h-5 w-32 animate-pulse rounded-md bg-muted" />
                )}
             </div>
          </div>
        </div>
        
        <div className="mt-16 text-center border-t border-primary/20 pt-8">
            <PhdButton asChild className="mb-6">
                <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">{t.book_now}</Link>
            </PhdButton>
            <p className="text-xs text-neutral-500">&copy; {new Date().getFullYear()} PAPI Hair DESIGN. {t.rights_reserved}</p>
        </div>
      </div>
      <InstallPrompt dictionary={t.install_prompt} />
    </footer>
  );
}
