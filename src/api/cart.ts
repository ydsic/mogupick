import { apiFetch } from './client';

export interface Cart {
  subscriptionOptionId: number;
  firstDeliveryDate: string;
}

// UI에서 사용하는 장바구니 아이템 타입
export interface CartItemUI {
  id: number; // cartItemId
  title: string; // product name
  subscriptionType: string; // 예: "1달에 한 번 구독 ∙ 첫배송 2025-09-11"
  price: number; // 단가
  quantity: number; // 수량
  image?: string; // 썸네일
  selected: boolean; // UI 선택 상태
  brand: string; // 브랜드명
}

// 장바구니 담기 (로그인 API 방식: getApiBaseUrl + fetch)
export const createCart = async (memberId: number, productId: number, cart: Cart) => {
  const { subscriptionOptionId, firstDeliveryDate } = cart;
  const body = {
    productId,
    subscriptionOptionId,
    firstDeliveryDate,
  };

  try {
    // 로그인 API와 동일한 패턴으로 전송
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/carts`;
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

    return await res.json();
  } catch (e) {
    console.error('[createCart] 에러', e);
    throw e;
  }
};

// 장바구니 아이템 옵션 변경 (구버전 경로) — 유지되지만 신규 로직에서는 사용하지 않음
export const patchCart = (memberId: number, cartItemId: number, body: Cart) =>
  apiFetch<Cart>(`/carts/${memberId}/${cartItemId}/option`, 'PATCH', {
    body,
  });

// 장바구니 조회 (로그인 기반: /carts)
export const getMyCart = async () => {
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/carts`;
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

    return await res.json();
  } catch (e) {
    console.error('[getMyCart] 에러', e);
    throw e;
  }
};

// 장바구니 아이템 삭제 (구버전 경로) — 유지되지만 신규 로직에서는 사용하지 않음
export const deleteCart = (memberId: number, cartItemId: number) =>
  apiFetch<Cart>(`/carts/${memberId}/${cartItemId}/option`, 'DELETE');

// 장바구니 아이템 단건 삭제 (로그인 API 방식)
export const deleteCartItem = async (cartItemId: number) => {
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/carts/items/${cartItemId}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `요청 실패 (status: ${res.status})`);
    }

    // 서버가 본문을 반환하지 않을 수도 있으므로 안전 처리
    try {
      return await res.json();
    } catch {
      return true;
    }
  } catch (e) {
    console.error('[deleteCartItem] 에러', e);
    throw e;
  }
};

// 장바구니 아이템 옵션 변경 (로그인 API 방식)
export const updateCartItemOption = async (cartItemId: number, body: Cart) => {
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/carts/items/${cartItemId}/option`;
    const res = await fetch(url, {
      method: 'PATCH',
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

    try {
      return await res.json();
    } catch {
      return true;
    }
  } catch (e) {
    console.error('[updateCartItemOption] 에러', e);
    throw e;
  }
};

// ===== UI 매핑 유틸리티 =====
export const mapCartResponseToUI = (res: any): CartItemUI[] => {
  // 응답 배열 추출 (data.items | data.content | data | root)
  const items: any[] = Array.isArray(res?.data?.items)
    ? res.data.items
    : Array.isArray(res?.data?.content)
      ? res.data.content
      : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];

  const mapped: CartItemUI[] = items.map((item: any, idx: number) => {
    const cartItemId = item.cartItemId ?? item.id ?? idx;
    const product = item.product ?? {};
    const brand = item.brand ?? {};
    const subscription = item.subscription ?? item.option ?? {};

    const productName = product.productName ?? item.productName ?? '상품이름';
    const productPrice = product.productPrice ?? item.productPrice ?? 0;
    const brandName = brand.brandName ?? item.brandName ?? '브랜드';
    const quantity = item.quantity ?? product.quantity ?? 1;

    const optionText =
      subscription.displayText ??
      subscription.subscriptionOptionText ??
      subscription.optionText ??
      '';
    const firstDate =
      subscription.firstDeliveryDate ?? item.firstDeliveryDate ?? subscription.startDate ?? '';

    const subscriptionType = optionText
      ? `${optionText}${firstDate ? ` ∙ 첫배송 ${firstDate}` : ''}`
      : firstDate
        ? `첫배송 ${firstDate}`
        : '';

    const image = product.productImageUrl ?? product.imageUrl ?? item.imageUrl;

    return {
      id: Number(cartItemId),
      title: String(productName),
      subscriptionType: String(subscriptionType),
      price: Number(productPrice) || 0,
      quantity: Number(quantity) || 1,
      image: image ? String(image) : undefined,
      selected: false,
      brand: String(brandName),
    } as CartItemUI;
  });

  return mapped;
};

export const getMyCartMapped = async (): Promise<CartItemUI[]> => {
  const res = await getMyCart();
  return mapCartResponseToUI(res);
};
