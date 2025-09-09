import { apiFetch } from './client';

export interface Notification {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// 알림 목록 조회
export const getNotifications = () => apiFetch<Notification[]>('/notifications', 'GET');

// 알림 단건 삭제
export const deleteNotification = (notificationId: number) =>
  apiFetch<{ success: boolean }>(`/notifications/${notificationId}`, 'DELETE');

// 알림 읽음 처리 (PATCH)
export const markNotificationRead = (notificationId: number) =>
  apiFetch<{ success: boolean }>(`/notifications/${notificationId}`, 'PATCH');
