'use client';
import React from 'react';
import Image from 'next/image';
import TossIcon from '@/assets/icons/payments/toss.png';

type Props = {
  savePayment: boolean;
  onChangeSavePayment: (v: boolean) => void;
};

export default function PaymentMethodSection({ savePayment, onChangeSavePayment }: Props) {
  return (
    <section className="px-4">
      <h2 className="mb-5 text-xl font-bold">결제수단 등록</h2>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <input type="radio" className="h-5 w-5" />
          <Image src={TossIcon} alt="토스" />
        </div>

        <div className="flex justify-center rounded border border-black p-4">
          <button
            type="button"
            className="rounded-full bg-black px-6 py-2.5 text-sm text-white transition-colors hover:bg-gray-800"
          >
            결제수단 등록하기
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={savePayment}
            onChange={(e) => onChangeSavePayment(e.target.checked)}
            className="h-4 w-4 accent-black"
          />
          <span className="text-sm font-medium">선택한 결제 수단을 다음에도 사용</span>
        </label>
      </div>
    </section>
  );
}
