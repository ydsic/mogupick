// hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCart, updateCartItemOption, getMyCart, deleteCartItem, Cart } from '@/api/cart';

/** 장바구니 조회 (로그인 기반) */
export const useCart = (memberId: number) => {
  return useQuery({
    queryKey: ['cart', memberId],
    queryFn: () => getMyCart(),
    staleTime: 1000 * 60, // 1분 캐싱
  });
};

/** 장바구니 담기 (로그인 기반) */
export const useCreateCart = (memberId: number, productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cart: Cart) => createCart(memberId, productId, cart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', memberId] });
    },
  });
};

/** 장바구니 옵션 변경 (로그인 기반) */
export const usePatchCart = (memberId: number, cartItemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Cart) => updateCartItemOption(cartItemId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', memberId] });
    },
  });
};

/** 장바구니 아이템 삭제 (로그인 기반) */
export const useDeleteCart = (memberId: number, cartItemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', memberId] });
    },
  });
};
