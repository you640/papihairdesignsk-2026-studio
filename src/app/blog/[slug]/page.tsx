import { notFound } from 'next/navigation';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, limit, getDocs, DocumentData } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Metadata } from 'next';
import { timestampToDate, toSerializableTimestamp } from '@/lib/date-utils';

const POSTS = [
  {
    slug: 'mock-post-1',
    title: 'Mock post 1',
    content: '<p>Toto je testovací obsah pre mock post 1.</p>',
  },
  {
    slug: 'mock-post-2',
    title: 'Mock post 2',
    content: '<p>Toto je testovací obsah pre mock post 2.</p>',
  },
];

// This function tells Next.js to pre-render all blog posts at build time
// MOCK: Pre static export build bez Firestore connectivity
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

async function getPost(slug: string): Promise<BlogPost | null> {
  // Guard: if slug is undefined, null, or empty, return null immediately
  if (!slug) {
    return null;
  }
  // Fallback pre mockované slugs
  if (slug === "mock-post-1") {
    return {
      id: "mock-post-1",
      slug: "mock-post-1",
      title: "Mockovaný blogový príspevok 1",
      authorId: "mock-author-1",
      authorName: "Mock Autor",
      publishDate: toSerializableTimestamp(new Date()),
      content: "Toto je ukážkový obsah mockovaného blogového príspevku 1.",
      imageURL: "https://placehold.co/600x400?text=Mock+Image+1"
    };
  }
  if (slug === "mock-post-2") {
    return {
      id: "mock-post-2",
      slug: "mock-post-2",
      title: "Mockovaný blogový príspevok 2",
      authorId: "mock-author-2",
      authorName: "Mock Autor",
      publishDate: toSerializableTimestamp(new Date()),
      content: "Toto je ukážkový obsah mockovaného blogového príspevku 2.",
      imageURL: "https://placehold.co/600x400?text=Mock+Image+2"
    };
  }
  // Pôvodný Firestore fetch pre reálne slugs
  const { firestore } = initializeFirebase();
  const postQuery = query(
    collection(firestore, 'blogPosts'),
    where('slug', '==', slug),
    limit(1)
  );
  const snapshot = await getDocs(postQuery);
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  const data = doc.data() as DocumentData;
  const publishDate = timestampToDate(data.publishDate);
  return {
    ...data,
    id: doc.id,
    publishDate: toSerializableTimestamp(publishDate),
  } as BlogPost;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const excerpt = post.content.substring(0, 155).replace(/<[^>]*>?/gm, '') + '...';
  const publishDate = timestampToDate(post.publishDate);

  return {
    title: `PAPI Hair Studio | ${post.title}`,
    description: excerpt,
    openGraph: {
        title: post.title,
        description: excerpt,
        type: 'article',
        publishedTime: publishDate.toISOString(),
        authors: [post.authorName || 'PAPI Studio'],
        images: post.imageURL ? [{ url: post.imageURL }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
      return (
    <article className="py-16 lg:py-24 text-center">
    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mt-2">Post Not Found</h1>
    <p className="mt-6 text-lg text-muted-foreground">Tento blogový príspevok neexistuje alebo nie je dostupný.</p>
    </article>
  );
  }

  const publishDate = timestampToDate(post.publishDate);

  return (
  <article className="py-16 lg:py-24">
    {post.imageURL && (
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={post.imageURL}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>
    )}
    <header className="text-center mb-12">
      <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mt-2">{post.title}</h1>
      <div className="flex items-center justify-center space-x-4 mt-6 text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{post.authorName?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{post.authorName || 'PAPI Studio'}</span>
        </div>
        <span>•</span>
        <time dateTime={publishDate.toISOString()}>
          {format(publishDate, 'd. MMMM yyyy', { locale: sk })}
        </time>
      </div>
    </header>

    <div className="prose dark:prose-invert max-w-4xl mx-auto prose-lg lg:prose-xl"
      dangerouslySetInnerHTML={{ __html: post.content.replace(/\\n/g, '<br />') }}
    />
  </article>
  );
}
