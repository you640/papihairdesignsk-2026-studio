'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import { PhdButton } from '@/components/ui/PhdButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: "Papi",
    specialty: "Pánske Strihy & Barbering",
    description: "Zakladateľ salónu s 15-ročnými skúsenosťami. Špecialista na moderné pánske strihy a úpravu brady.",
    imageUrl: "https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/papi.webp",
    imageHint: "man portrait",
    gallery: [
      "https://cloud.papihairdesign.sk/wp-content/uploads/2024/05/papi-hair-design-kosice-kadernictvo-holicstvo-pansky-strih-1.webp",
      "https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/papi.webp",
      "https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/mato.webp"
    ]
  },
  {
    name: "Miška",
    specialty: "Balayage & Kreatívne Farbenie",
    description: "Expertka na farbenie a zložité techniky ako balayage a ombré. S kreatívnym prístupom a vášňou pre farby.",
    imageUrl: "https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/miska.webp",
    imageHint: "female portrait",
    gallery: [
      "https://cloud.papihairdesign.sk/wp-content/uploads/2024/05/papi-hair-design-kosice-kadernictvo-holicstvo-balayage-1.webp",
      "https://cloud.papihairdesign.sk/wp-content/uploads/2024/05/papi-hair-design-kosice-kadernictvo-holicstvo-balayage-5.webp",
      "https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/miska.webp"
    ]
  },
  {
    name: "Maťo",
    specialty: "Pánske Strihy & Barbering",
    description: "Všestranný barber so zameraním na precízne pánske strihy a tradičné holenie. Jeho cieľom je, aby sa každý zákazník cítil dokonale upravený.",
    imageUrl: "https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/mato.webp",
    imageHint: "male portrait",
    gallery: [
       "https://cloud.papihairdesign.sk/wp-content/uploads/2024/05/papi-hair-design-kosice-kadernictvo-holicstvo-spolocensky-uces-1.webp",
       "https://cloud.papihairdesign.sk/wp-content/uploads/2024/05/papi-hair-design-kosice-kadernictvo-holicstvo-balayage-1.webp",
       "https://cloud.papihairdesign.sk/wp-content/uploads/2025/10/mato.webp"
    ]
  }
];

type TeamMember = typeof teamMembers[0];

const StylistModal = ({ stylist, bookingUrl }: { stylist: TeamMember, bookingUrl: string }) => (
  <DialogContent className="sm:max-w-3xl">
    <DialogHeader>
      <DialogTitle className="font-headline text-3xl text-primary">{stylist.name}</DialogTitle>
      <DialogDescription className="text-base">{stylist.specialty}</DialogDescription>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      <div className="relative h-96 w-full overflow-hidden rounded-lg">
        <Image
          src={stylist.imageUrl}
          alt={stylist.name}
          fill
          data-ai-hint={stylist.imageHint}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-lg mb-2">O stylistovi</h3>
        <p className="text-muted-foreground mb-4">{stylist.description}</p>
        <h3 className="font-semibold text-lg mb-3">Ukážky práce</h3>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {stylist.gallery.map((img, index) => (
            <div key={index} className="relative h-24 w-full overflow-hidden rounded-md">
              <Image src={img} alt={`Práca od ${stylist.name} ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <PhdButton asChild className="w-full">
            <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Rezervovať termín u {stylist.name.replace(/a$/,"y")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </PhdButton>
        </div>
      </div>
    </div>
  </DialogContent>
);

export default function OnasPage() {
  const bookingUrl = `https://services.bookio.com/papi-hair-design/widget?lang=sk`;

  return (
    <div className="py-16 lg:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Náš Tím Expertov</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Zoznámte sa s talentovanými stylistami, ktorí stoja za úspechom PAPI HAIR DESIGN. Každý z nich prináša jedinečné zručnosti a vášeň pre vlasový design.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Dialog key={member.name}>
              <Card className="group relative w-full overflow-hidden rounded-lg shadow-lg transition-all duration-500 ease-in-out hover:shadow-primary/20 hover:scale-105 border-transparent hover:border-primary/30">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={400}
                  height={500}
                  data-ai-hint={member.imageHint}
                  className="h-[500px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ height: 'auto' }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="font-headline text-3xl font-bold text-white transition-transform duration-300 group-hover:-translate-y-2">
                    {member.name}
                  </h3>
                  <p className="font-semibold text-primary">{member.specialty}</p>
                  <div className="mt-4 h-px w-12 bg-primary transition-all duration-300 group-hover:w-24" />
                  {/* Content visible on hover */}
                  <div className="mt-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <p className="text-sm text-neutral-300 mb-4">{member.description}</p>
                      <DialogTrigger asChild>
                          <PhdButton>Zobraziť profil</PhdButton>
                      </DialogTrigger>
                  </div>
                </div>
              </Card>
              <StylistModal stylist={member} bookingUrl={bookingUrl} />
            </Dialog>
          ))}
      </div>
    </div>
  );
}
