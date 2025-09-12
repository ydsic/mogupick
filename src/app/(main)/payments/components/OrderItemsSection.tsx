'use client';
import React, { useEffect, useState } from 'react';
import { getMyCart, mapCartResponseToUI, type CartItemUI } from '@/api/cart';

function formatKoreanDate(isoDate?: string): string {
  if (!isoDate) return '-';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return '-';
  const w = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${w[d.getDay()]})`;
}

function addDays(isoDate?: string, days = 0): string | undefined {
  if (!isoDate) return undefined;
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return undefined;
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// cart raw 응답에서 cartItemId별 displayText/firstDate를 추출
function extractCartMeta(raw: any): {
  displayTextMap: Record<number, string | undefined>;
  firstDateMap: Record<number, string | undefined>;
} {
  const list: any[] = Array.isArray(raw?.data?.items)
    ? raw.data.items
    : Array.isArray(raw?.data?.content)
      ? raw.data.content
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
          ? raw
          : [];

  const displayTextMap: Record<number, string | undefined> = {};
  const firstDateMap: Record<number, string | undefined> = {};

  list.forEach((item: any, idx: number) => {
    const id = Number(item?.cartItemId ?? item?.id ?? idx);
    const subscription = item?.subscription ?? item?.option ?? {};

    const displayText: string | undefined =
      subscription?.displayText ??
      subscription?.subscriptionOptionText ??
      subscription?.optionText ??
      item?.displayText ??
      undefined;

    const firstDate: string | undefined =
      subscription?.firstDeliveryDate ??
      item?.firstDeliveryDate ??
      subscription?.startDate ??
      undefined;

    displayTextMap[id] = displayText;
    firstDateMap[id] = firstDate;
  });

  return { displayTextMap, firstDateMap };
}

export default function OrderItemsSection() {
  const [items, setItems] = useState<CartItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayTextMap, setDisplayTextMap] = useState<Record<number, string | undefined>>({});
  const [firstDateMap, setFirstDateMap] = useState<Record<number, string | undefined>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const raw = await getMyCart();
        console.log('[Payments] 장바구니 API 응답(raw):', raw);
        const mapped = mapCartResponseToUI(raw);
        console.log('[Payments] 장바구니 매핑 결과:', mapped);
        const meta = extractCartMeta(raw);
        console.log('[Payments] meta(displayText, firstDate):', meta);
        if (mounted) {
          setItems(mapped);
          setDisplayTextMap(meta.displayTextMap);
          setFirstDateMap(meta.firstDateMap);
        }
      } catch (e: any) {
        console.error('[Payments] 장바구니 조회 실패', e);
        if (mounted) setError(e?.message || '장바구니를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="px-4">
      <h2 className="mb-5 text-xl font-bold">주문상품</h2>

      {loading && <div className="text-sm text-gray-500">불러오는 중...</div>}
      {error && !loading && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-gray-500">장바구니가 비어 있습니다.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-5">
          {items.map((it) => {
            const firstDate = firstDateMap[it.id];
            const firstPayLabel = formatKoreanDate(firstDate); // 1회차 결제일
            const desiredDateLabel = formatKoreanDate(addDays(firstDate, 2)); // 배송 희망일(예: +2일)
            const cycleLabel = displayTextMap[it.id] || '-'; // 배송주기: displayText 사용

            return (
              <div key={it.id} className="space-y-3">
                <div className="flex gap-3">
                  {/* 이미지 */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-zinc-300">
                    {/* 이미지가 있으면 추후 next/image로 교체 가능 */}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1">
                    <p className="text-sm text-black">{it.brand}</p>
                    <h3 className="mt-1 text-base font-semibold">{it.title}</h3>
                    <p className="mt-1 text-lg font-semibold">{it.price}원</p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-100 p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-base font-medium">1회차 결제일</span>
                      <span className="text-base font-semibold">{firstPayLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base font-medium">배송 희망일</span>
                      <span className="text-base font-semibold">{desiredDateLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base font-medium">배송주기</span>
                      <span className="text-base font-semibold">{cycleLabel}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    · 도착 2영업일 전 자동결제 됩니다.
                    <br />· 결제 실패시 다음날 오전에 재결제 시도됩니다.
                  </p>
                </div>

                <hr className="border-gray-200" />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
