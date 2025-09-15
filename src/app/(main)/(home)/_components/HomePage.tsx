'use client';

import SearchBar from '@/components/SearchBar';
import { categories } from '@/constants/categories';
import { CategoryList } from '@/components/card/Category';
import BannerSlider from '@/components/card/BannerSlider';
import HeaderCustom from '@/components/HeaderCustom';
import ConstantlyPopularProducts from './ConstantlyPopularProducts';
import ConditionalSections from './ConditionalSections';
import NewProductSection from './NewProductSection';
import MostViewedProductSection from './MostViewedProductSection';
import useMoreModal from '@/hooks/useMoreModal';
import MoreModal from '@/components/modal/MoreModal';
import { useEffect } from 'react';
import { getProductsSimilarPaged } from '@/api/product';
import { useAuth } from '@/utils/useAuth';

export const products = [
  { id: 1, store: '쿠팡', title: '무선 이어폰', price: 59000, rating: 4.5, reviewCount: 120 },
  { id: 2, store: 'G마켓', title: '블루투스 스피커', price: 32000, rating: 4.2, reviewCount: 85 },
  { id: 3, store: '11번가', title: '스마트워치', price: 129000, rating: 4.7, reviewCount: 210 },
  { id: 4, store: '옥션', title: '노트북 쿨링패드', price: 18000, rating: 4.1, reviewCount: 40 },
  { id: 5, store: '쿠팡', title: '게이밍 마우스', price: 45000, rating: 4.6, reviewCount: 95 },
  {
    id: 6,
    store: 'G마켓',
    title: '휴대용 보조배터리',
    price: 25000,
    rating: 4.3,
    reviewCount: 60,
  },
  { id: 7, store: '11번가', title: '무선 키보드', price: 39000, rating: 4.4, reviewCount: 77 },
  { id: 8, store: '쿠팡', title: 'LED 스탠드', price: 22000, rating: 4.2, reviewCount: 34 },
  { id: 9, store: '옥션', title: '스마트폰 삼각대', price: 15000, rating: 4.0, reviewCount: 25 },
  { id: 10, store: 'G마켓', title: '헤드셋', price: 67000, rating: 4.5, reviewCount: 110 },
  { id: 11, store: '11번가', title: 'USB-C 허브', price: 28000, rating: 4.3, reviewCount: 48 },
  { id: 12, store: '쿠팡', title: '무선 충전기', price: 33000, rating: 4.4, reviewCount: 72 },
];

export default function HomePage() {
  const { openModal, closeModal, modalType, modalData } = useMoreModal();
  const { accessToken } = useAuth();

  // 메인 진입 시 유사상품 API 호출 (Authorization 헤더 포함)
  useEffect(() => {
    if (!accessToken) {
      console.warn('[GET /api/v1/products/similar] accessToken 없음 - 로그인 필요');
      return;
    }
    (async () => {
      try {
        const res = await getProductsSimilarPaged(0, 20);
      } catch (e) {
        console.error('[GET /api/v1/products/similar] 실패:', e);
      }
    })();
  }, [accessToken]);

  return (
    <div className="flex flex-col px-4 pb-6">
      <HeaderCustom showLogo showBell showCart />
      <div className="min-h-0 flex-1">
        <SearchBar />
        <BannerSlider />
        <CategoryList categories={categories} />

        {/* 로그인 상태에 따른 조건부 섹션 */}
        <ConditionalSections />
        <ConstantlyPopularProducts />

        {/* 이번 달 새로나온 상품 섹션 */}
        <NewProductSection />

        {/* 지금 주목받는 상품 섹션 */}
        <MostViewedProductSection />
      </div>

      {/* 더보기 모달 */}
      <MoreModal
        isOpen={modalType !== null}
        onClose={closeModal}
        title={modalData.title}
        type={modalData.type}
        data={modalData.data}
        isLoading={modalData.isLoading}
      />
    </div>
  );
}
