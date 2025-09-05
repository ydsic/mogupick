'use client';

import { useState } from 'react';
import HeaderCustom from '@/components/HeaderCustom';
import { ProductCardList } from '@/components/card/Product';
import CloseIcon from '@/assets/icons/common/close-24px.svg';
import CheckBoxIcon from '@/assets/icons/cart/checkbox.svg';
import CheckedIcon from '@/assets/icons/cart/checkbox-checked.svg';
import AddItemIcon from '@/assets/icons/cart/add.svg';
import MinusItemIcon from '@/assets/icons/cart/minus.svg';

interface CartItem {
  id: number;
  title: string;
  subscriptionType: string;
  price: number;
  quantity: number;
  image?: string;
  selected: boolean;
  brand: string;
}

const recommendedProducts = [
  { id: 1, store: 'Store', title: 'Product', price: 10000, rating: 4.8, reviewCount: 500 },
  { id: 2, store: 'Store', title: 'Product', price: 10000, rating: 4.8, reviewCount: 500 },
  { id: 3, store: 'Store', title: 'Product', price: 10000, rating: 4.8, reviewCount: 500 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: '상품이름',
      subscriptionType: '1달에 한 번 구독',
      price: 11000,
      quantity: 1,
      selected: false,
      brand: '스파클',
    },
    {
      id: 2,
      title: '상품이름',
      subscriptionType: '1달에 한 번 구독',
      price: 11000,
      quantity: 1,
      selected: true,
      brand: '스파클',
    },
    {
      id: 3,
      title: '상품이름',
      subscriptionType: '1달에 한 번 구독',
      price: 11000,
      quantity: 1,
      selected: true,
      brand: '스파클',
    },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const selectedItems = cartItems.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  const groupedItems = cartItems.reduce(
    (groups, item) => {
      if (!groups[item.brand]) {
        groups[item.brand] = [];
      }
      groups[item.brand].push(item);
      return groups;
    },
    {} as Record<string, CartItem[]>,
  );

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
                        <button className="w-full rounded border border-gray-100 bg-white p-3">
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
              products={recommendedProducts}
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
          <button className="flex h-12 w-full items-center justify-center rounded border border-gray-300 bg-black px-4">
            <span className="text-base font-medium text-white">
              {totalPrice.toLocaleString()}원 정기구독 결제하기
            </span>
          </button>
        </div>
        <div className="flex h-5 justify-center py-2">
          <div className="h-[5px] w-36 rounded-full bg-black"></div>
        </div>
      </div>
    </div>
  );
}
