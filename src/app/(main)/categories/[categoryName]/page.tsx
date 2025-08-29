'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Header from '../../(home)/_components/Header';
import { useParams, notFound } from 'next/navigation';
import ReviewIcon from '@/assets/icons/review.svg';
import LikeIcon from '@/assets/icons/like.svg';
import FilterIcon from '@/assets/icons/filter.svg';
import DownIcon from '@/assets/icons/down.svg';
import StarIcon from '@/assets/icons/star.svg';
import { categoryMap } from '@/constants/categories';

export default function CategoryPage() {
  const params = useParams();
  const categoryName = typeof params.categoryName === 'string' ? params.categoryName : '';

  if (!categoryMap[categoryName]) {
    notFound();
  }

  type Category = '전체' | '과일' | '채소' | '쌀/잡곡';
  type Product = {
    id: string;
    category: Category;
    store: string;
    name: string;
    price: string;
    rating: number; // 0~5
    reviews: number;
    imageUrl?: string; // 없으면 placeholder
  };

  const CATEGORIES: Category[] = ['전체', '과일', '채소', '쌀/잡곡'];

  const MOCK_PRODUCTS: Product[] = [
    {
      id: 'p1',
      category: '과일',
      store: 'Store',
      name: 'Product',
      price: '10,000',
      rating: 4.8,
      reviews: 500,
    },
    {
      id: 'p2',
      category: '채소',
      store: 'Store',
      name: 'Product',
      price: '3,000',
      rating: 4.6,
      reviews: 120,
    },
    {
      id: 'p3',
      category: '쌀/잡곡',
      store: 'Store',
      name: 'Product',
      price: '18,000',
      rating: 4.7,
      reviews: 320,
    },
    {
      id: 'p4',
      category: '과일',
      store: 'Store',
      name: 'Product',
      price: '90,000',
      rating: 4.9,
      reviews: 820,
    },
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
    <nav aria-label="카테고리" className="mt-15 max-w-md">
      <div className="flex gap-6 border-b border-neutral-200">
        {CATEGORIES.map((c) => {
          const active = c === value;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={active}
              className={`py-3 text-sm ${active ? 'border-b-2 border-green-700 font-semibold text-green-700' : 'text-neutral-500'}`}
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
    <div className="mx-auto flex max-w-md items-center justify-between py-4">
      <span className="text-xs text-neutral-700">총 {total}개</span>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-1 items-center gap-1 rounded-full border border-neutral-200 px-3 text-xs text-neutral-900"
          aria-label="정렬"
        >
          리스트 순 <DownIcon />
        </button>
        <button
          className="inline-flex h-1 items-center gap-1 rounded-full border border-neutral-200 px-3 text-xs text-neutral-900"
          aria-label="필터"
        >
          필터 <FilterIcon />
        </button>
      </div>
    </div>
  );

  const ProductCard = ({ p }: { p: Product }) => {
    return (
      <article className="w-full max-w-[11rem] select-none" aria-labelledby={`p-${p.id}-title`}>
        <div className="relative h-48 w-full overflow-hidden rounded bg-neutral-200">
          <Image
            src={p.imageUrl || placeholder(320, 320)}
            alt={p.name}
            fill
            sizes="176px"
            className="object-cover"
            priority={false}
          />
          <LikeIcon className="absolute right-2 bottom-2" />
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-neutral-600">{p.store}</p>
          <h3 id={`p-${p.id}-title`} className="truncate text-sm font-medium text-neutral-900">
            {p.name}
          </h3>
          <p className="text-base font-semibold text-neutral-900">{p.price}원</p>
          <div className="flex items-center gap-2 text-xs text-neutral-800">
            <span className="inline-flex items-center gap-0.5">
              <span className="inline-flex">
                <StarIcon />
              </span>
              {p.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <ReviewIcon />
              {p.reviews}
            </span>
          </div>
        </div>
      </article>
    );
  };

  const ProductGrid = ({ items }: { items: Product[] }) => (
    <div className="mx-auto max-w-md pb-12">
      <div className="grid grid-cols-2 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );

  const [category, setCategory] = useState<Category>('전체');
  const filtered = useMemo(() => {
    if (category === '전체') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      <Header categoryName={categoryName} />
      <CategoryTabs value={category} onChange={setCategory} />
      <Toolbar total={filtered.length} />
      <main className="mb-15">
        <ProductGrid items={filtered} />
      </main>
    </div>
  );
}
