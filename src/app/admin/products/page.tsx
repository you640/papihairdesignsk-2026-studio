'use client';
import { columns } from '@/components/admin/products/columns';
import { Product } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditProductForm } from '@/components/admin/products/edit-product-form';
import { useState } from 'react';
import { PhdButton } from '@/components/ui/PhdButton';
import { ResourceTable } from '@/components/admin/ResourceTable';

export default function AdminProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Produkty</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <PhdButton>Pridať produkt</PhdButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pridať nový produkt</DialogTitle>
              <DialogDescription>
                Vyplňte formulár a pridajte nový produkt.
              </DialogDescription>
            </DialogHeader>
            <EditProductForm productToEdit={null} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ResourceTable<Product>
        collectionName="products"
        columns={columns()}
        filterColumnId="name"
        filterPlaceholder="Filtrovať podľa názvu..."
        orderByField="name"
      />
    </div>
  );
}
