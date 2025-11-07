'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, setDocumentNonBlocking, addDocumentNonBlocking, useUser } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { useState } from 'react';
import { uploadFile } from '@/lib/storage';
import { getStorage } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { toast } from "sonner"
import { PhdButton } from '@/components/ui/PhdButton';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string().min(50, 'Content must be at least 50 characters.'),
  imageURL: z.string().optional(),
});

interface EditBlogPostFormProps {
  postToEdit: BlogPost | null;
  afterSave: () => void;
}

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export function EditBlogPostForm({ postToEdit, afterSave }: EditBlogPostFormProps) {
  const firestore = useFirestore();
  const storage = getStorage();
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: postToEdit || {
      title: '',
      content: '',
      imageURL: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firestore) return;

    setIsUploading(true);
    setUploadProgress(0);

    const promise = uploadFile(storage, `blog/${Date.now()}_${file.name}`, file, setUploadProgress)
      .then(imageURL => {
        form.setValue('imageURL', imageURL);
        return imageURL;
      });

    toast.promise(promise, {
      loading: 'Uploading image...',
      success: 'Image uploaded successfully!',
      error: 'Image upload failed.',
    });
    
    try {
        await promise;
    } catch (error) {
        console.error("Error uploading file:", error);
    } finally {
        setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) {
        toast.error("Authentication Error", { description: "You must be logged in to create a post." });
        return;
    };

    const slug = createSlug(values.title);
    const toastId = toast.loading(postToEdit ? 'Updating post...' : 'Creating post...');

    try {
      if (postToEdit) {
        const postRef = doc(firestore, 'blogPosts', postToEdit.id);
        const dataToUpdate = { ...values, slug };
        setDocumentNonBlocking(postRef, dataToUpdate, { merge: true });
        toast.success("Post Updated", { id: toastId, description: `"${values.title}" has been updated.` });
      } else {
        const postsCollection = collection(firestore, 'blogPosts');
        const newPost = {
            ...values,
            slug,
            authorId: user.uid,
            authorName: user.displayName || user.email,
            publishDate: serverTimestamp(),
        };
        addDocumentNonBlocking(postsCollection, newPost);
        toast.success("Post Created", { id: toastId, description: `"${values.title}" has been created.` });
      }
      afterSave();
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast.error("Something went wrong", { id: toastId, description: error.message });
    }
  }

  const currentImageUrl = form.watch('imageURL');
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 5 Tips for Healthy Summer Hair" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your blog post here..." {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
            <FormLabel>Featured Image</FormLabel>
            {currentImageUrl && !isUploading && (
            <div className="mt-2 mb-4 relative w-48 h-32">
                <Image src={currentImageUrl} alt="Post preview" fill className="rounded-md object-cover" />
            </div>
            )}
            <FormControl>
            <Input type="file" onChange={handleFileChange} accept="image/*" disabled={isUploading}/>
            </FormControl>
            {isUploading && <Progress value={uploadProgress} className="mt-2" />}
            <FormMessage />
        </FormItem>
        <PhdButton type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isUploading ? 'Nahrávam...' : (isSubmitting ? 'Ukladám...' : (postToEdit ? 'Uložiť zmeny' : 'Vytvoriť príspevok'))}
        </PhdButton>
      </form>
    </Form>
  );
}
