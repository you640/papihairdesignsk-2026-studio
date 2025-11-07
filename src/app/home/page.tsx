'use server';
import {
  initializeFirebase,
} from '@/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { HomePageClient } from '@/components/home/HomePageClient';
import { Service, BlogPost, Stylist } from '@/lib/types';
import { getDictionary } from '@/get-dictionary';
import { timestampToDate, toSerializableTimestamp } from '@/lib/date-utils';
import { galleryImages } from '@/lib/gallery-data';

// Fisher-Yates (aka Knuth) Shuffle algorithm seeded by the day
function seededShuffle(array: any[], seed: number) {
  let currentIndex = array.length,  randomIndex;
  const pseudoRandom = () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(pseudoRandom() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function getServices(): Promise<Service[]> {
    const { firestore } = initializeFirebase();
    const servicesQuery = query(collection(firestore, 'services'), orderBy('name'), limit(3));
    const snapshot = await getDocs(servicesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Service);
}

async function getStylists(): Promise<Stylist[]> {
    const { firestore } = initializeFirebase();
    const stylistsQuery = query(collection(firestore, 'stylists'), limit(3));
    const snapshot = await getDocs(stylistsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Stylist);
}

function getGalleryImages() {
    const daySeed = new Date().getDate();
    const shuffledImages = seededShuffle([...galleryImages], daySeed);
    return shuffledImages.slice(0, 6);
}


export default async function Home() {
  const dictionary = await getDictionary();
  const dailyGalleryImages = getGalleryImages();

  const [services, stylists] = await Promise.all([
    getServices(),
    getStylists(),
  ]);

  return (
    <HomePageClient
      dictionary={dictionary}
      services={services || []}
      stylists={stylists || []}
      galleryImages={dailyGalleryImages}
    />
  );
}
