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
import React, { useEffect, useRef, useState } from 'react';
import BottomSheet from '@/components/bottomsheet/BottomSheet';
import CustomCycle from '@/components/cycle/CustomCycle';
import QuickCycle from '@/components/cycle/QuickCycle';
import SubscribeIntroBottomSheet from '@/components/bottomsheet/subscribe/SubscribeIntroBottomSheet';
import SubscribeFlowBottomSheet from '@/components/bottomsheet/subscribe/SubscribeFlowBottomSheet';
import { useLikedStore } from '@/store/useLikedStore';

interface ProductDetailProps {
  reviews: Review[];
  product: Product;
}

export default function ProductDetail({ reviews, product }: ProductDetailProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  // ✅ 페이지 진입 시 step1 열림
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);

  // 좋아요 토글, 좋아요 여부
  // const toggleLike = useLikedStore((state) => state.toggle);
  // const isLiked = useLikedStore((state) => state.isLiked(p.id));

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
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {step === 0 && (
          <SubscribeIntroBottomSheet
            isOpen={isOpen}
            // onLike={() => toggleLike(product.id)}
            // isLiked={isLiked}
            onSubscribe={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <SubscribeFlowBottomSheet
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            pricePerItem={12000}
            productName={'핫 바베큐 소시지'}
          />
        )}
      </BottomSheet>
    </>
  );
}
