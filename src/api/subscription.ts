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

// ===== 신규: 구독 옵션 목록 조회 =====
export type SubscriptionUnit = 'DAY' | 'WEEK' | 'MONTH';
export interface SubscriptionOption {
  id: number;
  unit: SubscriptionUnit;
  period: number;
  displayText: string;
}
export interface SubscriptionOptionsResponse {
  status: number;
  message: string;
  data: SubscriptionOption[];
}

export const getSubscriptionOptions = () =>
  apiFetch<SubscriptionOptionsResponse>('/subscription-options');
