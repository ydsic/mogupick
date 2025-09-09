import { getProductReview } from '@/api/review';
import { useQuery } from '@tanstack/react-query';

// 상품 리뷰 조회
export function useProductReviews() {
  return useQuery({
    queryKey: ['product-reviews'],
    queryFn: () => getProductReview,
  });
}
