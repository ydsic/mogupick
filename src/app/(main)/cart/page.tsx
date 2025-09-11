'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import HeaderCustom from '@/components/HeaderCustom';
import { ProductCardList } from '@/components/card/Product';
import CloseIcon from '@/assets/icons/common/close-24px.svg';
import CheckBoxIcon from '@/assets/icons/cart/checkbox.svg';
import CheckedIcon from '@/assets/icons/cart/checkbox-checked.svg';
import AddItemIcon from '@/assets/icons/cart/add.svg';
import MinusItemIcon from '@/assets/icons/cart/minus.svg';
import SubscribeFlowBottomSheet, {
  SubscribeConfirmPayload,
} from '@/components/bottomsheet/subscribe/SubscribeFlowBottomSheet';
// 신규: 옵션 id 매칭 및 패치 호출을 위한 스토어/API
import { useDeliveryStore } from '@/store/useDeliveryStore';
import { getSubscriptionOptions } from '@/api/subscription';
import { getMyCartMapped, patchCart, CartItemUI } from '@/api/cart';
import { useAuthStore } from '@/store/useAuthStore';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectAll, setSelectAll] = useState(false);

  // 구독 옵션 변경 BottomSheet 상태 및 선택 상품 정보
  const [isOptionSheetOpen, setIsOptionSheetOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<CartItemUI | null>(null);

  // 신규: 주기 선택 상태 및 로그인 사용자 id
  const { quickCycle, customUnit, customCount } = useDeliveryStore();
  const { memberId } = useAuthStore();

  // 장바구니 초기 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const mapped = await getMyCartMapped();
        if (mounted) {
          setCartItems(mapped);
        }
      } catch (e: any) {
        console.error(e);
        if (mounted) setError(e?.message || '장바구니를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedItems = useMemo(() => cartItems.filter((item) => item.selected), [cartItems]);
  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems],
  );

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems((items) => items.map((item) => ({ ...item, selected: newSelectAll })));
  };

  const handleItemSelect = (id: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    );
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const handleDeleteSelected = () => {
    setCartItems((items) => items.filter((item) => !item.selected));
  };

  // "구독 옵션 변경" 클릭 시 모달 열기
  const openOptionSheet = (item: CartItemUI) => {
    setActiveItem(item);
    setIsOptionSheetOpen(true);
  };

  // 서버 옵션에서 id 매칭 유틸
  const resolveOptionId = (
    options: { id: number; unit: 'DAY' | 'WEEK' | 'MONTH'; period: number }[],
  ) => {
    let optionId: number | undefined;

    if (quickCycle) {
      // 예: "1주 마다", "2주 마다", "1달", "3일마다" 등 공백 제거 후 파싱
      const cleaned = quickCycle.replace(/\s/g, '');
      const num = parseInt(cleaned);
      if (cleaned.includes('달')) {
        optionId = options.find((o) => o.unit === 'MONTH' && o.period === num)?.id;
      } else if (cleaned.includes('주')) {
        optionId = options.find((o) => o.unit === 'WEEK' && o.period === num)?.id;
      } else if (cleaned.includes('일')) {
        optionId = options.find((o) => o.unit === 'DAY' && o.period === num)?.id;
      }
    } else {
      // customUnit: '일마다' | '주마다' | '월마다', customCount: number
      const unitMap: Record<string, 'DAY' | 'WEEK' | 'MONTH'> = {
        일마다: 'DAY',
        주마다: 'WEEK',
        월마다: 'MONTH',
      };
      const u = unitMap[customUnit] ?? 'DAY';
      optionId = options.find((o) => o.unit === u && o.period === customCount)?.id;
    }

    return optionId;
  };

  // 모달 적용 처리: 서버 patchCart 연동
  const handleApplySubscribeOption = async (payload: SubscribeConfirmPayload) => {
    if (!activeItem) return;
    if (!memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 1) 서버 구독 옵션 목록 조회
      const { data: options } = await getSubscriptionOptions();

      // 2) 현재 선택된 주기에 해당하는 옵션 ID 결정
      const optionId = resolveOptionId(options);
      if (!optionId) throw new Error('선택한 주기에 해당하는 구독 옵션을 찾을 수 없습니다.');

      // 3) 장바구니 아이템 옵션 변경 API 호출
      await patchCart(memberId, activeItem.id, {
        subscriptionOptionId: optionId,
        firstDeliveryDate: payload.firstDeliveryDate,
      });

      // 4) 로컬 UI 업데이트 (서버 반영 후 동기화가 필요하면 getMyCart 연동 가능)
      const newSubText = `${payload.subscriptionOptionText} ∙ 첫배송 ${payload.firstDeliveryDate}`;
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === activeItem.id
            ? { ...it, subscriptionType: newSubText, quantity: payload.quantity }
            : it,
        ),
      );

      setIsOptionSheetOpen(false);
      setActiveItem(null);
    } catch (e) {
      console.error(e);
      alert('구독 옵션 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const groupedItems = useMemo(() => {
    return cartItems.reduce(
      (groups, item) => {
        if (!groups[item.brand]) {
          groups[item.brand] = [];
        }
        groups[item.brand].push(item);
        return groups;
      },
      {} as Record<string, CartItemUI[]>,
    );
  }, [cartItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderCustom title="장바구니" showBack />
        <div className="px-4 pt-14">불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderCustom title="장바구니" showBack />
        <div className="px-4 pt-14 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderCustom title="장바구니" showBack />

      <div className="pt-14">
        {/* 전체선택 및 선택삭제 */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1">
            <button onClick={handleSelectAll} className="flex items-center gap-1">
              {selectAll ? (
                <CheckedIcon className="h-5 w-5" />
              ) : (
                <CheckBoxIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">전체선택</span>
            </button>
            <span className="text-sm font-medium text-green-600">
              {selectedItems.length}/{cartItems.length}
            </span>
          </div>
          <button
            onClick={handleDeleteSelected}
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs"
          >
            선택삭제
          </button>
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-gray-100"></div>

        {/* 장바구니 아이템들 */}
        <div className="flex flex-col gap-8 px-4 py-8">
          {Object.entries(groupedItems).map(([brand, items], brandIndex) => (
            <div key={brand} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                {brandIndex > 0 && <div className="-mx-4 h-0.5 bg-gray-200"></div>}
                <div className="text-base font-medium">{brand}</div>
                <div className="h-px bg-gray-200"></div>
              </div>

              {/* 브랜드 내 상품들 */}
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <button onClick={() => handleItemSelect(item.id)}>
                        {item.selected ? (
                          <CheckedIcon className="h-5 w-5" />
                        ) : (
                          <CheckBoxIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button>
                        <CloseIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <div className="h-24 w-24 rounded bg-gray-300"></div>
                        <div className="flex flex-1 flex-col gap-3">
                          <div className="flex flex-col gap-1">
                            <div className="text-base font-semibold">{item.title}</div>
                            <div className="text-sm font-medium text-green-700">
                              {item.subscriptionType}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            {/* 수량 조절 */}
                            <div className="flex h-8 rounded-lg bg-gray-100">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="flex h-8 w-8 items-center justify-center rounded-l-lg border-r border-gray-100"
                              >
                                <MinusItemIcon className="h-4 w-4" />
                              </button>
                              <div className="flex h-8 w-8 items-center justify-center">
                                <span className="text-xs font-medium">{item.quantity}</span>
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-r-lg border-l border-gray-100"
                              >
                                <AddItemIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-lg font-semibold">
                              {(item.price * item.quantity).toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          className="w-full rounded border border-gray-100 bg-white p-3"
                          onClick={() => openOptionSheet(item)}
                        >
                          구독 옵션 변경
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-gray-100"></div>

        {/* 주문 요약 */}
        <div className="py-3">
          <div className="flex flex-col gap-4 bg-white px-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">주문 상품 수</span>
              <span className="text-sm font-semibold">총 {selectedItems.length}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">총 주문금액</span>
              <span className="text-sm font-semibold">{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">총 결제금액</span>
              <span className="text-lg font-bold">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-gray-100"></div>

        {/* 추천 상품 */}
        <div className="flex flex-col gap-3 px-4 py-6">
          <div className="text-lg font-semibold">이런 상품은 어때요?</div>
          <div className="mb-25">
            <ProductCardList
              products={[]}
              path="/products"
              size="s"
              layout="grid"
              cols={3}
              showHeart={false}
              showCartButton={false}
            />
          </div>
        </div>
      </div>

      {/* 하단 결제 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 bg-white pt-3 md:left-1/2 md:w-[500px] md:-translate-x-1/2">
        <div className="px-8 pb-5">
          <Link
            href="/payments"
            className="flex h-12 w-full items-center justify-center rounded border border-gray-300 bg-black px-4"
          >
            <span className="text-base font-medium text-white">
              {totalPrice.toLocaleString()}원 정기구독 결제하기
            </span>
          </Link>
        </div>
        <div className="flex h-5 justify-center py-2">
          <div className="h-[5px] w-36 rounded-full bg-black"></div>
        </div>
      </div>

      {/* 구독 옵션 변경 BottomSheet */}
      <SubscribeFlowBottomSheet
        isOpen={isOptionSheetOpen}
        onClose={() => setIsOptionSheetOpen(false)}
        productName={activeItem?.title || ''}
        pricePerItem={activeItem?.price || 0}
        onConfirm={handleApplySubscribeOption}
      />
    </div>
  );
}
