'use client';

import React, { useMemo, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import FilterIcon from '@/assets/icons/filter.svg';
import DownIcon from '@/assets/icons/down.svg';
import { categoryMap } from '@/constants/categories';
import { ProductCardList } from '@/components/card/Product';
import { Product } from '@/types/product';
import HeaderCustom from '@/components/HeaderCustom';
import { useFilterOptions } from '@/hooks/filter/useFilterOptions';
import { ApiCategory, getRootCategories } from '@/api/filters';
import { SortSheet, SortKey } from '@/components/filter';
import { FilterSheet } from '@/components/filter/FilterSheet';
import { FilterState } from '@/components/filter/types';
import { useQuery } from '@tanstack/react-query';

export default function CategoryPage() {
  const params = useParams();
  const categoryName = typeof params.categoryName === 'string' ? params.categoryName : '';

  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [filters, setFilters] = useState<FilterState>({} as FilterState);

  // 카테고리 slug를 API 카테고리로 매핑
  const getApiCategory = (slug: string): ApiCategory => {
    const mapping: Record<string, ApiCategory> = {
      'fresh-food': 'FRESH_FOOD',
      'meat-seafood': 'MEAT_SEAFOOD',
      'dairy-beverage': 'DAIRY_BEVERAGE',
      'ready-meal': 'CONVENIENCE_FOOD',
      snack: 'SNACK',
      'health-food': 'HEALTH_SUPPLEMENTS',
      'daily-goods': 'DAILY_GOODS',
      hygiene: 'HYGIENE',
      pets: 'PET_SUPPLIES',
      baby: 'BABY_SUPPLIES',
    };
    return mapping[slug] || 'FRESH_FOOD';
  };

  // 카테고리에 맞는 필터 옵션을 가져옵니다
  const { isLoading: isLoadingFilters, filterGroups } = useFilterOptions(
    getApiCategory(categoryName),
  );

  // 루트 카테고리 데이터를 가져와서 서브카테고리 탭 생성
  const { data: rootCategoriesData } = useQuery({
    queryKey: ['rootCategories'],
    queryFn: getRootCategories,
    staleTime: 10 * 60 * 1000, // 10분간 캐시
  });

  // 현재 카테고리의 서브카테고리들 가져오기
  const currentCategory = rootCategoriesData?.data?.find(
    (cat) => cat.key === getApiCategory(categoryName),
  );
  const subCategories = currentCategory?.subCategories || [];

  // 탭 타입을 동적으로 생성
  type CategoryTab = '전체' | string;
  const categoryTabs: CategoryTab[] = ['전체', ...subCategories.map((sub) => sub.name)];

  if (!categoryMap[categoryName]) {
    notFound();
  }

  const CategoryTabs = ({
    value,
    onChange,
  }: {
    value: CategoryTab;
    onChange: (c: CategoryTab) => void;
  }) => (
    <nav aria-label="카테고리" className="mt-15 border-b-1 border-[#86C53A]">
      <div className="flex gap-6 overflow-x-auto px-4">
        {categoryTabs.map((c) => {
          const active = c === value;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={active}
              className={`py-3 text-sm whitespace-nowrap ${active ? 'border-b-2 border-[#86C53A] font-semibold text-green-700' : 'text-neutral-500'}`}
              onClick={() => onChange(c)}
            >
              {c}
            </button>
          );
        })}
      </div>
    </nav>
  );

  const MOCK_PRODUCTS: Product[] = [
    {
      id: 1,
      title: 'Product',
      store: 'Store',
      price: 10000,
      rating: 4.8,
      reviewCount: 500,
    },
    {
      id: 2,
      title: 'Product',
      store: 'Store',
      price: 3000,
      rating: 4.6,
      reviewCount: 120,
    },
    {
      id: 3,
      title: 'Product',
      store: 'Store',
      price: 18000,
      rating: 4.7,
      reviewCount: 320,
    },
    {
      id: 4,
      title: 'Product',
      store: 'Store',
      price: 90000,
      rating: 4.9,
      reviewCount: 820,
    },
  ];

  // 카테고리별 필터링을 위한 확장된 Product 타입
  const MOCK_PRODUCTS_WITH_CATEGORY = [
    { ...MOCK_PRODUCTS[0], category: '과일' },
    { ...MOCK_PRODUCTS[1], category: '채소' },
    { ...MOCK_PRODUCTS[2], category: '쌀/잡곡' },
    { ...MOCK_PRODUCTS[3], category: '과일' },
  ];

  // 선택된 탭과 필터 기반 상품 목록 계산
  const [category, setCategory] = useState<CategoryTab>('전체');
  const filtered = useMemo(() => {
    let result = MOCK_PRODUCTS_WITH_CATEGORY;

    // 카테고리 필터링
    if (category !== '전체') {
      result = result.filter((p) => p.category === category);
    }

    // API 기반 필터링
    Object.entries(filters).forEach(([key, values]) => {
      if (values && (values as unknown[]).length > 0) {
        result = result.filter((product) => {
          // 현재는 가격 필터만 예시로 구현
          if (key === 'PRICE') {
            return (values as string[]).some((expression: string) => {
              const price = product.price;
              if (expression.includes('(0,10000)')) return price < 10000;
              if (expression.includes('[10000,20000)')) return price >= 10000 && price < 20000;
              if (expression.includes('[20000,30000)')) return price >= 20000 && price < 30000;
              if (expression.includes('[30000,40000)')) return price >= 30000 && price < 40000;
              if (expression.includes('[40000,)')) return price >= 40000;
              return true;
            });
          }
          return true; // 다른 필터들은 임시로 통과
        });
      }
    });

    return result;
  }, [category, filters]);

  const Toolbar = ({ total }: { total: number }) => (
    <div className="flex items-center justify-between px-4 py-4">
      <span className="text-xs text-neutral-700">총 {total}개</span>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-8 items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-900"
          aria-label="정렬"
          onClick={() => setSheetOpen(true)}
        >
          리스트 순 <DownIcon />
        </button>

        <SortSheet open={sheetOpen} onOpenChange={setSheetOpen} value={sort} onChange={setSort} />
        <button
          className="inline-flex h-8 items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-900"
          aria-label="필터"
          onClick={() => setFilterSheetOpen(true)}
          disabled={isLoadingFilters}
        >
          필터 <FilterIcon />
        </button>
        {filterGroups.length > 0 && (
          <FilterSheet
            open={filterSheetOpen}
            onOpenChange={setFilterSheetOpen}
            filterGroups={filterGroups}
            filters={filters}
            onChange={setFilters}
            productCount={filtered.length}
          />
        )}
      </div>
    </div>
  );

  const ProductGrid = ({ items }: { items: Product[] }) => (
    <div className="px-4 pb-12">
      <ProductCardList
        products={items}
        path="/products"
        size="m"
        layout="grid"
        cols={2}
        showHeart={true}
        showCartButton={true}
      />
    </div>
  );

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      <HeaderCustom title={categoryMap[categoryName]} showBack showHome showSearch showCart />
      <CategoryTabs value={category} onChange={setCategory} />
      <Toolbar total={filtered.length} />
      <main className="mb-15">
        <ProductGrid items={filtered} />
      </main>
    </div>
  );
}
