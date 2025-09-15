export interface CreateOrderBody {
  cartItemIds: number[];
  addressId: number;
}

export type CreateOrderResponse = any;

// 주문 생성 (장바구니 선택 항목 기반) — delivery.ts와 동일한 정석 fetch 패턴 사용
export async function createOrder(body: CreateOrderBody) {
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/orders`;

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
      console.error('[ORDER][response:status]', res.status, text);
      throw new Error(text || `요청 실패 (status: ${res.status})`);
    }

    // 서버가 본문을 반환하지 않을 수도 있으므로 안전 처리
    try {
      const json = (await res.json()) as CreateOrderResponse;
      return json;
    } catch {
      return true as unknown as CreateOrderResponse;
    }
  } catch (e) {
    console.error('[ORDER][error]', e);
    throw e;
  }
}
