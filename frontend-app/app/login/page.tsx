'use client';
import { LoginForm } from '@/components/login-form';

import { API_BASE_URL } from '@/constants/api';
import { useRouter } from 'next/navigation';
import clientFetch from '@/lib/client-side-fetching';
import { AxiosError } from 'axios';

export default function Page() {
  const router = useRouter();

  const login = async (data: { username: string; password: string }) => {
    try {
      await clientFetch.post(`${API_BASE_URL}/auth/login`, data);
      router.push('/dashboard');
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };
      console.error('Login failed:', data?.message || 'Unknown error');
      alert('Login failed: ' + (data?.message || 'Unknown error'));
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);
    const formData = Object.fromEntries(data.entries());

    login(formData as { username: string; password: string });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
