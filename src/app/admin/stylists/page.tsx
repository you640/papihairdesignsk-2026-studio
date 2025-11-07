'use client';

import { columns } from '@/components/admin/stylists/columns';
import { Stylist } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditStylistForm } from '@/components/admin/stylists/edit-stylist-form';
import { useState } from 'react';
import { PhdButton } from '@/components/ui/PhdButton';
import { ResourceTable } from '@/components/admin/ResourceTable';

export default function AdminStylistsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Štylisti</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <PhdButton>Pridať štylistu</PhdButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pridať nového štylistu</DialogTitle>
              <DialogDescription>
                Vyplňte formulár a pridajte nového štylistu.
              </DialogDescription>
            </DialogHeader>
            <EditStylistForm stylistToEdit={null} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ResourceTable<Stylist>
        collectionName="stylists"
        columns={columns()}
        filterColumnId="name"
        filterPlaceholder="Filtrovať podľa mena..."
        orderByField="name"
      />
    </div>
  );
}
