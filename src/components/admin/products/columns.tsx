"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/lib/types"
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
import { EditProductForm } from "./edit-product-form"
import { useState } from "react"
import { deleteDocumentNonBlocking } from "@/firebase"
import { doc, getFirestore } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export const columns = (): ColumnDef<Product>[] => [
  {
    accessorKey: "imageURL",
    header: "Obrázok",
    cell: ({ row }) => {
      const imageURL = row.getValue("imageURL") as string;
      const name = row.original.name;
      return (
        <Avatar>
          <AvatarImage src={imageURL} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Názov",
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
    id: "actions",
    cell: function Actions({ row }) {
      const product = row.original
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const firestore = getFirestore();

      const handleDelete = () => {
        const promise = () => new Promise<void>((resolve, reject) => {
            if (confirm(`Naozaj chcete zmazať "${product.name}"?`)) {
                const productRef = doc(firestore, 'products', product.id);
                deleteDocumentNonBlocking(productRef);
                resolve();
            } else {
                reject();
            }
        });

        toast.promise(promise, {
            loading: 'Deleting product...',
            success: 'Product successfully deleted!',
            error: 'Product deletion cancelled.',
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
                <DropdownMenuItem>Upraviť produkt</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">Zmazať produkt</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upraviť produkt</DialogTitle>
              <DialogDescription>
                Aktualizujte detaily produktu.
              </DialogDescription>
            </DialogHeader>
            <EditProductForm productToEdit={product} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
