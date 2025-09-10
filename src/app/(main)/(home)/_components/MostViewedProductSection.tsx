'use client';

import Title from '@/components/ui/Title';
import { ChipsList } from '@/components/ui/Chips';
import { ProductCardList } from '@/components/card/Product';
import { categories } from '@/constants/categories';
import { useProductsMostViewedMapped } from '@/hooks/products/useProduct';
import Link from 'next/link';
import NextIcon from '@/assets/icons/common/next-20px.svg';

export default function MostViewedProductSection() {
  const { data, isLoading, isError, error } = useProductsMostViewedMapped(0, 20);

  if (isLoading) {
    return (
      <div className="mb-10">
        <Title text="지금 주목받는 상품" />
        <ChipsList categories={categories} />
        <div className="mt-2 text-sm text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mb-10">
        <Title text="지금 주목받는 상품" />
        <ChipsList categories={categories} />
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
    <div className="mb-10">
      <Title text="지금 주목받는 상품" />
      <ChipsList categories={categories} />
      <ProductCardList
        path={`/products`}
        products={products}
        cols={3}
        size="s"
        limit={5}
        query={{ from: 'home', section: 'trending' }}
      />
      {products.length >= 5 && (
        <div className="mt-5 flex justify-center">
          <div className="flex items-center justify-center rounded-2xl border border-gray-300 px-4 py-2 text-center text-sm font-medium text-[#434343]">
            <Link href={`/products?section=trending`}>상품 더보기</Link>
            <NextIcon />
          </div>
        </div>
      )}
    </div>
  );
}
