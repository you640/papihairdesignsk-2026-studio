
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, DocumentData } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { timestampToDate, toSerializableTimestamp } from '@/lib/date-utils';

async function getPosts(): Promise<BlogPost[]> {
    const { firestore } = initializeFirebase();
    const blogQuery = query(collection(firestore, 'blogPosts'), orderBy('publishDate', 'desc'));
    const snapshot = await getDocs(blogQuery);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        const publishDate = timestampToDate(data.publishDate);
        return {
            ...data,
            id: doc.id,
            publishDate: toSerializableTimestamp(publishDate),
        } as BlogPost;
    });
}


export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="py-16 lg:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Zo štúdia</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Tipy, trendy a príbehy od našich štylistov.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block" passHref>
                  <Card 
                      className={cn(
                          "flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out",
                          "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                      )}
                  >
                    {post.imageURL && (
                      <div className="relative h-60 w-full overflow-hidden">
                        <Image
                          src={post.imageURL}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl transition-colors duration-300 group-hover:text-primary">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {/* Empty content to push footer down */}
                    </CardContent>
                    <CardFooter className="flex items-center text-sm text-muted-foreground">
                       <Avatar className="h-9 w-9 mr-3">
                          <AvatarFallback>{post.authorName?.charAt(0) || 'A'}</AvatarFallback>
                      </Avatar>
                      <div>
                          <div className="font-medium text-foreground">{post.authorName || 'PAPI Studio'}</div>
                          <div>{post.publishDate ? format(timestampToDate(post.publishDate), 'd. MMMM yyyy', { locale: sk }) : ''}</div>
                      </div>
                    </CardFooter>
                  </Card>
              </Link>
          ))
        ) : (
           <p className="col-span-full text-center text-muted-foreground">Nenašli sa žiadne príspevky. Skúste to znova neskôr!</p>
        )}
      </div>
    </div>
  );
}
