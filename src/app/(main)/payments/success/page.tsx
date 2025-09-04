import HeaderCustom from '@/components/HeaderCustom';
import React from 'react';
import CheckIcon from '@/assets/icons/common/check-fill.svg';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto grid h-dvh w-full max-w-[420px] grid-rows-[auto,1fr,auto] overflow-hidden bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white">
        <HeaderCustom title="결제완료" showBack />
      </div>

      {/* 본문: 정확히 가운데 정렬 */}
      <main className="grid place-items-center place-self-stretch px-4 py-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-6">
            <CheckIcon />
            <h1 className="w-full text-center text-2xl leading-loose font-bold text-black">
              정기구독 신청이 완료되었습니다!
            </h1>
          </div>

          <section className="mt-12 w-full rounded-xl bg-gray-100 px-5 py-6">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <p className="text-lg leading-relaxed font-semibold text-black">1회차 도착예정일</p>
                <p className="text-2xl leading-loose font-bold text-black">9월 5일 (금)</p>
              </div>
              <p className="text-xs leading-tight font-semibold text-gray-600">
                배송사 사정으로 1~2일 도착예정일이 다를 수 있습니다.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3">
              <div className="flex items-center gap-12">
                <span className="text-sm leading-snug font-medium text-gray-600">주문상품</span>
                <span className="text-base leading-normal font-medium text-black">
                  생수 330ml x 40개
                </span>
              </div>

              <div className="flex items-center gap-12">
                <span className="text-sm leading-snug font-medium text-gray-600">결제정보</span>
                <span className="text-base leading-normal font-medium text-black">Toss</span>
              </div>

              <div className="flex items-center gap-12">
                <span className="text-sm leading-snug font-medium text-gray-600">결제금액</span>
                <span className="text-base leading-normal font-medium text-black">11,000원</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white px-4 py-3">
        <button className="mb-2 flex h-12 w-full items-center justify-center gap-1 rounded border border-stone-300">
          <span className="text-base font-medium text-gray-800">구독 확인하러 가기</span>
        </button>
        <button className="flex h-12 w-full items-center justify-center gap-1 rounded bg-black">
          <Link href="/">
            <span className="text-base font-medium text-white">홈으로 가기</span>
          </Link>
        </button>
      </footer>
    </div>
  );
}
