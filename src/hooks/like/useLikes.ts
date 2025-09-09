import { getMyLikedProducts, likeBrand, likeProduct } from '@/api/like';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 내가 좋아요한 상품 목록
export const useMyLikedProducts = () => {
  return useQuery({ queryKey: ['myLikeProducts'], queryFn: getMyLikedProducts });
};

// 상품 좋아요
export const useLikeProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['MyLikeProducts'] }),
  });
};

// 브랜드 좋아요
export const useLikeBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLikeProducts'] });
    },
  });
};
