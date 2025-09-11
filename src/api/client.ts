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
    // 클라이언트 환경: 0) useAuthStore 우선 1) oauthTokens(localStorage) 2) next-auth 세션 3) cookie
    try {
      const mod = await import('@/store/useAuthStore');
      const state = mod.useAuthStore.getState();
      if (state?.accessToken) token = state.accessToken;
    } catch (e) {
      // ignore
    }

    if (!token) {
      try {
        const { getLocalAccessToken } = await import('@/utils/oauthTokens');
        const local = getLocalAccessToken();
        if (local) token = local;
      } catch (e) {
        console.warn('[apiFetch] getLocalAccessToken failed (ignored)', e);
      }
    }

    if (!token) {
      try {
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        token = (session?.user as any)?.accessToken;
      } catch (e) {
        console.warn('[apiFetch] client getSession failed (maybe not signed in)', e);
      }
    }

    // 선택: 쿠키에 accessToken이 있다면 마지막 폴백으로 사용
    if (!token) {
      try {
        const m = document.cookie.match(/(?:^|; )accessToken=([^;]+)/);
        if (m) token = decodeURIComponent(m[1]);
      } catch {}
    }
  }

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!isFormData) headers['Content-Type'] = 'application/json';

  const finalUrl = `${baseUrl}${url}`;

  if (process.env.NODE_ENV !== 'production') {
    const { Authorization, ...hdr } = headers;
    console.log('[apiFetch] request', {
      method,
      url: finalUrl,
      headers: hdr,
      hasAuth: !!Authorization,
      bodyPreview: isFormData ? '[FormData]' : options.body,
    });
  }

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
