// api/client.ts
import { getCurrentUser } from '@/utils/ServerAuth';
import { getApiBaseUrl } from '@/lib/config';

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
  const baseUrl = getApiBaseUrl();

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // FormData면 Content-Type 자동 설정 제거
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${baseUrl}${url}`, {
    method,
    headers,
    body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'API 요청 실패');
  }

  return (await res.json()) as T;
}
