'use client';

import { useState } from 'react';
import Title from '@/components/ui/Title';
import { ChipsList } from '@/components/ui/Chips';
import { ProductCardList } from '@/components/card/Product';
import Link from 'next/link';
import NextIcon from '@/assets/icons/common/next-20px.svg';
import { categories } from '@/constants/categories';
import { useProductsConstantlyPopularMapped } from '@/hooks/products/useProduct';
import { Category } from '@/types/category';

function ConstantlyPopularProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, error } = useProductsConstantlyPopularMapped(
    0,
    20,
    selectedCategory,
  );

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category?.rootCategory);
  };

  if (isLoading) {
    return (
      <div className="mb-10">
        <Title text="꾸준히 사랑받는 상품" />
        <div className="mt-2 text-sm text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (isError || !data || !data.items) {
    return (
      <div className="mb-10">
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

  // 데이터가 이미 올바른 형태로 매핑되어 있음
  const products = data.items;

  // 더보기 링크에 현재 선택된 카테고리 포함
  const moreLink = selectedCategory
    ? `/products?section=popular&category=${selectedCategory}`
    : `/products?section=popular`;

  return (
    <div className="mb-10">
      <Title text="꾸준히 사랑받는 상품" />
      <ProductCardList
        path={`/products`}
        products={products}
        cols={3}
        size="s"
        limit={6}
        query={{ from: 'home', section: 'popular' }}
      />
      {products.length >= 6 && (

        <div className="mt-5 flex justify-center">
          <div className="flex items-center justify-center rounded-2xl border border-gray-300 px-4 py-2 text-center text-sm font-medium text-[#434343]">
            <Link href={moreLink}>상품 더보기</Link>
            <NextIcon />
          </div>
        </div>
      )}
    </div>
  );
}

export default ConstantlyPopularProducts;
