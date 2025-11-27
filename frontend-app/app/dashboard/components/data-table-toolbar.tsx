'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';

import { statuses } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DialogTrigger } from '../../../components/ui/dialog';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <DialogTrigger asChild>
          <Button size="sm">Add User</Button>
        </DialogTrigger>
      </div>
    </div>
  );
}
