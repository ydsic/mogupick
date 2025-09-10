'use client';

import Title from '@/components/ui/Title';
import { ChipsList } from '@/components/ui/Chips';
import { ProductCardList } from '@/components/card/Product';
import Link from 'next/link';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import { categories } from '@/constants/categories';
import { useProductsConstantlyPopular } from '@/hooks/products/useProduct';

function ConstantlyPopularProducts() {
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
      <ChipsList categories={categories} />
      <ProductCardList
        path={`/products`}
        products={products}
        cols={3}
        size="s"
        limit={6}
        query={{ from: 'home', section: 'popular' }}
      />
      {products.length >= 6 && (
        <div className="flex justify-center">
          <div className="flex items-center justify-center rounded-2xl border border-gray-400 px-6 py-2 text-center text-base">
            <Link href={`/products?section=popular`}>상품 더보기</Link>
            <NextIcon />
          </div>
        </div>
      )}
    </div>
  );
}

export default ConstantlyPopularProducts;
