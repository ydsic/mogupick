'use client';

import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '../BottomSheet';
// Step1 제거
import Step3 from './Step3';
import Step2 from './Step2';
import { useDeliveryStore } from '@/store/useDeliveryStore';

type Step = 2 | 3;

export interface SubscribeConfirmPayload {
  quantity: number;
  firstDeliveryDate: string; // YYYY-MM-DD
  subscriptionOptionText: string; // 예: "1달" | "2주 마다" | "3일마다" 등
}

export default function SubscribeFlowBottomSheet({
  isOpen,
  productName,
  pricePerItem,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  productName: string;
  pricePerItem: number; // 상품가격
  onClose: () => void;
  onConfirm?: (payload: SubscribeConfirmPayload) => void; // 상위로 완료 결과 전달
}) {
  // Step1 제거: 바로 Step2에서 시작
  const [step, setStep] = useState<Step>(2);

  // 수량 (Step3에서 조절)
  const [quantity, setQuantity] = useState(1);

  // ✅ step2 상태 (날짜)
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  // ✅ 구독 주기 상태는 useDeliveryStore에서 읽음
  const { quickCycle, customCount, customUnit } = useDeliveryStore();

  const subscriptionOptionText = useMemo(() => {
    if (quickCycle) return quickCycle;
    if (customUnit === '월마다') return `${customCount}달`;
    if (customUnit === '주마다') return `${customCount}주 마다`;
    return `${customCount}일마다`;
  }, [quickCycle, customCount, customUnit]);

  // 모달 열릴 때마다 초기화 (Step2부터)
  useEffect(() => {
    if (isOpen) {
      setStep(2);
      setQuantity(1);
      setStartDate(new Date());
    }
  }, [isOpen]);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Step2 완료 -> Step3로 이동
  const handleStep2Complete = () => {
    setStep(3);
  };

  // Step3에서 확인 시 상위 콜백으로 전달
  const handleConfirm = () => {
    if (!startDate) return;
    const y = startDate.getFullYear();
    const m = String(startDate.getMonth() + 1).padStart(2, '0');
    const d = String(startDate.getDate()).padStart(2, '0');
    const firstDeliveryDate = `${y}-${m}-${d}`;

    onConfirm?.({
      quantity,
      firstDeliveryDate,
      subscriptionOptionText,
    });
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* Step1 제거: 바로 Step2 렌더 */}
      {step === 2 && (
        <Step2
          startDate={startDate}
          setStartDate={(date) => setStartDate(date)}
          onComplete={handleStep2Complete}
        />
      )}

      {step === 3 && (
        <>
          <Step3
            productName={productName}
            pricePerItem={pricePerItem}
            resultDay={startDate ? `${startDate.getMonth() + 1}월 ${startDate.getDate()}일` : ''}
            resultWeek={subscriptionOptionText}
            quantity={quantity}
            increase={increase}
            decrease={decrease}
          />
          <div className="mt-4 flex gap-2 pb-2">
            <button
              onClick={onClose}
              className="flex-1 rounded border border-gray-300 py-3 text-gray-700"
            >
              취소
            </button>
            <button onClick={handleConfirm} className="flex-1 rounded bg-black py-3 text-white">
              적용
            </button>
          </div>
        </>
      )}

      <div className="mt-4 flex items-center justify-center">
        <span className="h-1.5 w-36 rounded-full bg-black" />
      </div>
    </BottomSheet>
  );
}
