'use client';

import React, { useMemo, useState, useEffect } from 'react';
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

  // 선택된 API 카테고리 및 탭 상태
  const apiCategory = getApiCategory(categoryName);
  const [category, setCategory] = useState<CategoryTab>('전체');

  // 선택된 서브카테고리 key (필터 옵션 스코프에 사용)
  const selectedSubKey =
    category !== '전체' ? subCategories.find((s) => s.name === category)?.key : undefined;

  // 카테고리에 맞는 필터 옵션을 가져옵니다 (선택된 서브카테고리 key를 전달하여 해당 서브 전용 필터만 노출)
  const { isLoading: isLoadingFilters, filterGroups } = useFilterOptions(
    apiCategory,
    selectedSubKey,
  );

  // 실제 상품 데이터 가져오기
  const { data: productData, isLoading: isLoadingProducts } = useProductsConstantlyPopularMapped(
    0,
    100,
    apiCategory,
  );

  // 실제 상품 목록
  const products = productData?.items || [];

  // 보조: 범위 표현 파서 (예: (0,10000), [10000,20000), [4,))
  const parseRange = (expr: string) => {
    const m = expr.match(/^[\[(]\s*([\d.]+)?\s*,\s*([\d.]*)\s*[)\]]$/);
    if (!m) return null as null | { min?: number; minInc: boolean; max?: number; maxInc: boolean };
    const min = m[1] ? Number(m[1]) : undefined;
    const max = m[2] ? Number(m[2]) : undefined;
    return {
      min,
      max,
      minInc: expr.startsWith('['),
      maxInc: expr.endsWith(']'),
    };
  };

  // 선택된 탭과 필터 기반 + 정렬까지 적용한 상품 목록 계산
  const finalList = useMemo(() => {
    let result = products.slice();

    // 0) 루트카테고리 1차 필터링 (백엔드 파라미터 외에 클라이언트에서도 보정)
    result = result.filter((p: any) => p.rootCategory === apiCategory);

    // 1) 서브카테고리 필터링 (탭)
    if (category !== '전체') {
      result = result.filter(
        (p: any) => p.subCategory === category || p.subCategory === selectedSubKey,
      );
    }

    // 2) API 기반 필터링 (필터 시트)
    Object.entries(filters).forEach(([key, values]) => {
      const selected = values as string[];
      if (!selected || selected.length === 0) return;

      result = result.filter((product: any) => {
        // PRICE: 가격 범위 처리 (기존 로직 보완)
        if (key === 'PRICE') {
          return selected.some((expression) => {
            const range = parseRange(expression);
            const price = product.price as number;
            if (range) {
              const ge =
                range.min == null ? true : range.minInc ? price >= range.min : price > range.min;
              const le =
                range.max == null ? true : range.maxInc ? price <= range.max : price < range.max;
              return ge && le;
            }
            // 백업: 하드코딩된 구간 문자열 지원
            if (expression.includes('(0,10000)')) return price < 10000;
            if (expression.includes('[10000,20000)')) return price >= 10000 && price < 20000;
            if (expression.includes('[20000,30000)')) return price >= 20000 && price < 30000;
            if (expression.includes('[30000,40000)')) return price >= 30000 && price < 40000;
            if (expression.includes('[40000,)')) return price >= 40000;
            return true;
          });
        }

        // 그 외 키는 우선 product.options 값과의 일치로 필터링
        const optVal = (product as any).options?.[key] as string | undefined;
        if (optVal) {
          if (selected.includes(optVal)) return true; // 정확히 같은 값

          // 숫자 형태면 숫자 비교(예: WEIGHT 등)
          const num = Number(optVal);
          if (!Number.isNaN(num)) {
            return selected.some((expression) => {
              const r = parseRange(expression);
              if (r) {
                const ge = r.min == null ? true : r.minInc ? num >= r.min : num > r.min;
                const le = r.max == null ? true : r.maxInc ? num <= r.max : num < r.max;
                return ge && le;
              }
              // 숫자 문자열과 동일 비교도 지원
              if (!Number.isNaN(Number(expression))) return Number(expression) === num;
              return false;
            });
          }

          // 기타 텍스트(예: SINGLE_ITEM, TASTE, ORGANIC)는 포함 여부로 필터링
          return selected.some((s) => s === optVal);
        }

        // 옵션값이 없지만 RATING 같은 경우 rating 필드로 백업 비교
        if (key === 'RATING') {
          const rating = Number(product.rating) || 0;
          return selected.some((expression) => {
            const r = parseRange(expression);
            if (r) {
              const ge = r.min == null ? true : r.minInc ? rating >= r.min : rating > r.min;
              const le = r.max == null ? true : r.maxInc ? rating <= r.max : rating < r.max;
              return ge && le;
            }
            const n = Number(expression);
            if (!Number.isNaN(n)) return Math.floor(rating) === Math.floor(n);
            // 예: '4+', '4 이상'
            if (/^\s*([\d.]+)\s*\+\s*$/.test(expression)) {
              const n2 = Number(RegExp.$1);
              return rating >= n2;
            }
            return true;
          });
        }

        // 기본 통과
        return true;
      });
    });

    // 3) 정렬 적용
    const sorted = result.slice();
    switch (sort) {
      case 'new': {
        sorted.sort((a: any, b: any) => {
          const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
          const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
          return tb - ta;
        });
        break;
      }
      case 'popular': {
        // 인기순: 리뷰수 우선, 동률 시 평점
        sorted.sort((a: any, b: any) => {
          const r1 = (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
          if (r1 !== 0) return r1;
          return (b.rating ?? 0) - (a.rating ?? 0);
        });
        break;
      }
      case 'review': {
        // 리뷰많은순
        sorted.sort((a: any, b: any) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
      }
      case 'priceLow': {
        sorted.sort((a: any, b: any) => (a.price ?? 0) - (b.price ?? 0));
        break;
      }
      default:
        // recommended: 원본 순서 유지
        break;
    }

    return sorted;
  }, [products, category, selectedSubKey, filters, sort, apiCategory]);

  // 디버깅: 현재 페이지에서 필터링된 리스트 콘솔 출력
  useEffect(() => {
    // 페이지 진입/필터 변경/탭 변경/데이터 로딩 후 업데이트 시 모두 출력
    console.log('[CategoryPage] filtered list', {
      rootCategory: apiCategory,
      subCategoryTab: category,
      subCategoryKey: selectedSubKey,
      count: finalList.length,
      items: finalList,
    });
  }, [apiCategory, category, selectedSubKey, finalList]);

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
            productCount={finalList.length}
          />
        )}
      </div>
    </div>
  );

  const ProductGrid = ({ items }: { items: any[] }) => (
    <div className="px-4 pb-12">
      <ProductCardList
        products={items as unknown as Product[]}
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
      <Toolbar total={finalList.length} />
      <main className="mb-15">
        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-neutral-500">상품을 불러오는 중...</div>
          </div>
        ) : (
          <ProductGrid items={finalList} />
        )}
      </main>
    </div>
  );
}
