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
} from '@/api/product';
import { useQuery } from '@tanstack/react-query';

// 상품 상세조회
export function useProduct(id: number) {
  return useQuery({ queryKey: ['products'], queryFn: () => getProduct(id), enabled: !!id });
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

// 꾸준히 사랑받는 상품목록 조회
export function useProductsConstantlyPopular() {
  return useQuery({
    queryKey: ['products-constantly-popular'],
    queryFn: getProductsConstantlyPopular,
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
