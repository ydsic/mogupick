'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CloseIcon from '@/assets/icons/common/close-16px.svg';
import { RECENT_KEY, useRecentSearchStore } from '@/store/recentSearchStore';

export default function RecentSearch({ onSelect }: { onSelect: (v: string) => void }) {
  const router = useRouter();
  const { recent, addKeyword, removeKeyword, clearAll, setRecent } = useRecentSearchStore();

  // 클라이언트에서만 localStorage 접근
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecent(JSON.parse(saved));
    }
  }, [setRecent]);

  const handleSearch = (keyword: string) => {
    addKeyword(keyword);
    onSelect(keyword);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <h3 className="text-base font-semibold">최근 검색어</h3>
        {recent.length > 0 && (
          <button className="text-xs text-gray-500" onClick={clearAll}>
            전체 삭제
          </button>
        )}
      </div>

      {recent.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
          {recent.map((item) => (
            <div
              key={item}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm"
              onClick={() => handleSearch(item)}
            >
              <span>{item}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeKeyword(item);
                }}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">최근에 검색한 검색어가 없습니다.</p>
      )}
    </div>
  );
}
