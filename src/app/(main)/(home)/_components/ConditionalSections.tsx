'use client';

import { useAuth } from '@/utils/useAuth';
import { HorizontalProductList } from '@/components/card/HorizontalProduct';
import { useProductsRecentlyViewedMapped } from '@/hooks/products/useProduct';
import BeginnerFriendlySection from './BeginnerFriendlySection';
import PeerBestReviewSection from './PeerBestReviewSection';
import ConstantlyPopularSection from './ConstantlyPopularSection';
import SimilarProductSection from './SimilarProductSection';
import useMoreModal from '@/hooks/useMoreModal';
import MoreModal from '@/components/modal/MoreModal';

export default function ConditionalSections() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { openModal, closeModal, modalType, modalData } = useMoreModal();

  // API 훅들
  const { data: recentViewedData, isLoading: recentLoading } = useProductsRecentlyViewedMapped();

  // 로딩 중이면 스켈레톤 UI 표시
  if (authLoading || (isLoggedIn && recentLoading)) {
    return (
      <div className="mb-10">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <div className="h-36 w-36 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-2 space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* 로그인 상태에 따른 조건부 렌더링 */}
        {isLoggedIn ? (
          <>
            {/* 로그인된 상태: 최근 본 상품 */}
            {/* 유사한 상품 섹션 */}
            <SimilarProductSection openModal={openModal} />
            {/* 내 또래 베스트 리뷰 PICK */}
            <PeerBestReviewSection openModal={openModal} />
          </>
        ) : (
          <>
            {/* 로그인 안된 상태: 시작으로 좋은 입문 구독템 */}
            <BeginnerFriendlySection openModal={openModal} />
          </>
        )}
      </div>

      {/* 더보기 모달 */}
      <MoreModal
        isOpen={modalType !== null}
        onClose={closeModal}
        title={modalData.title}
        type={modalData.type}
        data={modalData.data}
        isLoading={modalData.isLoading}
      />
    </>
  );
}
