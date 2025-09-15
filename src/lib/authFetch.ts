"use client";
import { getSession } from 'next-auth/react';
import { getLocalAccessToken } from '@/utils/oauthTokens';

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  // 1) Prefer tokens stored via /oauth-redirect flow
  const localToken = getLocalAccessToken();
  if (localToken) {
    const headers = {
      ...init?.headers,
      Authorization: `Bearer ${localToken}`,
    };
    return fetch(input, { ...init, headers });
  }

  // 2) Fallback to NextAuth session
  const session = await getSession();
  const access = session?.user && (session.user as any).accessToken;
  if (!access) {
    throw new Error('로그인이 필요합니다');
  }

  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${access}`,
  };

  return fetch(input, { ...init, headers });
}

// Usage example (client component):
// const res = await authFetch('/api/protected');
// const data = await res.json();

