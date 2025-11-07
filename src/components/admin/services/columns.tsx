"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Service } from "@/lib/types"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditServiceForm } from "./edit-service-form"
import { useState } from "react"
import { deleteDocumentNonBlocking } from "@/firebase"
import { doc, getFirestore } from "firebase/firestore"
import { toast } from "sonner"

export const columns = (): ColumnDef<Service>[] => [
  {
    accessorKey: "name",
    header: "Názov",
  },
  {
    accessorKey: "category",
    header: "Kategória",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Cena</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("sk-SK", {
        style: "currency",
        currency: "EUR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-right">Trvanie (min)</div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue("duration")}</div>
    },
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
      const service = row.original
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const firestore = getFirestore();

      const handleDelete = () => {
        const promise = () => new Promise<void>((resolve, reject) => {
            if (confirm(`Naozaj chcete zmazať "${service.name}"?`)) {
                const serviceRef = doc(firestore, 'services', service.id);
                deleteDocumentNonBlocking(serviceRef);
                resolve();
            } else {
                reject();
            }
        });

        toast.promise(promise, {
            loading: 'Deleting service...',
            success: 'Service successfully deleted!',
            error: 'Service deletion cancelled.',
        });
      }

      return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Otvoriť menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akcie</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem>Upraviť službu</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">Zmazať službu</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upraviť službu</DialogTitle>
              <DialogDescription>
                Aktualizujte detaily služby.
              </DialogDescription>
            </DialogHeader>
            <EditServiceForm serviceToEdit={service} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
