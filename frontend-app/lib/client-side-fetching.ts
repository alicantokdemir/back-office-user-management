'use client';

import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/api';

const clientFetch = axios.create({
  withCredentials: true,
});

function getAccessToken() {
  if (typeof document === 'undefined') return '';
  const cookie = document.cookie
    .split('; ')
    .find((c) => c.startsWith('accessToken='));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
}

clientFetch.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );

    // token should be already set in cookie by server

    return true;
  } catch (e) {
    console.error('Refresh failed');
    window.location.href = '/login'; // redirect to login
    throw e;
  }
}

clientFetch.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Not a 401 → reject normally
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // If retry flag already set → avoid infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    await refreshAccessToken();

    return clientFetch(originalRequest);
  },
);

export default clientFetch;
