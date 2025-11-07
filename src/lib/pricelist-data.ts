import type { LucideIcon } from 'lucide-react';
import { Scissors, Brush, Droplets, Gem, Sparkles, Diamond } from 'lucide-react';

export interface ServiceItem {
  service: string;
  duration?: string;
  price: string;
  description?: string;
}

export interface PricelistCategory {
  category: string;
  icon: LucideIcon;
  items: ServiceItem[];
}

export const panskyCennik: PricelistCategory[] = [
  {
    category: "Strihy a úprava vlasov",
    icon: Scissors,
    items: [
      { service: "Pánsky strih", price: "19 €" },
      { service: "Junior strih", price: "15 €" },
      { service: "Vlasy + brada", price: "27 €" },
      { service: "Pánsky špeciál", price: "50 €" },
    ],
  },
  {
    category: "Brada a fúzy",
    icon: Brush,
    items: [
      { service: "Úprava brady", price: "12 €" },
      { service: "Farbenie brady", price: "10 €" },
    ],
  },
  {
    category: "Farbenie a špeciálne techniky",
    icon: Droplets,
    items: [
      { service: "Tónovanie šedín", duration: "30 min.", price: "10 €" },
      { service: "Zosvetľovanie vlasov", duration: "1 h 30 min.", price: "40 €" },
      { service: "Trvalá ondulácia", duration: "1 h 30 min.", price: "40 €" },
    ],
  },
  {
    category: "Wellness & starostlivosť",
    icon: Gem,
    items: [
      { service: "Depilácia nosa", duration: "10 min.", price: "5 €" },
      { service: "Depilácia uší", duration: "10 min.", price: "5 €" },
      { service: "Peeling / čierna maska", duration: "25 min.", price: "10 €" },
      { service: "Ušné sviečky", duration: "20 min.", price: "10 €" },
    ],
  },
];

export const damskyCennik: PricelistCategory[] = [
  {
    category: "Strihy a styling",
    icon: Scissors,
    items: [
      { service: "Strih", duration: "1 h", price: "od 30 €", description: "umytie, strihanie, styling" },
      { service: "Finálny styling", duration: "30 min.", price: "od 20 €", description: "úprava účesu na konkrétnu príležitosť" },
      { service: "Spoločenský účes", duration: "1 h", price: "40 €", description: "detailný styling na spoločenské udalosti" },
      { service: "Fúkaná (polodlhé vlasy)", duration: "30 min.", price: "20 €" },
      { service: "Fúkaná (dlhé vlasy)", duration: "1 h", price: "30 €" },
    ],
  },
  {
    category: "Copríky a špeciálne účesy",
    icon: Sparkles,
    items: [
      { service: "Copíky / braids", duration: "4 h", price: "od 30 €", description: "komplexné pletenie a styling" },
    ],
  },
  {
    category: "Ošetrenie a keratín",
    icon: Diamond,
    items: [
      { service: "Brazílsky keratín", duration: "3 h", price: "od 130 €", description: "hlboká regenerácia a vyhladenie vlasov" },
      { service: "Methamorphyc exclusive", duration: "1 h 30 min.", price: "50 €", description: "exkluzívna kúra s intenzívnou starostlivosťou" },
      { service: "Methamorphyc quick", duration: "1 h", price: "od 35 €", description: "rýchla regenerácia a lesk vlasov" },
    ],
  },
  {
    category: "Farbenie a odlesky",
    icon: Droplets,
    items: [
      { service: "Farbenie (celé vlasy)", duration: "2 h", price: "70 €" },
      { service: "Farbenie (odrasty)", duration: "1 h 30 min.", price: "45 €" },
      { service: "Farbenie + strih (celé vlasy)", duration: "2 h", price: "90 €" },
      { service: "Farbenie + strih (odrasty)", duration: "2 h", price: "60 €" },
      { service: "Zosvetľovanie / gumovanie farby", duration: "4 h", price: "od 160 €" },
      { service: "Čistenie odleskov", duration: "3 h", price: "od 100 €" },
    ],
  },
  {
    category: "Melíry a balayage",
    icon: Brush,
    items: [
      { service: "Melír (odrasty)", duration: "3 h", price: "od 120 €" },
      { service: "Melír (celé vlasy)", duration: "4 h", price: "od 150 €" },
      { service: "Balayage (doplnenie odrastov)", duration: "3 h", price: "od 120 €" },
      { service: "Balayage (celé vlasy)", duration: "4 h", price: "od 150 €" },
      { service: "Airtouch (doplnenie odrastov)", duration: "4 h", price: "od 140 €" },
      { service: "Airtouch (celé vlasy)", duration: "5 h", price: "od 170 €" },
    ],
  },
  {
    category: "Predlžovanie vlasov",
    icon: Scissors,
    items: [
      { service: "Napojenie TAPE IN", duration: "1 h", price: "od 40 €" },
      { service: "Prepojenie TAPE IN", duration: "2 h 30 min.", price: "od 120 €" },
    ],
  },
];
