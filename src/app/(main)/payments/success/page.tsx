'use client';

import HeaderCustom from '@/components/HeaderCustom';
import React from 'react';
import CheckIcon from '@/assets/icons/common/check-fill.svg';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { buildUrl } from '@/lib/config';
import { authFetch } from '@/lib/authFetch';

function formatKoreanDateLabel(iso?: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const w = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${w[d.getDay()]})`;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get('orderId') || undefined;
  const router = useRouter();

  const [state, setState] = React.useState<{
    orderId?: string;
    items?: Array<{ id: number; title: string; brand: string; price: number; quantity: number }>;

    totalPrice?: number;
    paymentMethod?: string;
    firstDeliveryDate?: string;
    expectedArrivalDate?: string;
    cartItemIds?: number[]; // 결제된 장바구니 아이템 ID 목록
  } | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('payments.lastSuccess');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setState(parsed);
    } catch {}
  }, []);

  // 결제된 장바구니 아이템 삭제 처리
  React.useEffect(() => {
    const run = async () => {
      try {
        const raw = localStorage.getItem('payments.lastSuccess');
        if (!raw) return;
        const parsed = JSON.parse(raw) as {
          cartItemIds?: number[];
          items?: Array<{ id: number }>;
        };

        // 우선순위: cartItemIds -> items[].id (장바구니 아이템 ID로 가정)
        const targetIds: number[] = Array.isArray(parsed?.cartItemIds)
          ? parsed.cartItemIds.filter((v) => Number.isFinite(v as number))
          : Array.isArray(parsed?.items)
            ? parsed.items
                .map((it) => it?.id)
                .filter((v): v is number => typeof v === 'number' && Number.isFinite(v))
            : [];

        if (!targetIds.length) return;

        const url = (id: number) => buildUrl(`/carts/items/${id}`);

        const results = await Promise.allSettled(
          targetIds.map((id) =>
            authFetch(url(id), {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(async (res) => {
              const text = await res.text();
              let data: any = undefined;
              try {
                data = text ? JSON.parse(text) : undefined;
              } catch {}
              if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText} ${text || ''}`);
              }
              return { id, data };
            }),
          ),
        );

        // 필요 시 성공 이후 localStorage 정리 옵션
        // localStorage.removeItem('payments.lastSuccess');
      } catch (e) {
        console.error('[CART][DELETE][error]', e);
      }
    };
    run();
  }, []);

  const orderId = state?.orderId || orderIdFromQuery;
  const items = state?.items || [];
  const totalPrice = state?.totalPrice ?? 0;
  const paymentMethod = state?.paymentMethod || 'Toss';
  const firstDeliveryDate = formatKoreanDateLabel(state?.firstDeliveryDate);
  const expectedArrivalDate = formatKoreanDateLabel(state?.expectedArrivalDate);

  return (
    <div className="mx-auto grid h-dvh w-full max-w-[420px] grid-rows-[auto,1fr,auto] overflow-hidden bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white">
        <HeaderCustom showBack />
      </div>

      {/* 본문: 정확히 가운데 정렬 */}
      <main className="grid place-items-center place-self-stretch px-4 py-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-6">
            <CheckIcon className="fill-current text-[var(--color-green-600)]" />
            <h1 className="w-full text-center text-2xl leading-loose font-bold text-black">
              정기구독 신청이 완료되었습니다!
            </h1>
            {!!orderId && <p className="text-sm text-[#6f6f6f]">주문번호 {orderId}</p>}
          </div>

          <section className="mt-12 w-full rounded-xl bg-[#f8f8f8] px-5 py-6">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col text-[#242424]">
                <p className="text-lg font-semibold">1회차 도착예정일</p>
                <p className="text-2xl font-bold">{expectedArrivalDate}</p>
              </div>
              <p className="text-[13px] font-semibold text-[#a6a6a6]">
                배송사 사정으로 1~2일 도착예정일이 다를 수 있습니다.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-1.5">
              <div className="flex items-start gap-12">
                <span className="flex-shrink-0 text-sm leading-snug font-medium text-[#6f6f6f]">
                  주문상품
                </span>
                <span className="text-base leading-normal font-medium text-[#434343]">
                  {items && items.length > 0
                    ? `${items[0].title}${items.length > 1 ? ` 외 ${items.length - 1}건` : ''}`
                    : '-'}
                </span>
              </div>

              <div className="flex items-start gap-12">
                <span className="flex-shrink-0 text-sm leading-snug font-medium text-[#6f6f6f]">
                  결제정보
                </span>
                <span className="text-base leading-normal font-medium text-[#434343]">
                  {paymentMethod}
                </span>
              </div>

              <div className="flex items-start gap-12">
                <span className="flex-shrink-0 text-sm leading-snug font-medium text-[#6f6f6f]">
                  결제금액
                </span>
                <span className="text-base leading-normal font-medium text-[#434343]">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white px-4 py-3">
        <button
          className="mb-2 flex h-12 w-full items-center justify-center gap-1 rounded border border-[#d6d6d6]"
          onClick={() => router.replace('/subscribe?tab=list')}
        >
          <span className="text-base font-medium text-[#434343]">구독 확인하러 가기</span>
        </button>
        <button
          className="flex h-12 w-full items-center justify-center gap-1 rounded bg-black"
          onClick={() => router.replace('/')}
        >
          <span className="text-base font-medium text-white">홈으로 가기</span>
        </button>
      </footer>
    </div>
  );
}
