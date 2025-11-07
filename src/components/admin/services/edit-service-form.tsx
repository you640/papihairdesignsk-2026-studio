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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Service } from '@/lib/types';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Názov služby musí mať aspoň 2 znaky.',
  }),
  description: z.string().min(10, {
    message: 'Popis musí mať aspoň 10 znakov.',
  }),
  price: z.coerce.number().positive({
    message: 'Cena musí byť kladné číslo.',
  }),
  duration: z.coerce.number().int().positive({
    message: 'Trvanie musí byť kladné číslo v minútach.',
  }),
  category: z.string({
    required_error: "Prosím, vyberte kategóriu."
  })
});

interface EditServiceFormProps {
  serviceToEdit: Service | null;
  afterSave: () => void;
}

export function EditServiceForm({ serviceToEdit, afterSave }: EditServiceFormProps) {
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: serviceToEdit || {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category: 'Styling',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    
    const toastId = toast.loading(serviceToEdit ? 'Aktualizujem službu...' : 'Vytváram službu...');

    try {
        if (serviceToEdit) {
            const serviceRef = doc(firestore, 'services', serviceToEdit.id);
            setDocumentNonBlocking(serviceRef, values, { merge: true });
            toast.success("Služba aktualizovaná", {
                id: toastId,
                description: `"${values.name}" bola úspešne aktualizovaná.`,
            });
        } else {
            const servicesCollection = collection(firestore, 'services');
            addDocumentNonBlocking(servicesCollection, values);
            toast.success("Služba pridaná", {
                id: toastId,
                description: `"${values.name}" bola úspešne pridaná.`,
            });
        }
        afterSave();
    } catch(error: any) {
        console.error("Error saving service:", error);
         toast.error("Vyskytla sa chyba", {
            id: toastId,
            description: error.message,
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Názov služby</FormLabel>
              <FormControl>
                <Input placeholder="napr. Dámsky strih" {...field} />
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
                <Textarea placeholder="Popíšte službu..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cena (€)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="75" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Trvanie (minúty)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Kategória</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Vyberte kategóriu" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Strih">Strih</SelectItem>
                    <SelectItem value="Farbenie">Farbenie</SelectItem>
                    <SelectItem value="Styling">Styling</SelectItem>
                    <SelectItem value="Spoločenské účesy">Spoločenské účesy</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <PhdButton type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Uložiť službu'}
        </PhdButton>
      </form>
    </Form>
  );
}
