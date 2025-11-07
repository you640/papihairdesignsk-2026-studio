'use client';

import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface DynamicGalleryProps {
  images: GalleryImage[];
}

export function DynamicGallery({ images }: DynamicGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
      {images.map((image) => (
        <div 
          key={image.id}
          className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 33vw"
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}
