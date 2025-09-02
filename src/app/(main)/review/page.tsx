import React from 'react';
import DownArrowIcon from '@/assets/icons/common/under-arrow.svg';
import FinterIcon from '@/assets/icons/common/fillter-16px.svg';
import LikeIcon from '@/assets/icons/common/hand-like.svg';
// import HeaderCustom from '@/components/HeaderCustom';
import BigStarIcon from '@/assets/icons/common/big-star.svg';
import SmallStarIcon from '@/assets/icons/common/small-star.svg';

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

function TotalRating({ value }: { value: number }) {
  return (
    <div className="flex items-center" aria-label={`별점 ${value}점 / 5점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <BigStarIcon fill="#F9C927" />
      ))}
    </div>
  );
}

function Rating({ value }: { value: number; size?: number }) {
  return (
    <div className="flex items-center" aria-label={`별점 ${value}점 / 5점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <SmallStarIcon fill="#F9C927" />
      ))}
    </div>
  );
}

function ImageStrip({ images = [] as string[] }) {
  const displayImages = images.length > 0 ? images : ['', '', '', ''];

  return (
    <div className="flex items-start justify-start gap-1 self-stretch overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {displayImages.map((src, i) => (
        <div key={i} className="h-40 w-36 shrink-0 rounded bg-zinc-300">
          {src ? (
            <img
              src={src}
              alt={`리뷰 이미지 ${i + 1}`}
              className="h-full w-full rounded object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-3">
      <ImageStrip images={r.images} />

      {/* 작성자/메타 정보 */}
      <div className="flex flex-col items-start justify-start gap-1 self-stretch">
        <div className="inline-flex items-start justify-start gap-2">
          <div className="h-10 w-10 rounded-full bg-zinc-300" />
          <div className="inline-flex flex-col items-start justify-start gap-1">
            <div className="inline-flex items-center justify-start gap-2">
              <div className="justify-center text-sm font-medium text-black">{r.user}</div>
              <div className="h-1 w-1 rounded-full bg-gray-300" />
              <div className="justify-center text-xs text-black">{r.subscriptionLabel}</div>
            </div>
            <div className="mb-1 inline-flex w-30 items-start justify-between">
              <Rating value={r.rating} />
              <div className="justify-center text-[10px] text-gray-500">{r.timeAgo}</div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="max-h-28 justify-start self-stretch text-sm leading-snug text-black">
          {r.text}
        </div>
      </div>

      {/* 좋아요 */}
      <div className="flex flex-col items-end justify-center gap-2.5 self-stretch">
        <div className="inline-flex items-center justify-center gap-1 rounded border border-gray-600 px-2 py-1">
          <div className="relative h-5 w-5">
            <LikeIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="justify-start text-sm text-gray-600">{r.likes}</div>
        </div>
      </div>
    </div>
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
      images: ['', '', '', ''],
      likes: 100,
    },
    {
      id: '2',
      user: '맹꽁이',
      subscriptionLabel: '3회차 구독중',
      rating: 3,
      timeAgo: '3주일 전',
      text: '퇴근하고 맥주랑 한잔하기 좋아요 가성비도 좋고 매달 쟁여놓고 먹기 좋습니다',
      images: ['', '', '', ''],
      likes: 100,
    },
    {
      id: '3',
      user: '맹꽁이',
      subscriptionLabel: '10회차 구독중',
      rating: 5,
      timeAgo: '3주일 전',
      text: '매번 장보기 귀찮아서 구독 시작했는데 만족. 언제든 먹기 좋고 편리하고 뭐랑 먹어도 잘 어울려요',
      images: ['', '', '', ''],
      likes: 100,
    },
  ];

  return (
    <>
      {/* 헤더 */}
      {/* <HeaderCustom title="리뷰" showBack /> */}
      <section className="relative my-15 bg-white">
        {/* 별점 요약 */}
        <div className="flex w-full flex-col items-center gap-4 px-4">
          <div className="flex w-full flex-row items-center justify-center gap-2 py-3">
            <TotalRating value={5} />
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <span className="text-xl leading-7 font-semibold text-black">4.0</span>
                <span className="text-xl leading-7 font-semibold text-gray-600">/5.0</span>
              </div>
              <span className="text-xs leading-none text-gray-600">(500)</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`top-${i}`}
                  className="h-32 flex-1 rounded bg-zinc-300"
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className="h-32 flex-1 rounded bg-zinc-300"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        {/* 필터 바 */}
        <div className="sticky top-[52px] z-10 w-full border-b border-gray-200 bg-white">
          <div className="flex w-full justify-end gap-1.5 p-4">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-full border border-zinc-200 px-3 py-2 text-xs text-gray-900"
            >
              리스트 순
              <DownArrowIcon />
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-full border border-zinc-200 px-3 py-2 text-xs text-gray-900"
            >
              필터
              <FinterIcon />
            </button>
          </div>
        </div>

        {/* 리뷰 리스트 */}
        <div className="w-full px-4 py-5">
          <div className="flex flex-col gap-6">
            {reviews.map((r, index) => (
              <div key={r.id} className="flex flex-col">
                <ReviewCard r={r} />
                {index < reviews.length - 1 && (
                  <div className="mt-6 h-px self-stretch">
                    <div className="h-px w-full bg-gray-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
