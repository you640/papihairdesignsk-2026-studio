import { MetadataRoute } from 'next';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { timestampToDate } from '@/lib/date-utils';

const BASE_URL = 'https://papi-hair.web.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { firestore } = initializeFirebase();

  // Statické stránky
  const staticRoutes = [
    '/home',
    '/onas',
    '/blog',
    '/cennik',
    '/login',
    '/signup',
    '/obchod'
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '/home' ? 1.0 : 0.8,
  }));

  // Dynamické stránky - Blog
  const blogPostsCollection = collection(firestore, 'blogPosts');
  const blogSnapshot = await getDocs(blogPostsCollection);
  const blogPosts = blogSnapshot.docs.map(doc => doc.data() as BlogPost);
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: timestampToDate(post.publishDate).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
