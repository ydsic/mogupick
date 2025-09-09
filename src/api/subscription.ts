import { apiFetch } from './client';

interface Subscriptions {
  SubscriptionOptionId: number;
  firstDeliveryDate: string;
}
// 구독 옵션 변경
export const patchSubscriptions = (subscriptionId: number, data: Subscriptions) =>
  apiFetch<Subscriptions>(`/subscriptions/${subscriptionId}/option`, 'PATCH', { body: data });

// 구독 리스트
export const getSubscriptions = () => apiFetch<Subscriptions>('/subscriptions');

// 구독 상세
export const getSubscription = (subscriptionId: number) =>
  apiFetch<Subscriptions>(`/subscriptions/${subscriptionId}`);
// 구독 해지
export const deleteSubscription = (subscriptionId: number) =>
  apiFetch<Subscriptions>(`/subscriptions/${subscriptionId}`, 'DELETE');
// 구독 캘린더
export const getSubscriptionsCalendar = (yearMonth: string) =>
  apiFetch<Subscriptions>('/subscriptions/calendar');
