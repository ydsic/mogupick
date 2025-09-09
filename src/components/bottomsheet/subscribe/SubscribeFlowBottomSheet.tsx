'use client';

import { useState } from 'react';
import BottomSheet from '../BottomSheet';
import Step1 from './Step1';
import Step3 from './Step3';
import Step2 from './Step2';

type Step = 1 | 2 | 3;

export default function SubscribeFlowBottomSheet({
  isOpen,
  productName,
  pricePerItem,
  onClose,
}: {
  isOpen: boolean;
  productName: string;
  pricePerItem: number; // 상품가격
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);

  // ✅ step1 상태
  const [quantity, setQuantity] = useState(1);
  const total = quantity * pricePerItem;

  const goNext = () => setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  const goBack = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex shrink-0 items-center justify-center py-2">
        <span className="h-1.5 w-12 rounded-full bg-zinc-200" />
      </div>
      {step === 1 && (
        <Step1
          productName={productName}
          pricePerItem={pricePerItem}
          quantity={quantity}
          total={total}
          increase={increase}
          decrease={decrease}
          goNext={goNext}
        />
      )}

      {step === 2 && <Step2 goNext={goNext} />}

      {step === 3 && (
        <Step3
          productName={productName}
          pricePerItem={pricePerItem}
          resultDay={'9월 20일'}
          resultWeek={'1달'}
          quantity={quantity}
          increase={increase}
          decrease={decrease}
        />
      )}

      <div className="mt-4 flex items-center justify-center">
        <span className="h-1.5 w-36 rounded-full bg-black" />
      </div>

      {/* {step > 1 && (
        <button onClick={goBack} className="absolute top-4 left-4 text-sm text-gray-500">
          ← 이전
        </button>
      )} */}
    </BottomSheet>
  );
}
