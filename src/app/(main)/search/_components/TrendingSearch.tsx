'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import RankDownIcon from '@/assets/icons/rank/rank-down-12px.svg';
import RankUpIcon from '@/assets/icons/rank/rank-up-12px.svg';

const mockTrending = [
  '아이폰 16',
  '갤럭시 Z 폴드',
  '플스5',
  '에어팟 맥스',
  '노트북',
  '아이폰',
  '에어팟',
  '거치대',
  '모니터 암',
  '리프트 책상',
];

interface TrendingSearchProps {
  onSelect?: (keyword: string) => void;
}

export default function TrendingSearch({ onSelect }: TrendingSearchProps) {
  const [trending, setTrending] = useState<string[]>([]);
  const [updateTime, setUpdateTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const shuffled = [...mockTrending].sort(() => 0.5 - Math.random());
      setTrending(shuffled.slice(0, 10));
    };

    const now = new Date();
    now.setSeconds(0, 0); // 초는 0으로 맞춰서 깔끔하게

    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setUpdateTime(`${month}.${day}.${hours}:${minutes}`);

    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const firstHalf = trending.slice(0, 5);
  const secondHalf = trending.slice(5, 10);

  if (trending.length === 0) {
    return <div className="p-4 text-sm text-gray-500">현재 급상승 검색어가 없습니다.</div>;
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <h3 className="text-base font-semibold">급상승 검색어</h3>
        <span className="text-xs text-gray-500">{updateTime} 기준 업데이트</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-6">
        {/* 왼쪽 리스트 */}
        <ol className="list-inside list-decimal space-y-3 text-sm">
          {firstHalf.map((item, i) => (
            <li
              key={i}
              onClick={() => onSelect?.(item)}
              className="flex cursor-pointer items-center justify-between"
            >
              <div className="flex gap-5">
                <span>{i + 1}</span>
                <p className="hover:underline">{item}</p>
              </div>

              {<RankUpIcon />}
            </li>
          ))}
        </ol>

        {/* 오른쪽 리스트 (6번부터 시작) */}
        <ol start={6} className="list-inside list-decimal space-y-3 text-sm">
          {secondHalf.map((item, i) => (
            <li
              key={i + 5}
              onClick={() => onSelect?.(item)}
              className="flex cursor-pointer items-center justify-between"
            >
              <div className="flex gap-5">
                <span>{i + 6}</span>
                <p className="hover:underline">{item}</p>
              </div>
              {<RankDownIcon />}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
