'use client';
import { columns }from '@/components/admin/services/columns';
import { Service } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditServiceForm } from '@/components/admin/services/edit-service-form';
import { useState } from 'react';
import { PhdButton } from '@/components/ui/PhdButton';
import { ResourceTable } from '@/components/admin/ResourceTable';

export default function AdminServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Služby</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <PhdButton>Pridať službu</PhdButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pridať novú službu</DialogTitle>
              <DialogDescription>
                Vyplňte formulár a pridajte novú službu do cenníka.
              </DialogDescription>
            </DialogHeader>
            <EditServiceForm serviceToEdit={null} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ResourceTable<Service>
        collectionName="services"
        columns={columns()}
        filterColumnId="name"
        filterPlaceholder="Filtrovať podľa názvu..."
        orderByField="name"
      />
    </div>
  );
}
