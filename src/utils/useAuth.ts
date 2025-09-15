'use client';

// 클라이언트 전용 훅

import { signOut, useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const { data: session, status } = useSession();
  const store = useAuthStore();

  // next-auth or custom token 기반 로그인 판정
  const isStoreLoggedIn = store.isLoggedIn && !!store.accessToken;
  const isNextAuthLoggedIn = status === 'authenticated' && !!session?.user?.accessToken;
  const isLoggedIn = isStoreLoggedIn || isNextAuthLoggedIn;
  const isLoading = status === 'loading';

  const logout = async () => {
    store.logout();
    await signOut({ callbackUrl: '/' });
  };

  return {
    session,
    isLoading,
    isLoggedIn,
    logout,
    accessToken: store.accessToken || (session as any)?.user?.accessToken,
  };
}
