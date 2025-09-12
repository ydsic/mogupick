'use client';

import HeaderCustom from '@/components/HeaderCustom';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import Title from '@/components/ui/Title';
import ReviewsMiniSlide from './ReviewsMiniSlide';
import { Review } from '../page';
import { Product } from '@/types/product';
import Link from 'next/link';
import ReviewItem from './ReviewItem';
import RatingStar from './RatingStar';
import DownIcon from '@/assets/icons/common/down-16px.svg';
import { ProductCardList } from '@/components/card/Product';
import { products } from '@/app/(main)/(home)/_components/HomePage';
import ProductDescription from './ProductDescription';
import ProductInfo from './ProductInfo';
import React, { useRef, useState } from 'react';
import SubscribeFlowBottomSheet from '@/components/bottomsheet/subscribe/SubscribeFlowBottomSheet';

interface ProductDetailProps {
  reviews: Review[];
  product: Product;
  gallery?: string[];
  detailImages?: string[];
}

export default function ProductDetail({
  reviews,
  product,
  gallery,
  detailImages,
}: ProductDetailProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  // Step2(일정/주기) BottomSheet 제어만 유지
  const [isFlowOpen, setFlowOpen] = useState(false);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HeaderCustom showBack showHome showSearch showCart />
      <div className="pt-8 pb-35">
        <ProductInfo product={product} />

        <div className="p-4">
          <Title text="장기구독 사용자의 리뷰" />
          <ul className="flex gap-2 overflow-x-auto">
            {reviews.map((review: Review) => (
              <ReviewsMiniSlide
                review={review}
                key={review.id}
                onClickReview={() => scrollToSection(reviewRef)}
              />
            ))}
          </ul>
        </div>

        {/* 상품설명 탭 (리뷰) */}
        <ProductDescription
          ref={descriptionRef}
          onClickDescription={() => scrollToSection(descriptionRef)}
          onClickReview={() => scrollToSection(reviewRef)}
          images={detailImages}
        />

        <div className="px-4" ref={reviewRef}>
          <Title text="리뷰" />
          {/* 리뷰 이미지 미리보기 */}
          <div className="mt-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <RatingStar rating={product.rating} />
              <strong className="ml-1 text-base text-black">{product.rating}</strong>
              <span className="ml-1 text-sm text-gray-500">({product.reviewCount})</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square w-full rounded-xs bg-gray-200" />
              ))}
            </div>
          </div>

          {/* 리뷰 리스트 */}
          <div className="mt-10">
            {reviews.map((review: Review) => (
              <ReviewItem review={review} key={review.id} />
            ))}
          </div>

          <Link
            href={`/products/${product.id}/reviews`}
            className="mt-5 mb-10 flex items-center justify-center gap-1 border border-gray-300"
          >
            <div className="block rounded-xs py-3 text-gray-500">리뷰 전체보기</div>
            <NextIcon />
          </Link>

          <div>
            <div className="flex items-center justify-between border-t border-gray-200 p-4 text-base font-normal text-gray-600">
              <span>상품정보 제공고시</span>
              <DownIcon />
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 p-4 text-base font-normal text-gray-600">
              <span>배송안내</span>
              <DownIcon />
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 p-4 text-base font-normal text-gray-600">
              <span>교환/반품/환불안내</span>
              <DownIcon />
            </div>
          </div>
        </div>

        <div className="px-4 py-10">
          <Title text="같은 카테고리 추천" />
          <ProductCardList products={products} path="/products" layout="horizontal" />
        </div>
      </div>

      {/* 하단 고정 바 (구입/구독 버튼처럼 항상 노출) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <button
            className="flex-1 rounded bg-black py-3 text-center text-white"
            onClick={() => setFlowOpen(true)}
          >
            구독하기
          </button>
        </div>
      </div>

      {/* Step2(일정/주기 선택) 용 BottomSheet */}
      <SubscribeFlowBottomSheet
        isOpen={isFlowOpen}
        onClose={() => setFlowOpen(false)}
        pricePerItem={product.price}
        productName={product.title}
        productId={product.id}
      />
    </>
  );
}
