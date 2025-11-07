'use client';
import * as React from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    name: "Katarína H.",
    avatarId: "testimonial-1",
    rating: 5,
    text: "Absolútne najlepší strih v mojom živote! Papi je skutočný umelec. Vždy odchádzam maximálne spokojná a s pocitom, že moje vlasy vyzerajú lepšie ako kedykoľvek predtým. Profesionálny prístup a príjemné prostredie."
  },
  {
    name: "Martin K.",
    avatarId: "testimonial-2",
    rating: 5,
    text: "Konečne holičstvo, kde rozumejú mužským vlasom a brade. Perfektný strih, skvelá atmosféra a vždy dobrá nálada. Maťo je top! Odporúčam každému, kto hľadá kvalitu a štýl."
  },
  {
    name: "Lucia N.",
    avatarId: "testimonial-3",
    rating: 5,
    text: "Miška je kúzelníčka s farbami! Moja balayage vyzerá prirodzene a presne podľa mojich predstáv. Navyše mi poradila, ako sa o vlasy starať, aby farba vydržala čo najdlhšie. Ďakujem!"
  },
  {
    name: "Jana P.",
    avatarId: "testimonial-4",
    rating: 5,
    text: "Príjemné prostredie, profesionálny personál a výsledok, ktorý predčil moje očakávania. Po rokoch hľadania som konečne našla svoj salón. Vždy sa teším na ďalšiu návštevu."
  }
];

const Rating = ({ count }: { count: number }) => (
  <div className="flex items-center gap-1 text-primary">
    {[...Array(count)].map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-current" />
    ))}
  </div>
);

export default function Testimonials({ dictionary }: { dictionary: any }) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const getAvatarUrl = (id: string) => {
        const image = PlaceHolderImages.find(img => img.id === id);
        return image ? image.imageUrl : `https://picsum.photos/seed/${id}/100/100`;
    }

    return (
        <section className="py-16 lg:py-24">
            <div className="text-center">
                <Badge variant="outline" className="mb-4">{dictionary.badge}</Badge>
                <h2 className="font-headline text-3xl font-bold md:text-4xl">{dictionary.title}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    {dictionary.subtitle}
                </p>
            </div>

            <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto mt-12"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-4">
                            <Card className="h-full">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                    <Avatar className="w-20 h-20 mb-4 border-4 border-primary/20">
                                        <AvatarImage src={getAvatarUrl(testimonial.avatarId)} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-lg font-semibold font-headline">{testimonial.name}</h3>
                                    <Rating count={testimonial.rating} />
                                    <p className="text-muted-foreground mt-4 text-sm flex-grow">
                                        &ldquo;{testimonial.text}&rdquo;
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </section>
    );
}
