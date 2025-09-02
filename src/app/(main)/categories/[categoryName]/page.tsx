'use client';

import React, { useMemo, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import FilterIcon from '@/assets/icons/filter.svg';
import DownIcon from '@/assets/icons/down.svg';
import { categoryMap } from '@/constants/categories';
import { ProductCardList } from '@/components/card/Product';
import { Product } from '@/types/product';
import HeaderCustom from '@/components/HeaderCustom';

export default function CategoryPage() {
  const params = useParams();
  const categoryName = typeof params.categoryName === 'string' ? params.categoryName : '';

  if (!categoryMap[categoryName]) {
    notFound();
  }

  type Category = '전체' | '과일' | '채소' | '쌀/잡곡';

  const CATEGORIES: Category[] = ['전체', '과일', '채소', '쌀/잡곡'];

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

  const placeholder = (w: number, h: number) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
        <rect width='100%' height='100%' fill='#e5e7eb'/>
      </svg>`,
    )}`;

  const CategoryTabs = ({
    value,
    onChange,
  }: {
    value: Category;
    onChange: (c: Category) => void;
  }) => (
    <nav aria-label="카테고리" className="mt-15 border-b-1 border-[#86C53A]">
      <div className="flex gap-6 px-4">
        {CATEGORIES.map((c) => {
          const active = c === value;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={active}
              className={`py-3 text-sm ${active ? 'border-b-2 border-[#86C53A] font-semibold text-green-700' : 'text-neutral-500'}`}
              onClick={() => onChange(c)}
            >
              {c}
            </button>
          );
        })}
      </div>
    </nav>
  );

  const Toolbar = ({ total }: { total: number }) => (
    <div className="flex items-center justify-between px-4 py-4">
      <span className="text-xs text-neutral-700">총 {total}개</span>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-8 items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-900"
          aria-label="정렬"
        >
          리스트 순 <DownIcon />
        </button>
        <button
          className="inline-flex h-8 items-center gap-1 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-900"
          aria-label="필터"
        >
          필터 <FilterIcon />
        </button>
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

  const [category, setCategory] = useState<Category>('전체');
  const filtered = useMemo(() => {
    if (category === '전체') return MOCK_PRODUCTS_WITH_CATEGORY;
    return MOCK_PRODUCTS_WITH_CATEGORY.filter((p) => p.category === category);
  }, [category]);

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
