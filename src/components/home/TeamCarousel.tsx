'use client';
import { Stylist } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { PhdButton } from "../ui/PhdButton";

interface TeamCarouselProps {
    stylists: Stylist[];
}

const getImageHint = (name: string) => {
    if (['Miška', 'Sophia Rossi'].includes(name)) {
        return 'female portrait';
    }
    return 'male portrait';
}

export function TeamCarousel({ stylists }: TeamCarouselProps) {
  return (
    <Carousel
        opts={{
            align: "start",
            loop: true,
        }}
        className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto mt-12"
    >
      <CarouselContent>
        {stylists.map((stylist) => (
          <CarouselItem key={stylist.id} className="md:basis-1/2 lg:basis-1/3">
             <div className="p-1">
                <Card className="group overflow-hidden text-center transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-card border-border">
                    <div className="relative h-96 w-full overflow-hidden">
                        <Image
                            src={stylist.photoURL || "https://picsum.photos/seed/1/400/500"}
                            alt={stylist.name}
                            width={400}
                            height={500}
                            data-ai-hint={getImageHint(stylist.name)}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                    <CardContent className="p-6 relative z-10 -mt-20 bg-card/50 backdrop-blur-sm m-4 rounded-lg border border-primary/20">
                        <h3 className="font-headline text-2xl font-semibold text-primary">{stylist.name}</h3>
                        <p className="text-sm font-semibold text-foreground">{stylist.specialty}</p>
                        <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{stylist.bio.substring(0, 70)}...</p>
                         <PhdButton asChild className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" disabled>
                            <Link href="#">Zobraziť profil</Link>
                        </PhdButton>
                    </CardContent>
                </Card>
             </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
