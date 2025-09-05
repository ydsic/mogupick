'use client';
import { useState } from 'react';
import ReviewStep1 from './ReviewStep1';
import ReviewStep2 from './ReviewStep2';
import { useReviewForm } from '@/hooks/useReviewForm';
import HeaderCustom from '@/components/HeaderCustom';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const router = useRouter();

  const { form, setRating, setContent, addImage, removeImage } = useReviewForm();
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(2);
  const handleSubmit = () => {
    console.log('리뷰 제출:', form);
    // API 호출
  };

  return (
    <div>
      <HeaderCustom title="리뷰 쓰기" showClose onClose={() => router.back()} />
      {step === 1 && <ReviewStep1 rating={form.rating} setRating={setRating} onNext={handleNext} />}
      {step === 2 && (
        <ReviewStep2
          content={form.content}
          setContent={setContent}
          images={form.images}
          addImage={addImage}
          removeImage={removeImage}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
