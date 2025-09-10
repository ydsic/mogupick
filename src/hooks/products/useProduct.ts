'use client';

import {
  getProduct,
  getProductsBeginnerFriendly,
  getProductsCategory,
  getProductsConstantlyPopular,
  getProductsNew,
  getProductsPeerBestReviews,
  getProductsRecentlyViewed,
  getProductsSimilar,
  ConstantlyPopularMappedResult,
  PeerBestReviewsMappedResult,
  getProductsPeerBestReviewsMapped,
} from '@/api/product';
import { useQuery } from '@tanstack/react-query';
import { ReviewUser } from '@/components/card/Review';

// 상품 상세조회
export function useProduct(id: number) {
  return useQuery({ queryKey: ['products', id], queryFn: () => getProduct(id), enabled: !!id });
}

// 유사상품 목록조회
export function useProductsSimilar() {
  return useQuery({ queryKey: ['products-similar'], queryFn: getProductsSimilar });
}

// 멤버의 최근 본 상품 목록 조회
export function useProductsRecentlyViewed() {
  return useQuery({ queryKey: ['products-recently-viewed'], queryFn: getProductsRecentlyViewed });
}

// 내 또래 상품 베스트 리뷰 조회
export function useProductsPeerBestReviews() {
  return useQuery({
    queryKey: ['products-peer-best-reviews'],
    queryFn: getProductsPeerBestReviews,
  });
}

// 내 또래 베스트 리뷰 API 결과를 ReviewCardList 형식에 맞게 매핑하는 훅
export function useProductsPeerBestReviewsMapped(limit = 10) {
  return useQuery<ReviewUser[]>({
    queryKey: ['products-peer-best-reviews-mapped', limit],
    queryFn: async () => {
      const raw = await getProductsPeerBestReviews();
      // raw 타입 정의가 Product[]로 되어 있으므로 안전하게 any 처리 후 필요한 필드 추출
      const mapped = (raw as any[]).map((item, idx) => ({
        id: item.productId ?? item.id ?? idx,
        username: item.username ?? item.userName ?? '사용자',
        avatar: item.userAvatarUrl ?? undefined,
        store: item.brandName ?? item.store ?? item.brand?.brandName ?? '',
        title: item.productName ?? item.title ?? item.product?.productName ?? '상품',
        rating: item.rating ?? item.reviewRating ?? item.review?.rating ?? 0,
        reviewCount: item.reviewCount ?? item.review?.reviewCount ?? 0,
      })) as ReviewUser[];
      return mapped.slice(0, limit);
    },
  });
}

// 내 또래 베스트 리뷰도 꾸준히 사랑받는 상품과 동일한 페이지네이션 매핑 구조 훅
export function useProductsPeerBestReviewsMappedPaged(page = 0, size = 20) {
  return useQuery<PeerBestReviewsMappedResult>({
    queryKey: ['products-peer-best-reviews-mapped-paged', page, size],
    queryFn: () => getProductsPeerBestReviewsMapped(page, size),
  });
}

// 이번 달 새로나온 상품조회
export function useProductsNew() {
  return useQuery({ queryKey: ['products-new'], queryFn: getProductsNew });
}

// 꾸준히 사랑받는 상품목록 조회 (페이지, 사이즈)
export function useProductsConstantlyPopular(page = 0, size = 20) {
  return useQuery<ConstantlyPopularMappedResult>({
    queryKey: ['products-constantly-popular', page, size],
    queryFn: () => getProductsConstantlyPopular(page, size),
  });
}

// 루트 카테고리에 대한 상품 목록 조회
export function useProductsCategory() {
  return useQuery({ queryKey: ['products-category'], queryFn: getProductsCategory });
}

// 입문용 상품 목록 조회
export function useProductsBeginnerFriendly() {
  return useQuery({
    queryKey: ['products-beginner-griendly'],
    queryFn: getProductsBeginnerFriendly,
  });
}
