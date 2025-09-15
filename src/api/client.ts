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

  // 서버에서는 절대 URL이 필요함. baseUrl이 상대경로('/proxy...')이면 origin과 결합
  let finalUrl: string;
  const path = url.startsWith('/') ? url : `/${url}`;
  if (typeof window === 'undefined') {
    if (/^https?:\/\//i.test(baseUrl)) {
      finalUrl = `${baseUrl}${path}`;
    } else {
      const originEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_ORIGIN;
      const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
      const origin = originEnv || vercelUrl || 'http://localhost:3000';
      const base = baseUrl.replace(/\/$/, '');
      finalUrl = `${origin}${base}${path}`;
    }
  } else {
    // 브라우저에서는 상대경로 허용
    finalUrl = `${baseUrl}${path}`;
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

  // 여기서부터: 응답이 비어있거나 JSON이 아닐 수 있음(예: 204 No Content)
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!text) {
    // 비어있는 응답 본문 (204 등)
    return undefined as T;
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      console.warn('[apiFetch] JSON parse 실패, 원문 반환', e);
      return undefined as T;
    }
  }

  // JSON 이외의 응답은 문자열로 전달 (필요 시 호출부에서 무시 가능)
  return text as unknown as T;
}
