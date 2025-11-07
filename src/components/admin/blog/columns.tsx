"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BlogPost } from "@/lib/types"
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
import { EditBlogPostForm } from "./edit-blog-post-form"
import { useState } from "react"
import { deleteDocumentNonBlocking } from "@/firebase"
import { doc, getFirestore } from "firebase/firestore"
import { format } from 'date-fns';
import { timestampToDate } from "@/lib/date-utils"
import { toast } from "sonner"

export const columns = (): ColumnDef<BlogPost>[] => [
  {
    accessorKey: "title",
    header: "Názov",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>
  },
  {
    accessorKey: "authorName",
    header: "Autor",
     cell: ({ row }) => row.original.authorName || 'N/A'
  },
  {
    accessorKey: "publishDate",
    header: "Dátum publikácie",
    cell: ({ row }) => {
      const date = timestampToDate(row.original.publishDate);
      return date ? format(date, 'd. M. yyyy') : 'N/A';
    }
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
      const post = row.original
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const firestore = getFirestore();

      const handleDelete = () => {
        const promise = () => new Promise<void>((resolve, reject) => {
          if (confirm(`Naozaj chcete zmazať "${post.title}"?`)) {
              const postRef = doc(firestore, 'blogPosts', post.id);
              deleteDocumentNonBlocking(postRef);
              resolve();
          } else {
            reject();
          }
        });
        
        toast.promise(promise, {
            loading: 'Deleting post...',
            success: 'Post successfully deleted!',
            error: 'Post deletion cancelled.',
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
                <DropdownMenuItem>Upraviť príspevok</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">Zmazať príspevok</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upraviť príspevok</DialogTitle>
              <DialogDescription>
                Aktualizujte detaily príspevku.
              </DialogDescription>
            </DialogHeader>
            <EditBlogPostForm postToEdit={post} afterSave={() => setIsDialogOpen(false)} />
          </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
