'use client';

import Title from '@/components/ui/Title';
import { ProductCardList } from '@/components/card/Product';
import Link from 'next/link';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import { useProductsBeginnerFriendlyMapped } from '@/hooks/products/useProduct';

type ModalType =
  | 'recently-viewed'
  | 'peer-reviews'
  | 'beginner-friendly'
  | 'new-products'
  | 'constantly-popular'
  | null;

interface BeginnerFriendlySectionProps {
  openModal: (type: ModalType) => void;
}

export default function BeginnerFriendlySection({ openModal }: BeginnerFriendlySectionProps) {
  const { data, isLoading, isError, error } = useProductsBeginnerFriendlyMapped(0, 20);

  if (isLoading) {
    return (
      <div>
        <Title text="시작으로 좋은 입문 구독템" adver={true} />
        <div className="mt-2 text-sm text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <Title text="시작으로 좋은 입문 구독템" adver={true} />
        <div className="mt-2 text-sm text-red-500">데이터를 불러올 수 없습니다.</div>
        {error && (
          <pre className="text-xs whitespace-pre-wrap text-gray-400">
            {(error as Error).message}
          </pre>
        )}
      </div>
    );
  }

  const products = data.items.map((p) => ({
    id: p.id,
    store: p.store,
    title: p.title,
    price: p.price,
    rating: p.rating,
    reviewCount: p.reviewCount,
    imageUrl: p.imageUrl,
  }));

  return (
    <div>
      <Title text="시작으로 좋은 입문 구독템" adver={true} />
      <ProductCardList
        path={`/products`}
        products={products}
        limit={4}
        query={{ from: 'home', section: 'beginner' }}
      />

      {products.length >= 4 && (
        <div className="flex justify-center">
          <button
            onClick={() => openModal('beginner-friendly')}
            className="flex items-center justify-center rounded-2xl border border-gray-400 px-6 py-2 text-center transition-colors hover:bg-gray-50"
          >
            상품 더보기
            <NextIcon />
          </button>
        </div>
      )}
    </div>
  );
}
