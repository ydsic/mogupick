'use client';

import { useAuth } from '@/utils/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/auth/login' }: Props) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace(redirectTo);
  }, [isLoading, isLoggedIn, router, redirectTo]);

  if (isLoading) return <div>Loading</div>;
  if (!isLoggedIn) return null; // redirect중에는 아무것도 렌더링 금지

  return <>{children}</>;
}
