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

// ===== 신규: 구독 리스트(상태별) =====
export type SubscriptionStatus = 'ONGOING' | 'ENDED';
export interface SubscriptionItem {
  subscriptionId: number;
  productName: string;
  price: number;
  brandName: string;
  deliveryCycle: string;
  firstDeliveryDate: string; // ISO date (yyyy-MM-dd)
  nextBillingDate: string; // ISO date (yyyy-MM-dd)
  progressRound: number;
  status: SubscriptionStatus | string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  // 선택: 서버가 함께 내려줄 수 있는 필드들(이미지/상품 식별자 등)
  productId?: number;
  productImageUrl?: string;
  productThumbnailUrl?: string;
  imageUrl?: string;
}

// 서버가 배열 또는 { data: [...] } 형태로 줄 가능성을 모두 수용
export async function getSubscriptionsByStatus(status: SubscriptionStatus) {
  const res = await apiFetch<any>(`/subscriptions?status=${status}`);
  const data = Array.isArray(res) ? res : res?.data;
  return (Array.isArray(data) ? data : []) as SubscriptionItem[];
}
