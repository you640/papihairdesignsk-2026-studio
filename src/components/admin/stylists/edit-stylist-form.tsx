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
import { Stylist } from '@/lib/types';
import { useState } from 'react';
import { uploadFile } from '@/lib/storage';
import { getStorage } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Meno štylistu musí mať aspoň 2 znaky.',
  }),
  bio: z.string().min(10, {
    message: 'Bio musí mať aspoň 10 znakov.',
  }),
  specialty: z.string().min(3, {
    message: 'Špecializácia musí mať aspoň 3 znaky.',
  }),
  photoURL: z.string().optional(),
});

interface EditStylistFormProps {
  stylistToEdit: Stylist | null;
  afterSave: () => void;
}

export function EditStylistForm({ stylistToEdit, afterSave }: EditStylistFormProps) {
  const firestore = useFirestore();
  const storage = getStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: stylistToEdit || {
      name: '',
      bio: '',
      specialty: '',
      photoURL: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firestore) return;

    setIsUploading(true);
    setUploadProgress(0);

    const promise = uploadFile(storage, `stylists/${Date.now()}_${file.name}`, file, setUploadProgress)
        .then(photoURL => {
            form.setValue('photoURL', photoURL);
            return photoURL;
        });

    toast.promise(promise, {
        loading: 'Nahrávam fotku...',
        success: 'Fotka bola úspešne nahraná!',
        error: 'Nahrávanie fotky zlyhalo.'
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
    
    const toastId = toast.loading(stylistToEdit ? 'Aktualizujem štylistu...' : 'Vytváram štylistu...');
    
    try {
        if (stylistToEdit) {
            const stylistRef = doc(firestore, 'stylists', stylistToEdit.id);
            setDocumentNonBlocking(stylistRef, values, { merge: true });
            toast.success("Štylista aktualizovaný", {
                id: toastId,
                description: `"${values.name}" bol úspešne aktualizovaný.`,
            });
        } else {
            const stylistsCollection = collection(firestore, 'stylists');
            addDocumentNonBlocking(stylistsCollection, values);
            toast.success("Štylista pridaný", {
                id: toastId,
                description: `"${values.name}" bol úspešne pridaný.`,
            });
        }
        afterSave();
    } catch(error: any) {
        console.error("Error saving stylist:", error);
         toast.error("Vyskytla sa chyba", {
            id: toastId,
            description: error.message,
        });
    }
  }

  const currentImageUrl = form.watch('photoURL');
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meno štylistu</FormLabel>
              <FormControl>
                <Input placeholder="napr. Jana Nováková" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Špecializácia</FormLabel>
              <FormControl>
                <Input placeholder="napr. Expert na farbenie a balayage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Popíšte štylistu..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
            <FormLabel>Profilová fotka</FormLabel>
            {currentImageUrl && !isUploading && (
            <div className="mt-2 mb-4 relative w-24 h-24">
                <Image src={currentImageUrl} alt="Stylist preview" fill className="rounded-full object-cover" />
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
          {isUploading ? 'Nahrávam...' : (isSubmitting ? 'Ukladám...' : 'Uložiť štylistu')}
        </PhdButton>
      </form>
    </Form>
  );
}
