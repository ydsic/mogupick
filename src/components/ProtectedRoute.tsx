'use client';

import { useAuth } from '@/utils/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}
// 페이지 보호막 : 로그인 여부 (next-auth + custom token)
export default function ProtectedRoute({ children, redirectTo = '/auth/credential' }: Props) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace(redirectTo);
  }, [isLoading, isLoggedIn, router, redirectTo]);

  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return null; // redirect 중에는 렌더링 방지

  return <>{children}</>;
}
