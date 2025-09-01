import HeaderCustom from '@/components/HeaderCustom';
import LikeIcon from '@/assets/icons/common/icon-24-like.svg';
import ShareIcon from '@/assets/icons/common/icon-24-Share.svg';
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

interface ProductDetailProps {
  reviews: Review[];
  product: Product;
}

export default function ProductDetail({ reviews, product }: ProductDetailProps) {
  return (
    <>
      <HeaderCustom showBack showHome showSearch showCart />
      <div className="pt-15 pb-30">
        <div className="aspect-[1/1] bg-gray-200" />

        <div>
          <div className="flex items-start justify-between border-b border-gray-200 px-4 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <span className="text-sm font-medium">{product.store}</span>
                <NextIcon />
              </div>
              <p className="text-base font-semibold">{product.title}</p>
              <div className="text-2xl font-bold">
                <span>{product.price.toLocaleString()}</span>원
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <RatingStar rating={product.rating} />
                  <span>{product.rating}</span>
                </div>
                <Link href={`/products/${product.id}/reviews`} className="underline">
                  리뷰 {product.reviewCount}
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <button>
                <LikeIcon />
              </button>
              <button>
                <ShareIcon />
              </button>
            </div>
          </div>
          <div className="flex justify-start gap-8 border-b border-gray-200 p-4 text-sm">
            <span>배송</span>
            <div>
              <p>당일출발 11:00 마감 | 평균 2일 이내 도착 확률 80%</p>
              <p>지금 결제 시 8.28(목) 발송 예정</p>
              <p>무료배송</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <Title text="장기구독 사용자의 리뷰" />
          <ul className="flex gap-2 overflow-x-auto">
            {reviews.map((review: Review) => (
              <ReviewsMiniSlide review={review} key={review.id} />
            ))}
          </ul>
        </div>

        <div className="py-10">상품정보 & 리뷰</div>

        <div className="px-4">
          <Title text="리뷰" />
          {/* 리뷰 이미지 미리보기 */}
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <RatingStar rating={product.rating} />
                <strong className="ml-1 text-base text-black">{product.rating}</strong>
                <span className="ml-1 text-sm text-gray-500">({product.reviewCount})</span>
              </div>
              <Link href={`/products/${product.id}/reviews`}>
                <NextIcon className="text-gray-400" />
              </Link>
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
    </>
  );
}
