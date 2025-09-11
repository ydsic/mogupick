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
  const baseUrl = getApiBaseUrl();

  let token: string | undefined;
  // 서버 환경: getServerSession 사용
  if (typeof window === 'undefined') {
    try {
      const session = await getCurrentUser();
      token = (session as any)?.accessToken;
    } catch (e) {
      console.warn('[apiFetch] server session fetch failed (ignored)', e);
    }
  } else {
    // 클라이언트 환경: next-auth/react 의 getSession 동적 import
    try {
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      token = (session?.user as any)?.accessToken;
    } catch (e) {
      // 공개 API 요청이면 토큰 없어도 됨
      console.warn('[apiFetch] client getSession failed (maybe not signed in)', e);
    }
  }

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!isFormData) headers['Content-Type'] = 'application/json';

  const finalUrl = `${baseUrl}${url}`;

  const res = await fetch(finalUrl, {
    method,
    headers,
    body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[apiFetch] error response', res.status, errorText);
    throw new Error(errorText || 'API 요청 실패');
  }

  return (await res.json()) as T;
}
