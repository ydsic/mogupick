'use client';

import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '../BottomSheet';
import Step2 from './Step2';
import { useDeliveryStore } from '@/store/useDeliveryStore';
import { getSubscriptionOptions, SubscriptionOption } from '@/api/subscription';
import { createCart } from '@/api/cart';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

export interface SubscribeConfirmPayload {
  firstDeliveryDate: string; // YYYY-MM-DD
  subscriptionOptionText: string; // 예: "1달" | "2주 마다" | "3일마다" 등
}

export default function SubscribeFlowBottomSheet({
  isOpen,
  // Step3 제거로 더 이상 사용하지 않지만, 외부 호환을 위해 이름만 언더스코어로 유지
  productName: _productName,
  pricePerItem: _pricePerItem,
  productId,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  productName: string;
  pricePerItem: number;
  productId?: number; // 선택적
  onClose: () => void;
  onConfirm?: (payload: SubscribeConfirmPayload) => void;
}) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  const { quickCycle, customCount, customUnit } = useDeliveryStore();
  const { memberId } = useAuthStore();

  const subscriptionOptionText = useMemo(() => {
    if (quickCycle) return quickCycle;
    if (customUnit === '월마다') return `${customCount}달`;
    if (customUnit === '주마다') return `${customCount}주 마다`;
    return `${customCount}일마다`;
  }, [quickCycle, customCount, customUnit]);

  useEffect(() => {
    if (isOpen) {
      setStartDate(new Date());
    }
  }, [isOpen]);

  // 유닛/카운트를 기준으로 서버 옵션에서 id 찾기 (AddToCartButton과 동일한 로직 차용)
  const matchOptionId = (options: SubscriptionOption[]): number | undefined => {
    if (quickCycle) {
      const cleaned = quickCycle.replace(/\s/g, ''); // 예: '1주마다', '1달', '3일'
      const num = parseInt(cleaned, 10);
      if (cleaned.includes('달'))
        return options.find((o) => o.unit === 'MONTH' && o.period === num)?.id;
      if (cleaned.includes('주'))
        return options.find((o) => o.unit === 'WEEK' && o.period === num)?.id;
      if (cleaned.includes('일'))
        return options.find((o) => o.unit === 'DAY' && o.period === num)?.id;
      return undefined;
    }

    const unitMap: Record<string, 'DAY' | 'WEEK' | 'MONTH'> = {
      일마다: 'DAY',
      주마다: 'WEEK',
      월마다: 'MONTH',
    };
    const u = unitMap[customUnit] ?? 'DAY';
    const period = customCount;
    return options.find((o) => o.unit === u && o.period === period)?.id;
  };

  const handleConfirmFromStep2 = async () => {
    if (!startDate) return;
    try {
      setLoading(true);
      const y = startDate.getFullYear();
      const m = String(startDate.getMonth() + 1).padStart(2, '0');
      const d = String(startDate.getDate()).padStart(2, '0');
      const firstDeliveryDate = `${y}-${m}-${d}`;

      // 1) 옵션 목록 조회
      const { data: options } = await getSubscriptionOptions();

      // 2) 선택 주기에 해당하는 옵션 ID 찾기 (폴백 포함)
      let optionId = matchOptionId(options);
      if (!optionId) {
        optionId =
          options.find((o) => o.unit === 'MONTH' && o.period === 1)?.id ||
          options.find((o) => o.unit === 'WEEK' && o.period === 1)?.id ||
          options[0]?.id;
      }
      if (!optionId) throw new Error('구독 옵션을 찾을 수 없습니다.');

      // productId가 주어진 경우에만 장바구니 담기 (상품 상세에서 사용)
      if (productId) {
        if (!memberId) throw new Error('로그인이 필요합니다.');
        await createCart(memberId, productId, {
          subscriptionOptionId: optionId,
          firstDeliveryDate,
        });
        console.log('[SubscribeFlow] 장바구니 담기 완료', {
          productId,
          subscriptionOptionText,
          firstDeliveryDate,
          subscriptionOptionId: optionId,
        });
      }

      // 콜백 (장바구니 페이지의 옵션 변경 시 사용)
      onConfirm?.({ firstDeliveryDate, subscriptionOptionText });
      onClose();
      toast.success('장바구니에 담았습니다.');
    } catch (e) {
      console.error('[SubscribeFlow] 처리 실패', e);
      toast.error('장바구니에 담기 실패.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Step2
        startDate={startDate}
        setStartDate={(date) => setStartDate(date)}
        onComplete={handleConfirmFromStep2}
      />

      <div className="mt-4 flex items-center justify-center">
        <span className="h-1.5 w-36 rounded-full bg-black" />
      </div>
    </BottomSheet>
  );
}
