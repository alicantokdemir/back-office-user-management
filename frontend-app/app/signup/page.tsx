'use client';
import { SignupForm } from '@/components/signup-form';
import { useRouter } from 'next/navigation';

import { API_BASE_URL } from '@/constants/api';
import clientFetch from '@/lib/client-side-fetching';
import { AxiosError } from 'axios';

export default function Page() {
  const router = useRouter();

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      await clientFetch.post(`${API_BASE_URL}/auth/register`, data);

      await clientFetch.post(`${API_BASE_URL}/auth/login`, {
        email: data.email,
        password: data.password,
      });

      router.push('/dashboard');
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as { message: string };
      console.error('Signup failed:', data?.message || 'Unknown error');
      alert('Signup failed: ' + (data?.message || 'Unknown error'));
    }
  };

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);
    const formData = Object.fromEntries(data.entries());

    const splittedName = (formData.displayName as string).trim().split(' ');
    formData.firstName = splittedName.slice(0, -1).join(' ') || '';
    formData.lastName = splittedName.slice(-1).join('') || '';

    signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    } as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  );
}
