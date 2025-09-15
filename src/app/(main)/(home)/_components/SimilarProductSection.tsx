'use client';

import { HorizontalProductList } from '@/components/card/HorizontalProduct';
import { useProductsSimilarMapped } from '@/hooks/products/useProduct';

interface SimilarProductSectionProps {
  openModal: (type: 'similar-products') => void;
}

export default function SimilarProductSection({ openModal }: SimilarProductSectionProps) {
  const { data: similarData, isLoading } = useProductsSimilarMapped(0, 20);

  const handleMoreClick = () => {
    openModal('similar-products');
  };

  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-4">
            {[...Array(6)].map((_, i) => (
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

  const products = (similarData?.items || []).map((p) => ({
    id: p.id,
    store: p.store,
    title: p.title,
    price: p.price,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: p.imageUrl,
  }));

  // 데이터가 없는 경우 렌더링하지 않음
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <HorizontalProductList
      products={products.slice(0, 6)}
      title="최근 본 상품과 유사한 상품"
      onMoreClick={handleMoreClick}
    />
  );
}
