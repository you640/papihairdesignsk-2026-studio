'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PhdButton } from '@/components/ui/PhdButton';
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
import { useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { useState } from 'react';
import { uploadFile } from '@/lib/storage';
import { getStorage } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Názov produktu musí mať aspoň 2 znaky.'),
  description: z.string().min(10, 'Popis musí mať aspoň 10 znakov.'),
  price: z.coerce.number().positive('Cena musí byť kladné číslo.'),
  imageURL: z.string().optional(),
});

interface EditProductFormProps {
  productToEdit: Product | null;
  afterSave: () => void;
}

export function EditProductForm({ productToEdit, afterSave }: EditProductFormProps) {
  const firestore = useFirestore();
  const storage = getStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: productToEdit || {
      name: '',
      description: '',
      price: 0,
      imageURL: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firestore) return;

    setIsUploading(true);
    setUploadProgress(0);

    const promise = uploadFile(storage, `products/${Date.now()}_${file.name}`, file, setUploadProgress)
      .then(imageURL => {
          form.setValue('imageURL', imageURL);
          return imageURL;
      });

    toast.promise(promise, {
        loading: 'Nahrávam obrázok...',
        success: 'Obrázok bol úspešne nahraný!',
        error: 'Nahrávanie obrázku zlyhalo.'
    });

    try {
        await promise;
    } catch (error: any) {
        console.error("Error uploading file:", error);
    } finally {
        setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    
    const toastId = toast.loading(productToEdit ? 'Aktualizujem produkt...' : 'Vytváram produkt...');

    try {
        if (productToEdit) {
            const productRef = doc(firestore, 'products', productToEdit.id);
            setDocumentNonBlocking(productRef, values, { merge: true });
            toast.success("Produkt aktualizovaný", {
                id: toastId,
                description: `"${values.name}" bol úspešne aktualizovaný.`,
            });
        } else {
            const productsCollection = collection(firestore, 'products');
            addDocumentNonBlocking(productsCollection, values);
            toast.success("Produkt pridaný", {
                id: toastId,
                description: `"${values.name}" bol úspešne pridaný.`,
            });
        }
        afterSave();
    } catch(error: any) {
        console.error("Error saving product:", error);
         toast.error("Vyskytla sa chyba", {
            id: toastId,
            description: error.message,
        });
    }
  }

  const currentImageUrl = form.watch('imageURL');
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Názov produktu</FormLabel>
              <FormControl>
                <Input placeholder="napr. Hydratačný šampón" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popis</FormLabel>
              <FormControl>
                <Textarea placeholder="Popíšte produkt..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cena</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="32" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormItem>
            <FormLabel>Obrázok produktu</FormLabel>
            {currentImageUrl && !isUploading && (
                <div className="mt-2 mb-4 relative w-32 h-32">
                <Image src={currentImageUrl} alt="Product preview" fill className="rounded-md object-cover" />
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
          {isUploading ? 'Nahrávam...' : (isSubmitting ? 'Ukladám...' : (productToEdit ? 'Uložiť zmeny' : 'Vytvoriť produkt'))}
        </PhdButton>
      </form>
    </Form>
  );
}
