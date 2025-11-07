'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { sk } from 'date-fns/locale';
import { timestampToDate } from '@/lib/date-utils';
import Image from 'next/image';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block" passHref>
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
        {post.imageURL && (
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={post.imageURL}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="font-headline text-xl transition-colors duration-300 group-hover:text-primary">{post.title}</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center text-sm text-muted-foreground mt-auto">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarFallback>{post.authorName?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div>
            <div>{post.authorName || 'PAPI Studio'}</div>
            <div>{post.publishDate ? format(timestampToDate(post.publishDate), 'd. MMMM yyyy', { locale: sk }) : ''}</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
