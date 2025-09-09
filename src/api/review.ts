import { apiFetch } from './client';

export interface Review {
  memberId: number;
  productId: number;
  content: string;
  score: number;
  images?: string[];
}

// 상품 리뷰 작성
export const createReview = async (review: Review) => {
  const { memberId, productId, content, score, images } = review;
  const formData = new FormData();
  formData.append('memberId', memberId.toString());
  formData.append('productId', productId.toString());
  formData.append('content', content);
  formData.append('score', score.toString());

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append('images', file);
    });
  }

  return apiFetch<Review>('/reviews', 'POST', { body: formData });
};
// 좋아요추가&제거
export const createToggleReviewLike = (reviewId: number) =>
  apiFetch(`/reviews/${reviewId}/likes`, 'POST');
// 상품리뷰 목록 조회
export const getProductReview = (productId: number) => apiFetch(`/reviews/products/${productId}`);
