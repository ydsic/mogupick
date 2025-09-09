'use client';

// 클라이언트 전용 훅

import { signOut, useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session?.user?.id;
  const isLoading = status === 'loading';

  const logout = async () => await signOut({ callbackUrl: '/' });

  return { session, isLoading, isLoggedIn, logout };
}
