'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Service } from '@/lib/types';
import React from 'react';
import { Scissors, Paintbrush, Sparkles, ArrowRight } from 'lucide-react';


const serviceIcons: { [key: string]: React.ElementType } = {
  default: Scissors,
  Styling: Sparkles,
  Strih: Scissors,
  Farbenie: Paintbrush,
  "Spoločenské účesy": Sparkles,
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = serviceIcons[service.category] || serviceIcons.default;
  return (
    <Link href={`/cennik`} className="group block" passHref>
      <Card className="flex h-full flex-col text-left overflow-hidden transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="font-headline">{service.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{service.description}</p>
        </CardContent>
        <CardFooter className="mt-auto">
          <span className="text-sm font-semibold text-primary transition-all duration-300 group-hover:text-brand-gold-hover">
            Zobraziť detaily <ArrowRight className="inline-block ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
