'use client';

import clsx from 'clsx';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Product } from '@/types/product';

import RatingStarIcon from '@/assets/icons/common/rating-star-14px.svg';
import ReviewIcon from '@/assets/icons/common/review-14px.svg';
import HeartIcon from '@/assets/icons/common/heart-24px.svg';
import LikeIcon from '@/assets/icons/common/like-24px.svg';
import { useState } from 'react';

// <HeartIcon className="h-8 w-8 fill-red-500" />
// <LikeIcon className="h-8 w-8 fill-pink-500" />

/**
 * product-card
 */
type ProductCardProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
  p: Product;
  showHeart?: boolean; // 하트 노출 여부
  onHeartClick?: (p: Product) => void; // 클릭 이벤트
};

const cardVariants = {
  s: {
    wrapper: 'p-1',
    image: 'aspect-[9/10]',
    title: 'text-sm font-medium',
    price: 'text-sm font-bold',
    meta: 'text-xs gap-1',
  },
  m: {
    wrapper: 'p-2',
    image: 'aspect-[5/6]',
    title: 'text-base font-medium',
    price: 'text-base font-bold',
    meta: 'text-sm gap-1',
  },
  l: {
    wrapper: 'p-2',
    image: 'aspect-[8/9]',
    title: 'text-lg font-semibold',
    price: 'text-lg font-bold',
    meta: 'text-sm gap-1',
  },
};

function ProductCard({
  size = 'm',
  className,
  p,
  showHeart = false,
  onHeartClick,
}: ProductCardProps) {
  const variant = cardVariants[size];

  return (
    <Link href={String(p.id)} className={cn('flex flex-col rounded-lg bg-white', className)}>
      {/* 이미지 영역 */}
      <div className={cn('relative mb-2 w-full rounded-sm bg-gray-200', variant.image)}>
        {showHeart && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // 링크 이동 막음
              onHeartClick?.(p);
            }}
            className="absolute right-4 bottom-3 z-10"
          >
            {p.isLiked ? <HeartIcon /> : <LikeIcon />}
          </button>
        )}
      </div>

      {/* 정보 영역 */}
      <div className={cn('flex flex-col gap-1', variant.wrapper)}>
        <span className="text-xs text-gray-500">{p.store}</span>
        <span className={variant.title}>{p.title}</span>
        <span className={variant.price}>{p.price.toLocaleString()}원</span>
        <div className={cn('flex items-center text-gray-500', variant.meta)}>
          <RatingStarIcon />
          <span>{p.rating}</span>
          /<ReviewIcon />
          <span>{p.reviewCount}</span>
        </div>
      </div>
    </Link>
  );
}

/**
 * product-card-list
 */
interface ProductCardListProps {
  products: Product[];
  size?: 's' | 'm' | 'l';
  layout?: 'grid' | 'list' | 'horizontal';
  cols?: 2 | 3 | 4;
  limit?: number;
  showHeart?: boolean; // 하트 노출 여부 이벤트
}

function ProductCardList({
  products,
  size = 'm',
  layout = 'grid',
  cols = 2,
  limit,
  showHeart = false,
}: ProductCardListProps) {
  const [localProducts, setLocalProducts] = useState(products);

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[cols];

  const visibleProducts = limit ? localProducts.slice(0, limit) : localProducts;

  const handleHeartClick = (product: Product) => {
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isLiked: !p.isLiked } : p)),
    );
  };

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {visibleProducts.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            p={p}
            size={size}
            showHeart={showHeart}
            onHeartClick={handleHeartClick}
          />
        ))}
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className="flex gap-4 overflow-x-auto py-2">
        {visibleProducts.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            p={p}
            size={size}
            showHeart={showHeart}
            onHeartClick={handleHeartClick}
            className="min-w-[150px] flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('grid gap-4', gridCols)}>
      {visibleProducts.map((p) => (
        <ProductCard
          key={p.id}
          {...p}
          p={p}
          size={size}
          showHeart={showHeart}
          onHeartClick={handleHeartClick}
        />
      ))}
    </div>
  );
}

export { ProductCard, ProductCardList };
