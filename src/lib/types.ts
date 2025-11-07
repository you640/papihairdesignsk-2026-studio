import { Timestamp } from 'firebase/firestore';

// Define a serializable timestamp for server-client data transfer
export interface SerializableTimestamp {
    seconds: number;
    nanoseconds: number;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
}

export interface Stylist {
    id: string;
    name: string;
    bio: string;
    specialty: string;
    photoURL?: string;
}

export interface GalleryItem {
    id: string;
    imageURL: string;
    alt: string;
    category: string;
    order?: number;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageURL?: string;
    authorId: string;
    authorName?: string; // Denormalized for display
    publishDate: Date | Timestamp | SerializableTimestamp; // Allow multiple types for flexibility
}

export interface Appointment {
    id: string;
    userId: string;
    stylistId: string;
    serviceId: string;
    startTime: Timestamp;
    endTime: Timestamp;
    status: 'booked' | 'confirmed' | 'cancelled';
    serviceName: string; // Denormalized
    stylistName: string; // Denormalized
    price: number; // Denormalized
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL?: string;
}
