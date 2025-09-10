'use client';

import Title from '@/components/ui/Title';
import { HorizontalProductList } from '@/components/card/HorizontalProduct';
import { useProductsNewMapped } from '@/hooks/products/useProduct';

export default function NewProductSection() {
  const { data, isLoading, isError, error } = useProductsNewMapped(0, 20);

  if (isLoading) {
    return (
      <div>
        <Title text="이번 달 새로나온 구독" />
        <div className="mt-2 text-sm text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <Title text="이번 달 새로나온 구독" />
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
    image: p.imageUrl,
  }));

  return (
    <div>
      <Title text="이번 달 새로나온 구독" />
      <HorizontalProductList products={products} title="" />
    </div>
  );
}
