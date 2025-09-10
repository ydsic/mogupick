'use client';
import Title from '@/components/ui/Title';
import { ReviewCardList } from '@/components/card/Review';
import { useProductsPeerBestReviewsMapped, useProductsNew } from '@/hooks/products/useProduct';
import { useAuth } from '@/utils/useAuth';
import { HorizontalProductList } from '@/components/card/HorizontalProduct';
import Link from 'next/link';
import NextIcon from '@/assets/icons/common/next-24px.svg';

type ModalType =
  | 'recently-viewed'
  | 'peer-reviews'
  | 'beginner-friendly'
  | 'new-products'
  | 'constantly-popular'
  | null;

interface PeerBestReviewSectionProps {
  openModal?: (type: ModalType) => void;
}

export default function PeerBestReviewSection({ openModal }: PeerBestReviewSectionProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const {
    data: reviewData,
    isLoading: reviewLoading,
    isError,
  } = useProductsPeerBestReviewsMapped(4);
  const { data: newProductsData, isLoading: newProductsLoading } = useProductsNew();

  // 로딩 중일 때
  if (isLoading || (isLoggedIn && reviewLoading) || (!isLoggedIn && newProductsLoading)) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-32 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  // 데이터를 제품 카드 형식으로 변환하는 함수
  const transformToProductCard = (data: any[]) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item, index) => ({
      id: item.productId || item.id || index,
      store: item.brandName || item.store || '스토어',
      title: item.productName || item.title || item.name || '상품명',
      price: item.productPrice || item.price || 0,
      rating: item.rating || item.starRate || 4.5,
      reviewCount: item.reviewCount || 0,
      image: item.productImageUrl || item.imageUrl,
    }));
  };

  // 로그인된 상태: 내 또래의 베스트 리뷰 PICK
  if (isLoggedIn) {
    return (
      <div className={reviewData ? `mb-0` : `mb-10`}>
        <Title text="내 또래 베스트 리뷰 PICK" />
        {reviewLoading && <div className="mt-2 text-sm text-gray-500">로딩중...</div>}
        {isError && <div className="mt-2 text-sm text-red-500">데이터를 불러올 수 없습니다.</div>}
        {reviewData && <ReviewCardList layout="horizontal" reviews={reviewData} />}

        {/* 더보기 버튼 */}
        {reviewData && reviewData.length >= 4 && openModal && (
          <div className="flex justify-center">
            <button
              onClick={() => openModal('peer-reviews')}
              className="flex items-center justify-center rounded-2xl border border-gray-400 px-6 py-2 text-center transition-colors hover:bg-gray-50"
            >
              리뷰 더보기
              <NextIcon />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 로그인 안된 상태: 이번달 새로 나온 구독
  return (
    <HorizontalProductList
      products={transformToProductCard(newProductsData || []).slice(0, 4)}
      title="이번달 새로 나온 구독"
      onMoreClick={openModal ? () => openModal('new-products') : undefined}
    />
  );
}
