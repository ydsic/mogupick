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
import DownIcon from '@/assets/icons/common/DownBig-16px.svg';
import { ProductCardList } from '@/components/card/Product';
import { products } from '@/app/(main)/(home)/_components/HomePage';
import ProductDescription from './ProductDescription';
import ProductInfo from './ProductInfo';
import React, { useRef, useState } from 'react';
import SubscribeFlowBottomSheet from '@/components/bottomsheet/subscribe/SubscribeFlowBottomSheet';
import SubscribeIntroBottomSheet from '@/components/bottomsheet/subscribe/SubscribeIntroBottomSheet';
import { incrementProductViewCount } from '@/api/product';
import { useEffect } from 'react';

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
  console.log('product', product);

  const descriptionRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [isIntroOpen, setIntroOpen] = useState(true);
  // Step2(일정/주기) BottomSheet 제어만 유지
  const [isFlowOpen, setFlowOpen] = useState(false);

  useEffect(() => {
    if (product?.id) {
      void incrementProductViewCount(product.id);
    }
  }, [product?.id]);

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
          <h2 className="text-base font-semibold text-black">리뷰</h2>
          {/* 리뷰 이미지 미리보기 */}
          <div>
            <div className="flex items-center gap-1">
              <RatingStar rating={product.rating} />
              <strong className="text-base font-semibold text-black">
                {product.rating.toFixed()}
              </strong>
              <span className="text-[13px] text-[var(--frey-700)]">({product.reviewCount})</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square w-full rounded-xs bg-[var(--grey-300)]" />
              ))}
            </div>
          </div>

          {/* 리뷰 리스트 */}
          <div className="mt-6">
            {reviews.map((review: Review) => (
              <ReviewItem review={review} key={review.id} />
            ))}
          </div>

          <Link
            href={`/products/${product.id}/reviews`}
            className="mt-5 mb-10 flex items-center justify-center gap-1 rounded-xs border border-[var(--grey-200)]"
          >
            <div className="block py-3 text-[#575757]">리뷰 전체보기</div>
            <NextIcon className="fill-current text-[#575757]" />
          </Link>

          <div className="text-sm font-normal text-[#575757]">
            <div className="flex items-center justify-between border-t border-[var(--grey-100)] p-4 font-normal">
              <span>상품정보 제공고시</span>
              <DownIcon />
            </div>
            <div className="flex items-center justify-between border-t border-[var(--grey-100)] p-4 font-normal">
              <span>배송안내</span>
              <DownIcon />
            </div>
            <div className="flex items-center justify-between border-t border-[var(--grey-100)] p-4 font-normal">
              <span>교환/반품/환불안내</span>
              <DownIcon />
            </div>
          </div>
        </div>

        <div className="px-4 py-10">
          <Title text="큐레이션" />
          <ProductCardList products={products} path="/products" layout="horizontal" />
        </div>
      </div>
      {/* Step1 - 구독 Intro */}
      {/* <SubscribeIntroBottomSheet
        isOpen={isIntroOpen}
        onClose={() => setIntroOpen(false)}
        subscriberCount={product.reviewCount ?? 0}
        onSubscribe={() => {
          setIntroOpen(false);
          setFlowOpen(true); // Step2 BottomSheet 열기
        }}
        onLike={() => console.log('좋아요 클릭')}
        isLiked={false}
      /> */}

      {/* Step2 - 구독 일정/주기 선택 */}
      {/* <SubscribeFlowBottomSheet
        isOpen={isFlowOpen}
        onClose={() => setFlowOpen(false)}
        productName={product.title}
        pricePerItem={product.price}
        productId={product.id}
        onConfirm={({ firstDeliveryDate, subscriptionOptionText }) => {
          console.log('확정 완료:', firstDeliveryDate, subscriptionOptionText);
          // TODO: 장바구니 페이지로 이동 등 처리
        }}
      /> */}

      {/* 하단 고정 바 (구입/구독 버튼처럼 항상 노출) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <button
            className="flex-1 rounded bg-black py-3 text-center text-white"
            onClick={() => setFlowOpen(true)}
          >
            장바구니 담기
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
