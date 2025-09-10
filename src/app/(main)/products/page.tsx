'use client';

import HeaderCustom from '@/components/HeaderCustom';
import { ProductCardList } from '@/components/card/Product';
import { sectionTitles } from '@/constants/sectionTitles';
import {
  useProductsConstantlyPopular,
  useProductsNewMapped,
  useProductsMostViewedMapped,
  useProductsBeginnerFriendlyMapped,
  useProductsPeerBestReviewsMapped,
  useProductsRecentlyViewedMapped,
} from '@/hooks/products/useProduct';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'recent';
  const key = section as keyof typeof sectionTitles;
  const title = sectionTitles[key] || sectionTitles.recent;

  // 섹션에 따라 적절한 API 훅 사용
  const constantlyPopular = useProductsConstantlyPopular(0, 50);
  const newProducts = useProductsNewMapped(0, 50);
  const mostViewed = useProductsMostViewedMapped(0, 50);
  const beginnerFriendly = useProductsBeginnerFriendlyMapped(0, 50);
  const peerReviews = useProductsPeerBestReviewsMapped();
  const recentlyViewed = useProductsRecentlyViewedMapped();

  // 섹션에 따른 데이터 선택
  let data, isLoading, isError;

  switch (section) {
    case 'popular':
      ({ data, isLoading, isError } = constantlyPopular);
      break;
    case 'new':
      ({ data, isLoading, isError } = newProducts);
      break;
    case 'trending':
      ({ data, isLoading, isError } = mostViewed);
      break;
    case 'starter':
      ({ data, isLoading, isError } = beginnerFriendly);
      break;
    case 'peerReview':
      ({ data, isLoading, isError } = peerReviews);
      break;
    case 'recent':
      ({ data, isLoading, isError } = recentlyViewed);
      break;
    default:
      ({ data, isLoading, isError } = constantlyPopular);
  }

  if (isLoading) {
    return (
      <div>
        <HeaderCustom title={title} showClose onClose={() => router.back()} />
        <div className="my-14 px-4">
          <div className="text-center text-gray-500">로딩중...</div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <HeaderCustom title={title} showClose onClose={() => router.back()} />
        <div className="my-14 px-4">
          <div className="text-center text-red-500">데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  // 데이터 형태 통일 (일부 API는 items 배열을, 일부는 직접 배열 반환)
  const products = Array.isArray(data) ? data : data.items || [];

  // ProductCardList에 맞는 형태로 변환
  const mappedProducts = products.map((p: any) => ({
    id: p.id,
    store: p.store,
    title: p.title,
    price: p.price,
    rating: p.rating,
    reviewCount: p.reviewCount,
    imageUrl: p.imageUrl || p.image,
  }));

  return (
    <div>
      <HeaderCustom title={title} showClose onClose={() => router.back()} />
      <div className="my-14 px-4">
        <div className="mb-3 pt-2 text-sm">
          총<span className="mx-1 font-semibold">{mappedProducts.length}</span>개
        </div>
        <div>
          <ProductCardList products={mappedProducts} path="/products" showHeart showCartButton />
        </div>
      </div>
    </div>
  );
}
