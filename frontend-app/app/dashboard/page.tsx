import { z } from 'zod';

import { UserNav } from './components/user-nav';
import { userSchema } from './data/schema';
import { ssrFetch } from '../../lib/server-side-fetching';
import ThemeChanger from '../../components/theme-changer';
import clientFetch from '../../lib/client-side-fetching';
import { API_BASE_URL } from '../../constants/api';
import { AxiosError } from 'axios';
import UserList from './components/user-list';
import { TableActionsProvider } from './components/table-actions-provider';

async function getUsers(searchParams: {
  page?: string;
  itemsPerPage?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const queryParams = new URLSearchParams({
    page: searchParams.page || '1',
    itemsPerPage: searchParams.itemsPerPage || '6',
    sortBy: searchParams.sortBy || 'createdAt',
    sortOrder: searchParams.sortOrder || 'DESC',
  });

  const pathNameWithParams = `/admin/list-users?${queryParams.toString()}`;

  const [result, error] = await ssrFetch<{
    data: {
      itemsPerPage: number;
      totalItems: number;
      currentPage: number;
      items: {
        id: string;
        firstName: string;
        lastName: string;
        status: string;
        loginCount: number;
      }[];
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    };
  }>(pathNameWithParams, {
    method: 'GET',
  });

  if (error) {
    console.error('Error fetching users:', error);
    return { items: [], totalItems: 0 };
  }

  if (!result || !result.data) {
    console.error('No users data found');
    return { items: [], totalItems: 0 };
  }

  return result.data;
}

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    itemsPerPage?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const qParams = await searchParams;
  const { items, totalItems } = await getUsers(qParams);

  const users = z.array(userSchema).parse(items);

  return (
    <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back!
            <ThemeChanger />
          </h2>
          <p className="text-muted-foreground">Here&apos;s a list of users.</p>
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </div>

      <TableActionsProvider>
        <UserList totalItems={totalItems} users={users} />
      </TableActionsProvider>
    </div>
  );
}
