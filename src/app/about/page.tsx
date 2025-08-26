'use client';

import { useState } from 'react';

import QuoteIcon from '@/assets/icons/common/bi_quote-32px.svg';
import CategoryIcon from '@/assets/icons/common/category-24px.svg';
import CloseIcon from '@/assets/icons/common/close-16px.svg';
import DownIcon from '@/assets/icons/common/down-16px.svg';
import FillterIcon from '@/assets/icons/common/fillter-16px.svg';
import HandIcon from '@/assets/icons/common/hand-24px.svg';
import HeartIcon from '@/assets/icons/common/heart-24px.svg';
import HomeIcon from '@/assets/icons/common/home-24px.svg';
import InfoIcon from '@/assets/icons/common/info-14px.svg';
import LikeIcon from '@/assets/icons/common/like-24px.svg';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import NotificationIcon from '@/assets/icons/common/notification-32px.svg';
import RatingStarIcon from '@/assets/icons/common/rating-star-14px.svg';
import ReviewIcon from '@/assets/icons/common/review-14px.svg';
import UserIcon from '@/assets/icons/common/user-24px.svg';
import RankDownIcon from '@/assets/icons/rank/rank-down-12px.svg';
import RankStableIcon from '@/assets/icons/rank/rank-stable-12px.svg';
import RankUpIcon from '@/assets/icons/rank/rank-up-12px.svg';
import { Chips, ChipsList } from '@/components/ui/Chips';

const categories = [
  '신선식품',
  '정육·수산물',
  '유제품·음료',
  '간편식',
  '간식',
  '건강식품',
  '생활잡화',
  '위생용품',
  '반려동물',
  '육아용품',
];

export default function About() {
  const [selected, setSelected] = useState<string | null>(categories[0]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-4xl font-bold">테스트용 페이지</h1>

      <ChipsList>
        {categories.map((cat) => (
          <Chips key={cat} selected={selected === cat} onClick={() => setSelected(cat)}>
            {cat}
          </Chips>
        ))}
      </ChipsList>

      <div className="m-10 space-y-8 bg-gray-700 p-5">
        <section>
          <div className="flex flex-col items-center gap-10 space-x-4">
            <div className="flex flex-col items-center">
              <p className="mb-2">12px 아이콘들</p>
              <RankUpIcon width="20px" height="24px" className="h-6 w-6" />
              <RankDownIcon className="h-6 w-6" />
              <RankStableIcon className="h-6 w-6" />
            </div>

            <div className="flex flex-col items-center">
              <p className="mb-2">14px 아이콘들</p>
              <InfoIcon className="h-6 w-6" />
              <RatingStarIcon className="h-6 w-6" />
              <ReviewIcon className="h-6 w-6" />
            </div>

            <div className="flex flex-col items-center">
              <p className="mb-2">16px 아이콘들</p>
              <CloseIcon className="h-6 w-6 fill-black" />
              <FillterIcon className="h-6 w-6 fill-black" />
              <DownIcon className="h-6 w-6 fill-black" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="mb-2">24px 아이콘들</p>
              <CategoryIcon className="h-8 w-8 fill-blue-500" />
              <HandIcon className="h-8 w-8 fill-green-500" />
              <HeartIcon className="h-8 w-8 fill-red-500" />
              <HomeIcon className="h-8 w-8 fill-orange-500" />
              <LikeIcon className="h-8 w-8 fill-pink-500" />
              <NextIcon className="h-8 w-8 fill-teal-500" />
              <UserIcon className="h-8 w-8 fill-cyan-500" />
            </div>

            <div className="flex flex-col items-center">
              <p className="mb-2">32px 아이콘들</p>
              <QuoteIcon className="h-12 w-12" />
              <NotificationIcon className="h-12 w-12" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
