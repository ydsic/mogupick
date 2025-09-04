import LikeIcon from '@/assets/icons/common/icon-24-like.svg';
import ShareIcon from '@/assets/icons/common/icon-24-Share.svg';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import RatingStar from './RatingStar';
import Link from 'next/link';
import { Product } from '@/types/product';

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  return (
    <div>
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
              <span className="underline">리뷰 {product.reviewCount}</span>
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
    </div>
  );
}
