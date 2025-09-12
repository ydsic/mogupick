'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import CloseIcon from '@/assets/icons/common/close-16px.svg';
import { RECENT_KEY, useRecentSearchStore } from '@/store/recentSearchStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function RecentSearch({ onSelect }: { onSelect: (v: string) => void }) {
  const router = useRouter();
  const { recent, addKeyword, removeKeyword, clearAll, setRecent } = useRecentSearchStore();
  const { isLoggedIn } = useAuthStore();

  // 비로그인: localStorage 로드, 로그인: SearchHeader에서 서버 값 ephemeral 세팅
  useEffect(() => {
    if (isLoggedIn) return; // 로그인 상태 skip
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecent(JSON.parse(saved));
    }
  }, [setRecent, isLoggedIn]);

  const handleSearch = (keyword: string) => {
    // 비로그인 상태에서만 addKeyword가 localStorage 업데이트 의미있음
    addKeyword(keyword);
    onSelect(keyword);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <h3 className="text-base font-semibold text-[#434343]">최근 검색어</h3>
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
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#d6d6d6] px-3 py-2 text-[13px] text-[#434343]"
              onClick={() => handleSearch(item)}
            >
              <span>{item}</span>
              {!isLoggedIn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeKeyword(item);
                  }}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">최근에 검색한 검색어가 없습니다.</p>
      )}
    </div>
  );
}
