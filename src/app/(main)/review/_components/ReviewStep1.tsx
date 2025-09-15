'use client';

import StarRating from './StarRating';

interface Props {
  rating: number;
  setRating: (rating: number) => void;
  onNext: () => void;
}

export default function ReviewStep1({ rating, setRating, onNext }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pt-14 pb-18">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="mb-2 text-center text-lg font-bold">
          <span className="text-green-700">7회차 구독중</span>이에요!
          <br />
          이번 상품은 어떠셨나요?
        </h1>
        <StarRating rating={rating} onChange={setRating} />
      </div>
      <button
        disabled={rating === 0}
        onClick={onNext}
        className={`w-full rounded py-4 ${rating === 0 ? 'bg-gray-300' : 'bg-black text-white'}`}
      >
        다음
      </button>
    </div>
  );
}
