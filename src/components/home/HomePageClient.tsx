'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { PhdButton } from '@/components/ui/PhdButton';
import { Service, Stylist } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { FeaturesGrid } from './FeaturesGrid';
import { TeamCarousel } from './TeamCarousel';
import Testimonials from './Testimonials';
import { DynamicGallery } from './DynamicGallery';
import LuxuryHero from '@/components/LuxuryHero';

const ServiceCard = dynamic(() => import('./ServiceCard').then(mod => mod.ServiceCard));

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface HomePageClientProps {
  dictionary: any;
  services: Service[];
  stylists: Stylist[];
  galleryImages: GalleryImage[];
}

export function HomePageClient({ 
  dictionary,
  services,
  stylists,
  galleryImages
}: HomePageClientProps) {
  
  const t = dictionary.home;
  const bookingUrl = `https://services.bookio.com/papi-hair-design/widget?lang=sk`;

  return (
    <div className="flex flex-col">
      <LuxuryHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* About Us Snippet */}
        <section className="py-16 lg:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <Badge variant="outline" className="mb-4">{t.about_us_badge}</Badge>
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                {t.about_us_title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t.about_us_p1}
              </p>
            </div>
            <div className="order-1 h-80 w-full overflow-hidden rounded-lg shadow-lg md:order-2 md:h-96">
              <Image
                  src="https://cloud.papihairdesign.sk/wp-content/uploads/2025/11/salon.jpg"
                  alt="Stylist carefully cutting a client's hair"
                  data-ai-hint="haircut styling"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* --- NEW FEATURES GRID --- */}
        <FeaturesGrid dictionary={dictionary.features_grid} />
      </div>

      {/* Services Section */}
      <section className="bg-card py-16 lg:py-24">
        <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            {t.services_title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            {t.services_subtitle}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <PhdButton asChild variant="outline" className="mt-12">
            <Link href={`/cennik`}>{t.services_all}</Link>
          </PhdButton>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Meet Our Team */}
        <section className="py-16 lg:py-24">
          <div className="text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                  {t.team_title}
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
                  {t.team_subtitle}
              </p>
          </div>
          <TeamCarousel stylists={stylists} />
          <div className="mt-12 text-center">
              <PhdButton asChild>
                  <Link href="/onas">Spoznajte celý tím</Link>
              </PhdButton>
          </div>
        </section>
      </div>
      
      {/* --- NEW DYNAMIC GALLERY SECTION --- */}
      <section className="bg-card py-16 lgpy-24">
        <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="font-headline text-3xl font-bold md:text-4xl">
            {t.gallery_title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            {t.gallery_subtitle}
          </p>
          <div className="mt-12">
            <DynamicGallery images={galleryImages} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* --- NEW TESTIMONIALS SECTION --- */}
        <Testimonials dictionary={dictionary.testimonials} />
      </div>

    </div>
  );
}
