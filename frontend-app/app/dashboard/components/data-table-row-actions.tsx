'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { userSchema } from '../data/schema';
import { AxiosError } from 'axios';
import { API_BASE_URL } from '../../../constants/api';
import clientFetch from '../../../lib/client-side-fetching';
import { useRouter } from 'next/navigation';
import { DialogTrigger } from '../../../components/ui/dialog';
import { TableActionsContext } from './table-actions-provider';
import { useContext } from 'react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  const { setSelectedItem } = useContext<any>(TableActionsContext);

  const onDelete = async () => {
    const userId = (row.original as any).userId;
    console.log('Delete user with ID:', userId);
    // Implement deletion logic here
    const isConfirmed = confirm('Are you sure you want to delete this user?');

    if (isConfirmed) {
      // Call API to delete user
      try {
        await clientFetch.delete(`${API_BASE_URL}/admin/remove-user/${userId}`);
        router.push('/dashboard');
      } catch (error) {
        const err = error as AxiosError;
        const data = err.response?.data as { message: string };
        console.log(`User with ID ${userId} deleted.`);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted size-8"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DialogTrigger asChild>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSelectedItem(row.original);
            }}
          >
            Edit
          </DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} variant="destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
