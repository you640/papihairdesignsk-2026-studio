
import { initializeFirebase } from '@/firebase';
import { collection, query, where, limit, getDocs, DocumentData } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { timestampToDate, toSerializableTimestamp } from '@/lib/date-utils';

// This function tells Next.js to pre-render all blog posts at build time
export async function generateStaticParams() {
  const { firestore } = initializeFirebase();
  const postsCollection = collection(firestore, 'blogPosts');
  const snapshot = await getDocs(postsCollection);
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

async function getPost(slug: string): Promise<BlogPost | null> {
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
    notFound();
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

        <div 
            className="prose dark:prose-invert max-w-4xl mx-auto prose-lg lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\\n/g, '<br />') }}
        />
    </article>
  );
}
