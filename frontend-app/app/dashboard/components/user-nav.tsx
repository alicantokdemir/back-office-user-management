'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import clientFetch from '../../../lib/client-side-fetching';
import { API_BASE_URL } from '../../../constants/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export function UserNav() {
  const router = useRouter();

  const logout = async () => {
    try {
      await clientFetch.post(`${API_BASE_URL}/auth/logout`, {});
      router.push('/login');
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };
      console.error('Logout failed:', data?.message || 'Unknown error');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="relative h-9 px-4 font-semibold tracking-wide"
          aria-label="Open user menu"
        >
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
