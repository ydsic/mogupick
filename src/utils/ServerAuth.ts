// 서버 세션 훅

import { authOptions } from '@/lib/auth/authOptions';
import { getServerSession } from 'next-auth';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) return null;
  return session.user;
}
