'use client';

import { useState, useMemo } from 'react';
import { useDeliveryStore } from '@/store/useDeliveryStore';
import { getSubscriptionOptions, SubscriptionOption } from '@/api/subscription';
import { createCart } from '@/api/cart';
import { useAuthStore } from '@/store/useAuthStore';

interface AddToCartButtonProps {
  productId: number;
  label?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
}

// 유닛/카운트를 기준으로 서버 옵션에서 id 찾기
function matchOptionId(options: SubscriptionOption[], unit: string, count: number) {
  const unitMap: Record<string, 'DAY' | 'WEEK' | 'MONTH'> = {
    일마다: 'DAY',
    주마다: 'WEEK',
    월마다: 'MONTH',
  };
  const u = unitMap[unit] ?? 'DAY';
  const period = count;
  const found = options.find((o) => o.unit === u && o.period === period);
  return found?.id;
}

export default function AddToCartButton({
  productId,
  label = '장바구니 담기',
  className,
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { memberId } = useAuthStore();
  const { quickCycle, customUnit, customCount } = useDeliveryStore();
  const [loading, setLoading] = useState(false);

  const display = useMemo(() => {
    if (quickCycle) return quickCycle;
    if (customUnit === '월마다') return `${customCount}달`;
    if (customUnit === '주마다') return `${customCount}주`;
    return `${customCount}일`;
  }, [quickCycle, customUnit, customCount]);

  const handleAdd = async () => {
    if (!memberId) {
      onError?.(new Error('로그인이 필요합니다'));
      return;
    }
    try {
      setLoading(true);
      // 1) 옵션 목록 조회
      const { data: options } = await getSubscriptionOptions();

      // 2) 선택 주기에 해당하는 옵션 ID 찾기
      let optionId: number | undefined;
      if (quickCycle) {
        const cleaned = quickCycle.replace(/\s/g, ''); // 1주마다, 1달
        const num = parseInt(cleaned);
        if (cleaned.includes('달')) {
          optionId = options.find((o) => o.unit === 'MONTH' && o.period === num)?.id;
        } else if (cleaned.includes('주')) {
          optionId = options.find((o) => o.unit === 'WEEK' && o.period === num)?.id;
        } else if (cleaned.includes('일')) {
          optionId = options.find((o) => o.unit === 'DAY' && o.period === num)?.id;
        }
      } else {
        optionId = matchOptionId(options, customUnit, customCount);
      }

      // 매칭 실패 시 합리적 기본 옵션으로 폴백 (1달 -> 1주 -> 첫 번째)
      if (!optionId) {
        optionId =
          options.find((o) => o.unit === 'MONTH' && o.period === 1)?.id ||
          options.find((o) => o.unit === 'WEEK' && o.period === 1)?.id ||
          options[0]?.id;
      }

      if (!optionId) throw new Error(`선택한 주기에 해당하는 옵션을 찾을 수 없습니다: ${display}`);

      // 3) 첫 배송일: 내일 날짜(서버가 당일 불가/과거 불가 시 500 방지)
      const first = new Date();
      first.setDate(first.getDate() + 1);
      const y = first.getFullYear();
      const m = String(first.getMonth() + 1).padStart(2, '0');
      const d = String(first.getDate()).padStart(2, '0');
      const firstDeliveryDate = `${y}-${m}-${d}`;

      // 4) 장바구니 담기 호출
      const requestBody = {
        subscriptionOptionId: optionId,
        firstDeliveryDate,
      };

      if (process.env.NODE_ENV !== 'production') {
        // 디버그: 토큰은 출력하지 않음
        console.log('[AddToCartButton] request', {
          productId,
          memberId,
          ...requestBody,
        });
        console.log('[AddToCartButton] auth store state:', {
          hasMemberId: !!memberId,
          hasAccessToken: !!useAuthStore.getState().accessToken,
        });
      }

      // 5) 호출
      await createCart(memberId, productId, requestBody);

      onSuccess?.();
    } catch (e) {
      console.error('[AddToCart] 에러', e);
      onError?.(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAdd} disabled={loading} className={className}>
      {loading ? '담는 중...' : label}
    </button>
  );
}
