'use client';
import React from 'react';

export default function OrderItemsSection() {
  return (
    <section className="px-4">
      <h2 className="mb-5 text-xl font-bold">주문상품</h2>

      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="h-24 w-24 flex-shrink-0 rounded bg-zinc-300" />
          <div className="flex-1">
            <p className="text-sm text-black">브랜드명</p>
            <h3 className="mt-1 text-base font-semibold">상품이름</h3>
            <p className="mt-1 text-lg font-semibold">11,000원</p>
            <p className="mt-1 text-sm text-gray-600">수량 1개</p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-100 p-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-base font-medium">1회차 결제일</span>
              <span className="text-base font-semibold">9월 3일(수)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base font-medium">배송 희망일</span>
              <span className="text-base font-semibold">9월 5일(금)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base font-medium">배송주기</span>
              <span className="text-base font-semibold">1달에 한 번</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            · 도착 2영업일 전 자동결제 됩니다.
            <br />· 결제 실패시 다음날 오전에 재결제 시도됩니다.
          </p>
        </div>

        <hr className="border-gray-200" />
      </div>
    </section>
  );
}
