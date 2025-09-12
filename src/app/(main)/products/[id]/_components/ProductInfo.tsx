import LikeIcon from '@/assets/icons/common/icon-24-like.svg';
import ShareIcon from '@/assets/icons/common/icon-24-Share.svg';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import RatingStar from './RatingStar';
import Link from 'next/link';
import { Product } from '@/types/product';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProduct } from '@/api/product';
import { getApiBaseUrl } from '@/lib/config';
import { likeProduct } from '@/api/like';
import { useLikedStore } from '@/store/useLikedStore';

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  // 서버에서 받은 초기 값 기반으로 로컬 상태 유지 (클라이언트에서 상세 응답으로 보강)
  const [detail, setDetail] = useState<Product>(product);

  const toggleLike = useLikedStore((s) => s.toggle);
  const isLikedInStore = useLikedStore((s) => s.isLiked(detail.id));

  useEffect(() => {
    (async () => {
      try {
        const url = `${getApiBaseUrl()}/products/${product.id}/detail`;
        console.log('[ProductInfo] will fetch detail', { id: product.id, url });
        const res = await getProduct(product.id);
        console.log('[ProductInfo] client detail response', res);

        // 응답 래퍼 처리 (status/message/data)
        const data: any = (res as any)?.data ?? res ?? {};
        const imageArr: string[] = Array.isArray(data.productImageUrls)
          ? data.productImageUrls
          : [];

        // UI 모델로 매핑
        const mapped: Product = {
          id: data.productId ?? product.id,
          store: data.brandName ?? product.store,
          title: data.productName ?? product.title,
          price: data.price ?? product.price,
          rating: data.averageRating ?? product.rating,
          reviewCount: data.reviewCount ?? product.reviewCount,
          imageUrl: imageArr[0] ?? product.imageUrl,
          isLiked: product.isLiked,
        };
        setDetail(mapped);
      } catch (e) {
        console.error('[ProductInfo] client detail fetch failed', e);
      }
    })();
  }, [product.id]);

  // 오늘 날짜를 "M.DD(요일)" 형태로 포맷
  const today = new Date();
  const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'] as const;
  const shippingText = `${today.getMonth() + 1}.${today.getDate()}(${weekdayNames[today.getDay()]})`;

  const liked = detail.isLiked ?? isLikedInStore;

  const handleLike = async () => {
    // 낙관적 업데이트
    setDetail((prev) => ({ ...prev, isLiked: !liked }));
    toggleLike(detail.id);
    try {
      await likeProduct(detail.id);
      console.log('[ProductInfo] 좋아요 토글 성공', { productId: detail.id, liked: !liked });
    } catch (e) {
      console.error('[ProductInfo] 좋아요 토글 실패, 롤백', e);
      // 롤백
      setDetail((prev) => ({ ...prev, isLiked: liked }));
      toggleLike(detail.id);
    }
  };

  return (
    <div>
      <div className="relative aspect-[1/1] bg-gray-200">
        {detail.imageUrl && (
          <Image
            src={detail.imageUrl}
            alt={detail.title}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div>
        <div className="flex items-start justify-between border-b border-gray-200 px-4 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <span className="text-sm font-medium">{detail.store}</span>
              <NextIcon />
            </div>
            <p className="text-base font-semibold">{detail.title}</p>
            <div className="text-2xl font-bold">
              <span>{detail.price.toLocaleString()}</span>원
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <RatingStar rating={detail.rating} />
                <span>{detail.rating.toFixed(1)}</span>
              </div>
              <Link href={`/products/${detail.id}/reviews`} className="underline">
                리뷰 {detail.reviewCount}
              </Link>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <button
              onClick={handleLike}
              aria-pressed={!!liked}
              className={liked ? 'text-red-500' : 'text-gray-400'}
            >
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
            <p>지금 결제 시 {shippingText} 발송 예정</p>
            <p>무료배송</p>
          </div>
        </div>
      </div>
    </div>
  );
}
