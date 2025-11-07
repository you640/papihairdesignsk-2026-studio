'use client';

import { columns } from '@/components/admin/blog/columns';
import { BlogPost } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditBlogPostForm } from '@/components/admin/blog/edit-blog-post-form';
import { useState } from 'react';
import { PhdButton } from '@/components/ui/PhdButton';
import { ResourceTable } from '@/components/admin/ResourceTable';

export default function AdminBlogPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <PhdButton>Pridať príspevok</PhdButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pridať nový príspevok</DialogTitle>
              <DialogDescription>
                Vyplňte formulár na vytvorenie nového blogového príspevku.
              </DialogDescription>
            </DialogHeader>
            <EditBlogPostForm postToEdit={null} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ResourceTable<BlogPost>
        collectionName="blogPosts"
        columns={columns()}
        filterColumnId="title"
        filterPlaceholder="Filtrovať podľa názvu..."
        orderByField="publishDate"
        orderByDirection="desc"
      />
    </div>
  );
}
