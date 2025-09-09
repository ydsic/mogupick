import { getNotifications, deleteNotification, markNotificationRead } from '@/api/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 알림 목록 조회
export const useNotifications = () => {
  return useQuery({ queryKey: ['notifications'], queryFn: getNotifications });
};

// 알림 읽음 처리
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// 알림 삭제
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => deleteNotification(notificationId),
    onSuccess: () => {
      // 알림 목록 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
