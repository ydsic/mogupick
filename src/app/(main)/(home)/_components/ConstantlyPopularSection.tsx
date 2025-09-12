'use client';

import Title from '@/components/ui/Title';
import { ProductCardList } from '@/components/card/Product';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import { useProductsConstantlyPopularMapped } from '@/hooks/products/useProduct';
import React, { useState } from 'react';

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
  // API 카테고리 매핑 (constants 내부 rootCategory 값 불일치 보정)
  const apiCategoryMap: Record<string, string> = {
    FRESH_FOOD: 'FRESH_FOOD',
    MEAT_SEAFOOD: 'MEAT_SEAFOOD',
    DAIRY_BEVERAGE: 'DAIRY_BEVERAGE',
    READY_MEAL: 'CONVENIENCE_FOOD', // 간편식 변환
    SNACK: 'SNACK',
    HEALTH_FOOD: 'HEALTH_SUPPLEMENTS', // 건강식품 변환
    DAILY_GOODS: 'DAILY_GOODS',
    HYGIENE: 'HYGIENE',
    PETS: 'PET_SUPPLIES', // 반려동물 변환
    BABY: 'BABY_SUPPLIES', // 육아용품 변환
  };

  const categoryTabs = [
    { label: '신선식품', key: 'FRESH_FOOD' },
    { label: '정육·수산물', key: 'MEAT_SEAFOOD' },
    { label: '유제품·음료', key: 'DAIRY_BEVERAGE' },
    { label: '간편식', key: 'READY_MEAL' },
    { label: '간식', key: 'SNACK' },
    { label: '건강식품', key: 'HEALTH_FOOD' },
    { label: '생활잡화', key: 'DAILY_GOODS' },
    { label: '위생용품', key: 'HYGIENE' },
    { label: '반려동물', key: 'PETS' },
    { label: '육아용품', key: 'BABY' },
  ];

  const [selectedRoot, setSelectedRoot] = useState<string>(categoryTabs[0].key);

  // 한 번만 전체 상품 데이터 호출
  const { data, isLoading, isError, error } = useProductsConstantlyPopularMapped(0, 20);

  // 카테고리별로 상품 분류
  const productsByCategory = React.useMemo(() => {
    const result: Record<string, any[]> = {};
    if (!data?.items) return result;
    for (const tab of categoryTabs) {
      result[tab.key] = data.items.filter(
        (item: any) => item.option?.rootCategory === apiCategoryMap[tab.key],
      );
    }
    return result;
  }, [data]);

  const products = productsByCategory[selectedRoot] ?? [];

  if (isLoading) {
    return (
      <div>
        <Title text="꾸준히 사랑받는 상품" />
        <Tabs />
        <div className="mt-2 text-sm text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <Title text="꾸준히 사랑받는 상품" />
        <Tabs />
        <div className="mt-2 text-sm text-red-500">데이터를 불러올 수 없습니다.</div>
        {error && (
          <pre className="text-xs whitespace-pre-wrap text-gray-400">
            {(error as Error).message}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div>
      <Title text="꾸준히 사랑받는 상품" />
      <Tabs />
      <ProductCardList
        path={`/products`}
        products={products}
        limit={4}
        query={{
          from: 'home',
          section: 'constantly-popular',
          rootCategory: apiCategoryMap[selectedRoot],
        }}
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
