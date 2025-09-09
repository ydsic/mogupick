import { apiFetch } from './client';

export type UserInfo = {
  id: string;
  name: string;
  email?: string;
  image: string;
  provider: 'Google' | 'Kakao';
};

export const getUserInfo = () => apiFetch<UserInfo>('/members/me');
