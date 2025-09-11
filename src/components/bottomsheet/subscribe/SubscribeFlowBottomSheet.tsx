'use client';

import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '../BottomSheet';
import Step2 from './Step2';
import { useDeliveryStore } from '@/store/useDeliveryStore';

export interface SubscribeConfirmPayload {
  firstDeliveryDate: string; // YYYY-MM-DD
  subscriptionOptionText: string; // 예: "1달" | "2주 마다" | "3일마다" 등
}

export default function SubscribeFlowBottomSheet({
  isOpen,
  // Step3 제거로 더 이상 사용하지 않지만, 외부 호환을 위해 이름만 언더스코어로 유지
  productName: _productName,
  pricePerItem: _pricePerItem,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  productName: string;
  pricePerItem: number;
  onClose: () => void;
  onConfirm?: (payload: SubscribeConfirmPayload) => void;
}) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const { quickCycle, customCount, customUnit } = useDeliveryStore();

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

  const handleConfirmFromStep2 = () => {
    if (!startDate) return;
    const y = startDate.getFullYear();
    const m = String(startDate.getMonth() + 1).padStart(2, '0');
    const d = String(startDate.getDate()).padStart(2, '0');
    const firstDeliveryDate = `${y}-${m}-${d}`;

    onConfirm?.({
      firstDeliveryDate,
      subscriptionOptionText,
    });
    onClose();
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
