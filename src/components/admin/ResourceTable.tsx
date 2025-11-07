'use client';

import { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, CollectionReference, query, orderBy, DocumentData } from 'firebase/firestore';
import { DataTable } from '@/components/admin/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';

interface ResourceTableProps<T extends { id: string }> {
  collectionName: string;
  columns: ColumnDef<T>[];
  filterColumnId: string;
  filterPlaceholder: string;
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';
}

const LoadingSkeleton = () => (
  <div className="rounded-md border">
    <div className="flex items-center p-4">
      <Skeleton className="h-10 w-64" />
    </div>
    <div className="p-4 space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

export function ResourceTable<T extends { id: string }>({
  collectionName,
  columns,
  filterColumnId,
  filterPlaceholder,
  orderByField = 'name',
  orderByDirection = 'asc',
}: ResourceTableProps<T>) {
  const firestore = useFirestore();

  const resourceCollectionQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, collectionName),
      orderBy(orderByField, orderByDirection)
    ) as CollectionReference<T>;
  }, [firestore, collectionName, orderByField, orderByDirection]);

  const { data: items, isLoading } = useCollection<T>(resourceCollectionQuery);

  if (isLoading || !items) {
    return <LoadingSkeleton />;
  }

  return (
    <DataTable
      columns={columns}
      data={items || []}
      filterColumnId={filterColumnId}
      filterPlaceholder={filterPlaceholder}
    />
  );
}
