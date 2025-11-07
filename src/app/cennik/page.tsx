import { damskyCennik, panskyCennik, type PricelistCategory, ServiceItem } from '@/lib/pricelist-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PhdButton } from '@/components/ui/PhdButton';
import Link from 'next/link';
import { Check } from 'lucide-react';

const PricelistCard = ({ service, bookingUrl }: { service: ServiceItem, bookingUrl: string }) => {
  return (
    <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-1.5">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{service.service}</CardTitle>
        <p className="text-3xl font-headline font-bold text-primary pt-2">{service.price}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2 text-sm text-muted-foreground">
            {service.description && (
                 <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                    <span>{service.description}</span>
                </li>
            )}
            {service.duration && (
                 <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                    <span>Trvanie: {service.duration}</span>
                </li>
            )}
        </ul>
      </CardContent>
      <CardFooter>
        <PhdButton asChild className="w-full">
            <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">Rezervovať termín</Link>
        </PhdButton>
      </CardFooter>
    </Card>
  );
};


export default async function CennikPage() {
  const defaultTab = 'damy';
  const bookingUrl = `https://services.bookio.com/papi-hair-design/widget?lang=sk`;

  const renderCategory = (category: PricelistCategory) => (
    <div key={category.category} className="mb-12">
      <h2 className="font-headline text-3xl font-bold mb-6 flex items-center gap-4">
        <category.icon className="h-8 w-8 text-primary" />
        {category.category}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {category.items.map((item) => (
          <PricelistCard key={item.service} service={item} bookingUrl={bookingUrl} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-16 lg:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Cenník služieb</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Prehľad cien našich profesionálnych kaderníckych služieb. Ceny sú orientačné a môžu sa líšiť podľa náročnosti úkonu a spotreby materiálu.
        </p>
      </div>
      
      <div className="mt-16">
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12 mb-12">
                <TabsTrigger value="damy" className="text-base font-semibold">Dámske služby</TabsTrigger>
                <TabsTrigger value="pani" className="text-base font-semibold">Pánske služby</TabsTrigger>
            </TabsList>
            
            <TabsContent value="damy">
                {damskyCennik.map(renderCategory)}
            </TabsContent>
            
            <TabsContent value="pani">
                {panskyCennik.map(renderCategory)}
            </TabsContent>
        </Tabs>
    </div>
    </div>
  );
}
