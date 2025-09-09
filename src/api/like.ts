import { apiFetch } from './client';

export interface LikedProduct {
  productId: number;
  brandName: string;
  productName: string;
  imageUrl: string;
  price: number;
  starRate: number;
  reviewCount: number;
}

// 내가 좋아요한 상품 목록 조회
export const getMyLikedProducts = () => apiFetch<LikedProduct[]>('/like/my/products', 'GET');
// 상품 좋아요
export const likeProduct = async (productId: number) =>
  apiFetch<{ success: boolean }>(`/like/product/${productId}`, 'POST');
// 브랜드 좋아요
export const likeBrand = async (brandId: number) =>
  apiFetch<{ success: boolean }>(`/like/brand/${brandId}`, 'POST');
