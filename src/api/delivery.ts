import { apiFetch } from './client';

export interface CreateDeliveryAddressBody {
  addressName: string; // 배송지명
  baseAddress: string; // 기본주소(도로명)
  detailAddress: string; // 상세주소
  receiver: string; // 수령인
  contact: string; // 전화번호
}

export type CreateDeliveryAddressResponse = any;

export async function createDeliveryAddress(body: CreateDeliveryAddressBody) {
  // cart.ts의 정석 패턴과 동일하게 처리
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/delivery-addresses`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `요청 실패 (status: ${res.status})`);
    }

    // 서버가 본문을 반환하지 않을 수도 있으므로 안전 처리
    try {
      return (await res.json()) as CreateDeliveryAddressResponse;
    } catch {
      return true as unknown as CreateDeliveryAddressResponse;
    }
  } catch (e) {
    console.error('[createDeliveryAddress] 에러', e);
    throw e;
  }
}

// 배송지 목록 조회 (로그인 기반 GET)
export async function getDeliveryAddresses() {
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/delivery-addresses`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `요청 실패 (status: ${res.status})`);
    }

    try {
      return await res.json();
    } catch {
      return [];
    }
  } catch (e) {
    console.error('[getDeliveryAddresses] 에러', e);
    throw e;
  }
}
