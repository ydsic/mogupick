'use client';

import {
  getProduct,
  getProductsBeginnerFriendly,
  getProductsBeginnerFriendlyMapped,
  getProductsCategory,
  getProductsConstantlyPopular,
  getProductsConstantlyPopularMapped,
  getProductsNew,
  getProductsPeerBestReviews,
  getProductsRecentlyViewed,
  getProductsSimilar,
  ConstantlyPopularMappedResult,
  PeerBestReviewsMappedResult,
  BeginnerFriendlyMappedResult,
  NewProductMappedResult,
  MostViewedMappedResult,
  MappedProductCardItem,
  getProductsPeerBestReviewsMapped,
  getProductsRecentlyViewedMapped,
  getProductsNewMapped,
  getProductsMostViewedMapped,
} from '@/api/product';
import { useQuery } from '@tanstack/react-query';
import { ReviewUser } from '@/components/card/Review';
import { useAuth } from '@/utils/useAuth';

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
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ['products-recently-viewed'],
    queryFn: getProductsRecentlyViewed,
    enabled: isLoggedIn, // 로그인된 경우에만 API 호출
  });
}

// 내 또래 상품 베스트 리뷰 조회
export function useProductsPeerBestReviews() {
  const { isLoggedIn } = useAuth();
  return useQuery({
    queryKey: ['products-peer-best-reviews'],
    queryFn: getProductsPeerBestReviews,
    enabled: isLoggedIn, // 로그인된 경우에만 API 호출
  });
}

// 내 또래 베스트 리뷰 API 결과를 ReviewCardList 형식에 맞게 매핑하는 훅
export function useProductsPeerBestReviewsMapped(limit = 10) {
  const { isLoggedIn } = useAuth();
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
    enabled: isLoggedIn, // 로그인된 경우에만 API 호출
  });
}

// 내 또래 베스트 리뷰도 꾸준히 사랑받는 상품과 동일한 페이지네이션 매핑 구조 훅
export function useProductsPeerBestReviewsMappedPaged(page = 0, size = 20) {
  const { isLoggedIn } = useAuth();
  return useQuery<PeerBestReviewsMappedResult>({
    queryKey: ['products-peer-best-reviews-mapped-paged', page, size],
    queryFn: () => getProductsPeerBestReviewsMapped(page, size),
    enabled: isLoggedIn, // 로그인된 경우에만 API 호출
  });
}

// 이번 달 새로나온 상품조회
export function useProductsNew() {
  return useQuery({ queryKey: ['products-new'], queryFn: getProductsNew });
}

// 이번 달 새로나온 상품 목록 조회 (매핑 포함)
export function useProductsNewMapped(page = 0, size = 20, rootCategory?: string) {
  return useQuery<NewProductMappedResult>({
    queryKey: ['products-new-mapped', page, size, rootCategory],
    queryFn: () => getProductsNewMapped(page, size, rootCategory),
    // flicker 최소화를 위해 이전 구조 흉내: placeholder로 직전 값 재사용
    placeholderData: (prev) => prev, // v5 패턴
    staleTime: 1000 * 60,
  });
}

// 꾸준히 사랑받는 상품목록 조회 (페이지, 사이즈)
export function useProductsConstantlyPopular(page = 0, size = 20) {
  return useQuery({
    queryKey: ['products-constantly-popular', page, size],
    queryFn: () => getProductsConstantlyPopular(page, size),
  });
}

// 꾸준히 사랑받는 상품목록 조회 (매핑 포함)
export function useProductsConstantlyPopularMapped(page = 0, size = 20, rootCategory?: string) {
  return useQuery<ConstantlyPopularMappedResult>({
    queryKey: ['products-constantly-popular-mapped', page, size, rootCategory],
    queryFn: () => getProductsConstantlyPopularMapped(page, size, rootCategory),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
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

// 입문용 상품 목록 조회 (페이지네이션, 매핑 포함)
export function useProductsBeginnerFriendlyMapped(page = 0, size = 20, rootCategory?: string) {
  return useQuery<BeginnerFriendlyMappedResult>({
    queryKey: ['products-beginner-friendly-mapped', page, size, rootCategory],
    queryFn: () => getProductsBeginnerFriendlyMapped(page, size, rootCategory),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });
}

// 최근 본 상품 목록 조회 (매핑 포함)
export function useProductsRecentlyViewedMapped() {
  const { isLoggedIn } = useAuth();
  return useQuery<MappedProductCardItem[]>({
    queryKey: ['products-recently-viewed-mapped'],
    queryFn: getProductsRecentlyViewedMapped,
    enabled: isLoggedIn, // 로그인된 경우에만 API 호출
  });
}

// 지금 주목받는 상품 목록 조회 (매핑 포함)
export function useProductsMostViewedMapped(page = 0, size = 20, rootCategory?: string) {
  return useQuery<MostViewedMappedResult>({
    queryKey: ['products-most-viewed-mapped', page, size, rootCategory],
    queryFn: () => getProductsMostViewedMapped(page, size, rootCategory),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });
}
