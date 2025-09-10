'use client';
import Title from '@/components/ui/Title';
import { ReviewCardList } from '@/components/card/Review';
import { useProductsPeerBestReviewsMapped } from '@/hooks/products/useProduct';

export default function PeerBestReviewSection() {
  const { data, isLoading, isError } = useProductsPeerBestReviewsMapped(20);
  return (
    <div className={data ? `mb-0` : `mb-10`}>
      <Title text="내 또래의 베스트 리뷰 PICK" />
      {isLoading && <div className="mt-2 text-sm text-gray-500">로딩중...</div>}
      {isError && <div className="mt-2 text-sm text-red-500">데이터를 불러올 수 없습니다.</div>}
      {data && <ReviewCardList layout="horizontal" reviews={data} />}
    </div>
  );
}
