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
import { useProductsConstantlyPopularMapped } from '@/hooks/products/useProduct';

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
    <nav aria-label="카테고리" className="mt-15 border-b-1 border-[#f2f2f2]">
      <div className="flex gap-6 overflow-x-auto px-4">
        {categoryTabs.map((c) => {
          const active = c === value;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={active}
              className={`pb-1 text-base font-medium whitespace-nowrap ${active ? 'border-b-2 border-[#86C53A] font-semibold text-[#86C53A]' : 'text-[#a6a6a6]'}`}
              onClick={() => onChange(c)}
            >
              {c}
            </button>
          );
        })}
      </div>
    </nav>
  );

  // 선택된 API 카테고리
  const apiCategory = getApiCategory(categoryName);

  // 실제 상품 데이터 가져오기
  const { data: productData, isLoading: isLoadingProducts } = useProductsConstantlyPopularMapped(
    0,
    100,
    apiCategory,
  );

  // 실제 상품 목록
  const products = productData?.items || [];

  // 선택된 탭과 필터 기반 상품 목록 계산
  const [category, setCategory] = useState<CategoryTab>('전체');
  const filtered = useMemo(() => {
    let result = products;

    // 서브카테고리 필터링
    if (category !== '전체') {
      // 서브카테고리 이름으로 필터링
      result = result.filter((p) => p.subCategory === category);
    }

    // API 기반 필터링
    Object.entries(filters).forEach(([key, values]) => {
      if (values && (values as unknown[]).length > 0) {
        result = result.filter((product) => {
          // 가격 필터
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
  }, [products, category, filters]);

  const Toolbar = ({ total }: { total: number }) => (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-[#6f6f6f]">총 {total}개</span>
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

  const ProductGrid = ({ items }: { items: any[] }) => (
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
        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-neutral-500">상품을 불러오는 중...</div>
          </div>
        ) : (
          <ProductGrid items={filtered} />
        )}
      </main>
    </div>
  );
}
