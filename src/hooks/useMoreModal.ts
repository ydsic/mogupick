'use client';

import { useState } from 'react';
import {
  useProductsRecentlyViewedMapped,
  useProductsPeerBestReviewsMappedPaged,
  useProductsBeginnerFriendlyMapped,
  useProductsNewMapped,
  useProductsConstantlyPopularMapped,
  useProductsSimilarMapped,
} from '@/hooks/products/useProduct';

type ModalType =
  | 'recently-viewed'
  | 'peer-reviews'
  | 'beginner-friendly'
  | 'new-products'
  | 'constantly-popular'
  | 'similar-products'
  | null;

export default function useMoreModal() {
  const [modalType, setModalType] = useState<ModalType>(null);

  // API 훅들
  const { data: recentViewedData, isLoading: recentLoading } = useProductsRecentlyViewedMapped();
  const { data: peerReviewsData, isLoading: peerLoading } = useProductsPeerBestReviewsMappedPaged(
    0,
    20,
  );
  const { data: beginnerData, isLoading: beginnerLoading } = useProductsBeginnerFriendlyMapped(
    0,
    20,
  );
  const { data: newProductsData, isLoading: newLoading } = useProductsNewMapped(0, 20);
  const { data: constantlyPopularData, isLoading: constantlyPopularLoading } =
    useProductsConstantlyPopularMapped(0, 20);
  const { data: similarProductsData, isLoading: similarLoading } = useProductsSimilarMapped(0, 20);

  // 모달 데이터 및 설정
  const getModalData = () => {
    switch (modalType) {
      case 'recently-viewed':
        return {
          title: '최근 본 상품과 유사한 상품',
          type: 'product' as const,
          data: recentViewedData || [],
          isLoading: recentLoading,
        };
      case 'peer-reviews':
        return {
          title: '내 또래 베스트 리뷰 PICK',
          type: 'review' as const,
          data: peerReviewsData?.items || [],
          isLoading: peerLoading,
        };
      case 'beginner-friendly':
        return {
          title: '시작으로 좋은 입문 구독템',
          type: 'product' as const,
          data: beginnerData?.items || [],
          isLoading: beginnerLoading,
        };
      case 'new-products':
        return {
          title: '이번 달 새로나온 상품',
          type: 'product' as const,
          data: newProductsData?.items || [],
          isLoading: newLoading,
        };
      case 'constantly-popular':
        return {
          title: '꾸준히 사랑받는 상품',
          type: 'product' as const,
          data: constantlyPopularData?.items || [],
          isLoading: constantlyPopularLoading,
        };
      case 'similar-products':
        return {
          title: '최근 본 상품과 유사한 상품',
          type: 'product' as const,
          data: similarProductsData?.items || [],
          isLoading: similarLoading,
        };
      default:
        return {
          title: '',
          type: 'product' as const,
          data: [],
          isLoading: false,
        };
    }
  };

  const modalData = getModalData();

  const openModal = (type: ModalType) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return {
    openModal,
    closeModal,
    modalType,
    modalData,
  };
}
