import HeaderCustom from '@/components/HeaderCustom';
import React from 'react';
import DownArrowIcon from '@/assets/icons/common/under-arrow.svg';
import FinterIcon from '@/assets/icons/common/fillter-16px.svg';
import LikeIcon from '@/assets/icons/common/hand-like.svg';

type Review = {
  id: string;
  user: string;
  subscriptionLabel: string;
  rating: number;
  timeAgo: string;
  text: string;
  images?: string[];
  likes: number;
};

function Star({ filled, size = 20 }: { filled: boolean; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={filled ? 'fill-yellow-500' : 'fill-gray-300'}
    >
      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.402 8.167L12 18.896l-7.336 3.868 1.402-8.167L.132 9.211l8.2-1.193L12 .587z" />
    </svg>
  );
}

function Rating({ value, size = 20 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center" aria-label={`별점 ${value}점 / 5점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < value} size={size} />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="flex w-full flex-col gap-3 py-4">
      <div className="flex items-start gap-2">
        <div className="h-10 w-10 rounded-full bg-zinc-300" aria-hidden="true" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{r.user}</p>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <p className="text-xs text-gray-700">{r.subscriptionLabel}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Rating value={r.rating} size={16} />
            <p className="text-[10px] text-gray-500">{r.timeAgo}</p>
          </div>
        </div>
      </div>

      {r.images?.length ? (
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {r.images.map((src, i) => (
            <div key={i} className="aspect-[9/10] rounded bg-zinc-300" aria-hidden="true" />
          ))}
        </div>
      ) : null}

      <p className="text-sm leading-snug text-black">{r.text}</p>

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded border border-gray-500 px-2 py-1 text-sm text-gray-600"
          aria-label={`좋아요 ${r.likes}개`}
        >
          <LikeIcon />
          {r.likes}
        </button>
      </div>

      <hr className="mt-2 border-t border-gray-200" />
    </article>
  );
}

export default function ReviewsPage() {
  const reviews: Review[] = [
    {
      id: '1',
      user: '슈블리맘',
      subscriptionLabel: '21회차 구독중',
      rating: 5,
      timeAgo: '1주일 전',
      text: '고소하고 짭짤하고 달달해서 우리 아이 간식으로 딱이에요! 벌써 21회차 구독이네요 추천합니다',
      images: ['a', 'b', 'c', 'd'],
      likes: 100,
    },
    {
      id: '2',
      user: '맹꽁이',
      subscriptionLabel: '3회차 구독중',
      rating: 3,
      timeAgo: '3주일 전',
      text: '퇴근하고 맥주랑 한잔하기 좋아요 가성비도 좋고 매달 쟁여놓고 먹기 좋습니다',
      images: ['a', 'b', 'c', 'd'],
      likes: 100,
    },
    {
      id: '3',
      user: '맹꽁이',
      subscriptionLabel: '10회차 구독중',
      rating: 5,
      timeAgo: '3주일 전',
      text: '매번 장보기 귀찮아서 구독 시작했는데 만족. 언제든 먹기 좋고 편리하고 뭐랑 먹어도 잘 어울려요',
      images: ['a', 'b', 'c', 'd'],
      likes: 100,
    },
  ];

  return (
    <>
      {/* <HeaderCustom title="리뷰" showBack /> */}
      <section className="relative my-10 overflow-hidden bg-white">
        <div className="flex w-full flex-col items-center gap-4 px-4 pt-4">
          <div className="flex w-full flex-col items-center gap-2">
            <Rating value={5} size={24} />
            <div className="flex items-center gap-1">
              <div className="flex items-end">
                <span className="text-xl leading-7 font-semibold text-black">4.0</span>
                <span className="text-xl leading-7 font-semibold text-gray-600">/5.0</span>
              </div>
              <span className="text-xs leading-none text-gray-600">(500)</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`top-${i}`} className="h-32 rounded bg-zinc-300" aria-hidden="true" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`bottom-${i}`} className="h-32 rounded bg-zinc-300" aria-hidden="true" />
              ))}
            </div>
          </div>
        </div>

        <div className="sticky top-[52px] z-10 mt-2 w-full border-b border-gray-200 bg-white">
          <div className="flex w-full justify-end gap-2 p-4">
            <button
              type="button"
              // onClick={onClick}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-zinc-200 px-3 py-2 text-xs text-gray-900"
            >
              리스트 순
              <DownArrowIcon />
            </button>
            <button
              type="button"
              // onClick={onClick}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-zinc-200 px-3 py-2 text-xs text-gray-900"
            >
              필터
              <FinterIcon />
            </button>
          </div>
        </div>

        {/* 리뷰 리스트 */}
        <div className="w-full px-4 py-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </div>
      </section>
    </>
  );
}
