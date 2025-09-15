'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import { incrementProductViewCount } from '@/api/product';

interface Product {
  id: number;
  store: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  image?: string;
}

interface HorizontalProductCardProps {
  product: Product;
  className?: string;
}

export function HorizontalProductCard({ product, className }: HorizontalProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={cn('w-36 flex-shrink-0', className)}
      onClick={() => {
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(`pv:${product.id}`, String(Date.now()));
          }
          void incrementProductViewCount(product.id);
        } catch (e) {
          // 실패는 무시
        }
      }}
    >
      <div className="flex w-full flex-col items-start justify-start">
        <div className="relative h-36 w-36 overflow-hidden rounded bg-zinc-300">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="144px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-300">
                <span className="text-xs text-gray-400">이미지</span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 flex w-full flex-col items-start justify-start gap-1">
          <div className="w-full justify-start truncate text-xs leading-none font-normal text-gray-500">
            {product.store}
          </div>
          <div className="flex w-full flex-col items-start justify-start">
            <div className="w-full truncate text-sm leading-tight font-medium break-words text-gray-800">
              {product.title}
            </div>
            <div className="justify-start text-base leading-normal font-semibold text-black">
              {product.price.toLocaleString()}원
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-2">
            <div className="flex items-center justify-start gap-0.5">
              <div className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 0L7.34708 3.82918L11.7063 3.82918L8.17963 6.34164L9.52671 10.1708L6 7.65836L2.47329 10.1708L3.82037 6.34164L0.293661 3.82918L4.65292 3.82918L6 0Z"
                    fill="#FFB800"
                  />
                </svg>
              </div>
              <div className="justify-start text-xs leading-none font-normal text-gray-500">
                {product.rating.toFixed()}
              </div>
            </div>
            <div className="flex items-center justify-start gap-0.5">
              <div className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 1C8.76142 1 11 3.23858 11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1Z"
                    stroke="#9CA3AF"
                    strokeWidth="1"
                  />
                  <path
                    d="M6 3V6L8 8"
                    stroke="#9CA3AF"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="justify-start text-xs leading-none font-normal text-gray-500">
                {product.reviewCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface HorizontalProductListProps {
  products: Product[];
  title: string;
  className?: string;
  moreLink?: string;
  onMoreClick?: () => void;
}

export function HorizontalProductList({
  products,
  title,
  className,
  moreLink,
  onMoreClick,
}: HorizontalProductListProps) {
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick();
    } else if (moreLink) {
      window.open(moreLink, '_blank');
    }
  };

  return (
    <div className={cn('mb-10', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
      </div>
      <div className="horizontal-scroll overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {products.map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
          {/* 마지막 아이템이 살짝 보이도록 여백 추가 */}
          <div className="w-4 flex-shrink-0"></div>
        </div>
      </div>

      {/* 더보기 버튼 */}
      {(onMoreClick || moreLink) && products.length >= 4 && (
        <div className="flex justify-center">
          <button
            onClick={handleMoreClick}
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
