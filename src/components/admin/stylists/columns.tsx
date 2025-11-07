"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Stylist } from "@/lib/types"
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
import { EditStylistForm } from "./edit-stylist-form"
import { useState } from "react"
import { deleteDocumentNonBlocking } from "@/firebase"
import { doc, getFirestore } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export const columns = (): ColumnDef<Stylist>[] => [
  {
    accessorKey: "photoURL",
    header: "Fotka",
    cell: ({ row }) => {
      const photoURL = row.getValue("photoURL") as string;
      const name = row.original.name;
      return (
        <Avatar>
          <AvatarImage src={photoURL} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Meno",
  },
  {
    accessorKey: "specialty",
    header: "Špecializácia",
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
      const stylist = row.original
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const firestore = getFirestore();

      const handleDelete = () => {
        const promise = () => new Promise<void>((resolve, reject) => {
            if (confirm(`Naozaj chcete zmazať "${stylist.name}"?`)) {
                const stylistRef = doc(firestore, 'stylists', stylist.id);
                deleteDocumentNonBlocking(stylistRef);
                resolve();
            } else {
                reject();
            }
        });

        toast.promise(promise, {
            loading: 'Deleting stylist...',
            success: 'Stylist successfully deleted!',
            error: 'Stylist deletion cancelled.',
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
                <DropdownMenuItem>Upraviť štylistu</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">Zmazať štylistu</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upraviť štylistu</DialogTitle>
              <DialogDescription>
                Aktualizujte detaily štylistu.
              </DialogDescription>
            </DialogHeader>
            <EditStylistForm stylistToEdit={stylist} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
