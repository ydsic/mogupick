import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptions,
  getSubscription,
  patchSubscriptions,
  deleteSubscription,
  getSubscriptionsCalendar,
} from '@/api/subscription';

interface Subscriptions {
  SubscriptionOptionId: number;
  firstDeliveryDate: string;
}

// 구독 리스트 조회
export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });
};

// 구독 상세 조회
export const useSubscription = (subscriptionId: number) => {
  return useQuery({
    queryKey: ['subscription', subscriptionId],
    queryFn: () => getSubscription(subscriptionId),
    enabled: !!subscriptionId,
  });
};

// 구독 옵션 변경
export const usePatchSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: number; data: Subscriptions }) =>
      patchSubscriptions(subscriptionId, data),
    onSuccess: (_, { subscriptionId }) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', subscriptionId] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

// 구독 해지
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: number) => deleteSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

// 구독 캘린더 조회
export const useSubscriptionsCalendar = (yearMonth: string) => {
  return useQuery({
    queryKey: ['subscriptionsCalendar', yearMonth],
    queryFn: () => getSubscriptionsCalendar(yearMonth),
    enabled: !!yearMonth,
  });
};
