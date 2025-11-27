'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../../../components/ui/dialog';
import { DataTable } from './data-table';
import { UserForm } from './user-form';
import { columns } from './columns';
import { useContext, useEffect, useState } from 'react';
import { TableActionsContext } from './table-actions-provider';
import clientFetch from '../../../lib/client-side-fetching';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { API_BASE_URL } from '../../../constants/api';
import { PaginationState } from '@tanstack/react-table';
import { usePagination } from '../hooks/use-pagination';
import { useSorting } from '../hooks/use-sorting';

const mapSortingIdToField = (id: string) => {
  // Map the sorting ID from the table to the actual field names used in the backend
  const mapping: Record<string, string> = {
    userId: 'user.id',
    email: 'email',
    firstName: 'user.firstName',
    lastName: 'user.lastName',
    loginCount: 'user.loginCount',
    status: 'user.status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };
  return mapping[id] || id;
};

export default function UserList({
  users,
  totalItems,
}: {
  users: any[];
  totalItems: number;
}) {
  const { limit, onPaginationChange, skip, pagination } = usePagination();
  const { onSortingChange, sorting } = useSorting();

  const { selectedItem, setSelectedItem } = useContext(TableActionsContext)!;
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log('Selected item changed:', pagination, sorting);
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', ((pagination?.pageIndex || 0) + 1).toString());
    queryParams.set('itemsPerPage', (pagination?.pageSize || 5).toString());
    if (sorting.length > 0) {
      queryParams.set('sortBy', mapSortingIdToField(sorting[0].id));
      queryParams.set('sortOrder', sorting[0].desc ? 'DESC' : 'ASC');
    } else {
      queryParams.delete('sortBy');
      queryParams.delete('sortOrder');
    }
    const newUrl = `/dashboard?${queryParams.toString()}`;
    console.log('Updating URL to:', newUrl);
    router.push(newUrl);
  }, [limit, skip, pagination, sorting]);

  const onSubmit = async (data: any) => {
    // Handle form submission logic here
    console.log('Form submitted with data:', data);

    if (selectedItem && selectedItem.userId) {
      // Update existing user logic
      console.log('Updating user with ID:', selectedItem.userId);

      await updateUser(data, selectedItem.userId);
    } else {
      // Create new user logic
      console.log('Creating new user');

      await createUser(data);
    }
  };

  const createUser = async (data: User & { password: string }) => {
    try {
      await clientFetch.post(`${API_BASE_URL}/admin/create-user`, data);
      triggerDialog(false);

      router.push('/dashboard');
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };
      console.error('Create user failed:', data?.message || 'Unknown error');
      alert('Create user failed: ' + (data?.message || 'Unknown error'));
    }
  };

  const updateUser = async (
    data: User & { password: string },
    userId: string,
  ) => {
    let payload: Partial<User> & { password?: string } = data;
    if (data.password === '') {
      const { password, ...rest } = data;
      payload = rest;
    }

    try {
      await clientFetch.patch(
        `${API_BASE_URL}/admin/update-user/${userId}`,
        payload,
      );
      triggerDialog(false);

      router.push('/dashboard');
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };
      console.error('Update user failed:', data?.message || 'Unknown error');
      alert('Update user failed: ' + (data?.message || 'Unknown error'));
    }
  };

  const triggerDialog = (isOpen: boolean) => {
    console.log('Setting dialog open state to:', isOpen);
    setDialogOpen(isOpen);
    setSelectedItem({});
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={triggerDialog}>
      <DataTable
        data={users}
        columns={columns}
        rowCount={totalItems}
        onPaginationChange={onPaginationChange}
        pagination={pagination}
        onSortingChange={onSortingChange}
        sorting={sorting}
      />

      <DialogContent>
        <DialogTitle>User</DialogTitle>
        {selectedItem && <UserForm user={selectedItem} onSubmit={onSubmit} />}
      </DialogContent>
    </Dialog>
  );
}
