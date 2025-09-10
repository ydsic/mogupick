'use client';

import Title from '@/components/ui/Title';
import { ProductCardList } from '@/components/card/Product';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import { useProductsConstantlyPopular } from '@/hooks/products/useProduct';

type ModalType =
  | 'recently-viewed'
  | 'peer-reviews'
  | 'beginner-friendly'
  | 'new-products'
  | 'constantly-popular'
  | null;

interface ConstantlyPopularSectionProps {
  openModal: (type: ModalType) => void;
}

export default function ConstantlyPopularSection({ openModal }: ConstantlyPopularSectionProps) {
  const { data, isLoading, isError, error } = useProductsConstantlyPopular(0, 20);

  if (isLoading) {
    return (
      <div>
        <Title text="꾸준히 사랑받는 상품" />
        <div className="mt-2 text-sm text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <Title text="꾸준히 사랑받는 상품" />
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
      <Title text="꾸준히 사랑받는 상품" />
      <ProductCardList
        path={`/products`}
        products={products}
        limit={4}
        query={{ from: 'home', section: 'constantly-popular' }}
      />

      {products.length >= 4 && (
        <div className="flex justify-center">
          <button
            onClick={() => openModal('constantly-popular')}
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
