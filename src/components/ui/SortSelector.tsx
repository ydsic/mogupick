'use client';

import React, { useMemo, useState } from 'react';
import { sortOptions } from '@/constants/sort';
import DownIcon from '@/assets/icons/common/down-16px.svg';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

// const sorted = useMemo(() => {
//   const arr = [...filtered];
//   switch (sort) {
//     case 'recommend':
//       return arr.sort((a, b) => (b.recommendScore || 0) - (a.recommendScore || 0));
//     case 'new':
//       return arr.sort(
//         (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//       );
//     case 'popular':
//       return arr.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
//     case 'review':
//       return arr.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
//     case 'priceLow':
//       return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
//     default:
//       return arr;
//   }
// }, [filtered, sort]);

export default function SortSelector({ value, onChange }: Props) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-auto appearance-none rounded-2xl border border-[#E4E6E8] py-2 pr-8 pl-4 text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* 아이콘을 select 오른쪽에 겹치도록 포지셔닝 */}
      <DownIcon className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}
