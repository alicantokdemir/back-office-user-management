import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '@/constants/api';

export async function ssrFetch<O, I = undefined>(
  pathname: string,
  options: {
    method: string;
    body?: I;
    next?: NextFetchRequestConfig;
  },
): Promise<[O | null, Error | null]> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value || '';

  let response: Response;

  try {
    response = await attemptFetch(pathname, options, accessToken);
  } catch (error) {
    console.error('Fetch error:', error);
    return [null, error as Error];
  }

  if (response.status === 401) {
    // try refresh token
    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: cookieStore.toString() },
    });

    const accessToken = refreshRes.headers
      .get('set-cookie')
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith('accessToken='))
      ?.split('=')[1];

    if (!refreshRes.ok || !accessToken) {
      redirect('/login');
    }

    // retry original request
    response = await attemptFetch(pathname, options, accessToken);
  }

  const data = (await response.json()) as O;
  return [data, null];
}

async function attemptFetch<I = undefined>(
  pathname: string,
  options: { method: string; body?: I; next?: NextFetchRequestConfig },
  accessToken: string,
): Promise<Response> {
  const cookieStore = await cookies();

  return fetch(`${API_BASE_URL}${pathname}`, {
    method: options.method,
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    next: { revalidate: 0, ...options.next },
  });
}
