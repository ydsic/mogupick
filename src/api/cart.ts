import { apiFetch } from './client';

export interface Cart {
  subscriptionOptionId: number;
  firstDeliveryDate: string;
}

// 장바구니 담기
export const createCart = async (memberId: number, productId: number, cart: Cart) => {
  const { subscriptionOptionId, firstDeliveryDate } = cart;
  const formData = new FormData();
  formData.append('memberId', memberId.toString());
  formData.append('productId', productId.toString());
  formData.append('subscriptionOptionId', subscriptionOptionId.toString());
  formData.append('firstDeliveryDate', firstDeliveryDate);

  return apiFetch<Cart>('/carts', 'POST', { body: formData });
};

// 장바구니 아이템 옵션 변경
export const patchCart = (memberId: number, cartItemId: number, body: Cart) =>
  apiFetch<Cart>(`/carts/${memberId}/${cartItemId}/option`, 'PATCH', {
    body: JSON.stringify(body),
  });

// 장바구니 조회
export const getCart = (memberId: number) => apiFetch<Cart>(`/carts/${memberId}`);

// 장바구니 아이템 삭제
export const deleteCart = (memberId: number, cartItemId: number) =>
  apiFetch<Cart>(`/carts/${memberId}/${cartItemId}/option`, 'DELETE');
