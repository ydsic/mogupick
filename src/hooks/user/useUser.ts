'use client';

import { useQuery } from '@tanstack/react-query';
import { UserInfo, getUserInfo } from '@/api/user';

export function useUser() {
  return useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });
}
