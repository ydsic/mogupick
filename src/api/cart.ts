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

// 클라이언트에서 accessToken 회수 (store -> localStorage(oauthTokens) -> cookie)
async function getAccessTokenClient(): Promise<string | undefined> {
  if (typeof window === 'undefined') return undefined;
  try {
    const { useAuthStore } = await import('@/store/useAuthStore');
    const t = useAuthStore.getState().accessToken;
    if (t) return t;
  } catch {}

  try {
    const { getLocalAccessToken } = await import('@/utils/oauthTokens');
    const t = getLocalAccessToken();
    if (t) return t;
  } catch {}

  try {
    const m = document.cookie.match(/(?:^|; )accessToken=([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
  } catch {}

  return undefined;
}

// 장바구니 담기 (JSON payload) - 환경에 따라 다른 방식 사용
export const createCart = async (memberId: number, productId: number, cart: Cart) => {
  const { subscriptionOptionId, firstDeliveryDate } = cart;
  const body = {
    productId,
    subscriptionOptionId,
    firstDeliveryDate,
  };

  try {
    // 프로덕션 환경에서도 토큰을 명시적으로 주입하여 누락 방지
    if (process.env.NODE_ENV === 'production') {
      const token = await getAccessTokenClient();
      if (!token) throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
      const res = await apiFetch<Cart>('/carts', 'POST', {
        body,
        headers: { Authorization: `Bearer ${token}` },
      });
      return res;
    } else {
      // 개발 환경에서는 직접 fetch 사용 (프록시 500 에러 회피)
      const token = await getAccessTokenClient();
      if (!token) {
        throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
      }

      const url = 'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/carts';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `요청 실패 (status: ${res.status})`);
      }

      return await res.json();
    }
  } catch (e) {
    console.error('[createCart] 에러', e);
    throw e;
  }
};

// 장바구니 아이템 옵션 변경
export const patchCart = (memberId: number, cartItemId: number, body: Cart) =>
  apiFetch<Cart>(`/carts/${memberId}/${cartItemId}/option`, 'PATCH', {
    body,
  });

// 장바구니 조회 (memberId 경로 방식)
export const getCart = (memberId: number) => apiFetch<any>(`/carts/${memberId}`);

// 장바구니 조회 (토큰 기반 내 장바구니) - 환경별 분기
export const getMyCart = async () => {
  try {
    // 프로덕션 환경에서도 토큰을 명시적으로 주입
    if (process.env.NODE_ENV === 'production') {
      const token = await getAccessTokenClient();
      if (!token) throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
      return await apiFetch<any>('/carts', 'GET', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // 개발 환경에서는 직접 fetch 사용
      const token = await getAccessTokenClient();

      if (!token) {
        throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
      }

      const url = 'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/carts';
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `요청 실패 (status: ${res.status})`);
      }

      return await res.json();
    }
  } catch (e) {
    console.error('[getMyCart] 에러', e);
    throw e;
  }
};

// 장바구니 아이템 삭제
export const deleteCart = (memberId: number, cartItemId: number) =>
  apiFetch<Cart>(`/carts/${memberId}/${cartItemId}/option`, 'DELETE');

// ===== UI 매핑 유틸리티 =====
export const getMyCartMapped = async (): Promise<CartItemUI[]> => {
  const res = await getMyCart();

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
