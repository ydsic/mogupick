// api/client.ts
import { getCurrentUser } from '@/utils/ServerAuth';
import { getSession } from 'next-auth/react';

type FetchOptions = Omit<RequestInit, 'headers' | 'body'> & {
  body?: any;
  headers?: Record<string, string>;
};

export async function apiFetch<T>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  options: FetchOptions = {},
): Promise<T> {
  const session = await getCurrentUser();
  const token = session?.accessToken;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'API 요청 실패');
  }

  return res.json();
}
