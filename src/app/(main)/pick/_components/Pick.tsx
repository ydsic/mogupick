'use client';

import { useEffect, useMemo } from 'react';
import { ChipsList } from '@/components/ui/Chips';
import { categories } from '@/constants/categories';
import { ProductCardList } from '@/components/card/Product';
import { useQuery } from '@tanstack/react-query';
import { getMyLikedProducts, type LikedProduct } from '@/api/like';
import type { Product } from '@/types/product';
import { useLikedStore } from '@/store/useLikedStore';

export default function Pick() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['likedProducts'],
    queryFn: getMyLikedProducts,
    staleTime: 60 * 1000,
  });

  const setAllLiked = useLikedStore((s) => s.setAll);

  useEffect(() => {
    if (data) {
      setAllLiked(data.map((d) => d.productId));
    }
  }, [data, setAllLiked]);

  const mappedProducts: Product[] = useMemo(() => {
    const list = (data ?? []) as LikedProduct[];
    return list.map((p) => ({
      id: p.productId,
      store: p.brandName,
      title: p.productName,
      price: p.price,
      rating: p.starRate,
      reviewCount: p.reviewCount,
      imageUrl: p.imageUrl,
      isLiked: true,
    }));
  }, [data]);

  return (
    <div className="p-4">
      <ChipsList categories={categories} showAll />

      <div className="pb-20">
        <div className="mt-1 mb-3 pl-4 text-sm text-[#6f6f6f]">
          {isLoading ? (
            <span>불러오는 중...</span>
          ) : isError ? (
            <span className="text-red-500">목록을 불러오지 못했습니다.</span>
          ) : (
            <>
              총 <span>{mappedProducts.length}</span>개
            </>
          )}
        </div>
        <ProductCardList
          path={`/pick`}
          products={mappedProducts}
          cols={2}
          query={{ from: 'pick' }}
          showCartButton
          showHeart
        />
      </div>
    </div>
  );
}
