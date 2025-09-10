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
} from '@/api/product';
import { useQuery } from '@tanstack/react-query';

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
