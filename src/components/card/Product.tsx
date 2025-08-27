import clsx from 'clsx';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Product } from '@/types/product';

import RatingStarIcon from '@/assets/icons/common/rating-star-14px.svg';
import ReviewIcon from '@/assets/icons/common/review-14px.svg';

/**
 * product-card
 */
type ProductCardProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
  p: Product;
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

function ProductCard({ size = 'm', className, p }: ProductCardProps) {
  const variant = cardVariants[size];

  return (
    <Link href={String(p.id)} className={cn('flex flex-col rounded-lg bg-white', className)}>
      {/* 이미지 영역 */}
      <div className={cn('mb-2 w-full rounded-sm bg-gray-200', variant.image)} />

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
}

function ProductCardList({
  products,
  size = 'm',
  layout = 'grid',
  cols = 2,
}: ProductCardListProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[cols];

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} p={p} size={size} />
        ))}
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className="flex gap-4 overflow-x-auto py-2">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            p={p}
            size={size}
            className="min-w-[150px] flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('grid gap-4', gridCols)}>
      {products.map((p) => (
        <ProductCard key={p.id} {...p} p={p} size={size} />
      ))}
    </div>
  );
}

export { ProductCard, ProductCardList };
