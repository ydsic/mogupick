// hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCart, patchCart, getCart, deleteCart, Cart } from '@/api/cart';

/** 장바구니 조회 */
export const useCart = (memberId: number) => {
  return useQuery({
    queryKey: ['cart', memberId],
    queryFn: () => getCart(memberId),
    staleTime: 1000 * 60, // 1분 캐싱
  });
};

/** 장바구니 담기 */
export const useCreateCart = (memberId: number, productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cart: Cart) => createCart(memberId, productId, cart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', memberId] });
    },
  });
};

/** 장바구니 옵션 변경 */
export const usePatchCart = (memberId: number, cartItemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Cart) => patchCart(memberId, cartItemId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', memberId] });
    },
  });
};

/** 장바구니 아이템 삭제 */
export const useDeleteCart = (memberId: number, cartItemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCart(memberId, cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', memberId] });
    },
  });
};
