'use client';

import { useState } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Product } from '@/types/product';

import RatingStarIcon from '@/assets/icons/common/rating-star-14px.svg';
import ReviewIcon from '@/assets/icons/common/review-14px.svg';

import HeartIcon from '@/assets/icons/common/heart-active-24px.svg';
import LikeIcon from '@/assets/icons/common/empty-like-24px.svg';
import { useLikedStore } from '@/store/useLikedStore';
import Image from 'next/image';

/**
 * product-card
 */
type ProductCardProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
  p: Product;

  path: string; // 기본 path
  query?: Record<string, string>; // 추가 query
  showHeart?: boolean; // 하트 노출 여부
  showCartButton?: boolean; // 장바구니 버튼 노출 여부

  onHeartClick?: (p: Product) => void; // 클릭 이벤트
};

const cardVariants = {
  s: {
    wrapper: 'py-1',
    image: 'aspect-[1/1]',
    title: 'text-sm font-medium text-black block pt-2 truncate',
    price: 'text-sm font-bold text-black block pb-1',
    meta: 'text-xs gap-2',
  },
  m: {
    wrapper: 'py-1',
    image: 'aspect-[1/1]',
    title: 'text-base font-medium text-black block pt-2 truncate',
    price: 'text-base font-bold text-black block pb-1',
    meta: 'text-sm gap-2',
  },
  l: {
    wrapper: 'py-1',
    image: 'aspect-[8/9]',
    title: 'text-lg font-semibold text-black block pt-2 truncate',
    price: 'text-lg font-bold text-black block pb-1',
    meta: 'text-sm gap-2',
  },
};

function ProductCard({
  size = 'm',
  className,
  path,
  p,
  query,
  showHeart = false,
  showCartButton = false,
}: ProductCardProps) {
  const variant = cardVariants[size];
  const toggleLike = useLikedStore((state) => state.toggle);
  const isLiked = useLikedStore((state) => state.isLiked(p.id));
  const [isHovered, setIsHovered] = useState(false);

  const queryString = query
    ? '?' +
      Object.entries(query)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    : '';

  return (
    <div
      className={cn('flex flex-col rounded bg-white', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`${path}/${p.id}${queryString}`}>
        {/* 이미지 영역 */}
        <div
          className={cn('relative mb-2 w-full overflow-hidden rounded bg-gray-200', variant.image)}
        >
          {p.imageUrl && (
            <Image
              src={p.imageUrl}
              alt={p.title}
              fill
              sizes="(max-width:768px) 33vw, 200px"
              className="object-cover"
              unoptimized
            />
          )}
          {showHeart && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault(); // 링크 이동 막음
                toggleLike(p.id);
              }}
              className="absolute right-4 bottom-3 z-10"
            >
              {isLiked ? <HeartIcon /> : <LikeIcon />}
            </button>
          )}
        </div>

        {/* 정보 영역 */}
        <div className={cn('flex flex-col', variant.wrapper)}>
          <span className="text-xs text-gray-500">{p.store}</span>
          <span className={variant.title}>{p.title}</span>
          <span className={variant.price}>{p.price.toLocaleString()}원</span>
          <div className={cn('flex items-center text-gray-500', variant.meta)}>
            <div className="flex items-center gap-1">
              <RatingStarIcon />
              <span>{p.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <ReviewIcon />
              <span>{p.reviewCount}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* 장바구니 담기 버튼 */}
      {showCartButton && (
        <div className={`transition-all duration-200`}>
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-1 rounded border border-stone-300 bg-white px-4"
            onClick={(e) => {
              e.preventDefault();
              console.log('장바구니에 추가:', p.title);
            }}
          >
            <div className="text-base leading-normal font-normal text-gray-800">장바구니 담기</div>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * product-card-list
 */
interface ProductCardListProps {
  products: Product[];
  path: string;
  size?: 's' | 'm' | 'l';
  layout?: 'grid' | 'list' | 'horizontal';
  cols?: 2 | 3 | 4;
  limit?: number;
  showHeart?: boolean; // 하트 노출 여부 이벤트
  showCartButton?: boolean; // 장바구니 버튼 노출 여부
  query?: Record<string, string>; // ProductCard에 전달
}

function ProductCardList({
  products,
  path,
  size = 'm',
  layout = 'grid',
  cols = 2,
  limit,
  showHeart = false,
  showCartButton = false,
  query,
}: ProductCardListProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[cols];

  const visibleProducts = limit ? products.slice(0, limit) : products;

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {visibleProducts.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            path={path}
            query={query}
            size={size}
            showHeart={showHeart}
            showCartButton={showCartButton}
          />
        ))}
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className="flex gap-3 overflow-x-auto">
        {visibleProducts.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            path={path}
            query={query}
            size={size}
            showHeart={showHeart}
            showCartButton={showCartButton}
            className="min-w-[150px] flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('grid gap-3', gridCols)}>
      {visibleProducts.map((p) => (
        <ProductCard
          key={p.id}
          p={p}
          path={path}
          query={query}
          size={size}
          showHeart={showHeart}
          showCartButton={showCartButton}
        />
      ))}
    </div>
  );
}

export { ProductCard, ProductCardList };
