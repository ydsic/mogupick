'use client';

import { useEffect, useState } from 'react';

import RankDownIcon from '@/assets/icons/rank/rank-down-12px.svg';
import RankUpIcon from '@/assets/icons/rank/rank-up-12px.svg';
import { getSearchTopRisingToday } from '@/api/search';

interface TrendingSearchProps {
  onSelect?: (keyword: string) => void;
}

export default function TrendingSearch({ onSelect }: TrendingSearchProps) {
  const [trending, setTrending] = useState<string[]>([]);
  const [updateTime, setUpdateTime] = useState<string>('');

  useEffect(() => {
    const fetchTopRising = async () => {
      try {
        const data = await getSearchTopRisingToday();
        // API가 { data: [...] } 형태 또는 바로 [...] 형태 둘 다 지원
        const raw = data?.data ?? data ?? [];
        // 원본 순서를 보장하기 위해 인덱스 붙이고 정렬(검색량 내림차순, 같으면 원래 인덱스 순 유지)
        const list = (Array.isArray(raw) ? raw : [])
          .map((item: any, idx: number) => ({ ...item, __idx: idx }))
          .slice()
          .sort((a: any, b: any) => {
            const diff = (b.searchedCount ?? 0) - (a.searchedCount ?? 0);
            return diff !== 0 ? diff : a.__idx - b.__idx;
          })
          .map((item: any) => item.content);
        setTrending(list.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch top-rising:', err);
        setTrending([]);
      }
    };
    fetchTopRising();

    const id = setInterval(fetchTopRising, 60_000);

    const now = new Date();
    now.setSeconds(0, 0);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setUpdateTime(`${month}.${day}.${hours}:${minutes}`);

    return () => clearInterval(id);
  }, []);

  const firstHalf = trending.slice(0, 5);
  const secondHalf = trending.slice(5, 10);

  if (trending.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        <div className="mb-2 flex items-end justify-between">
          <h3 className="text-base font-semibold">급상승 검색어</h3>
          {updateTime && <span className="text-xs text-gray-400">{updateTime} 기준</span>}
        </div>
        현재 급상승 검색어가 없습니다.
      </div>
    );
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
