'use client';

import PrevIcon from '@/assets/icons/common/prev-32px.svg';
import CloseIcon from '@/assets/icons/common/close-24px.svg';
import CartIcon from '@/assets/icons/common/shoppingcart-32px.svg';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRecentSearchStore } from '@/store/recentSearchStore';
import { postSearch, getSearchRecent } from '@/api/search';
import { useAuthStore } from '@/store/useAuthStore';

interface SearchHeaderProps {
  value?: string;
  onChange?: (v: string) => void;
}

export default function SearchHeader({ value = '', onChange }: SearchHeaderProps) {
  const router = useRouter();
  const { addKeyword } = useRecentSearchStore();
  const { isLoggedIn } = useAuthStore();

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 로그인 상태면 마운트 시 서버 최근검색어 호출 → 구조 콘솔 출력
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        const recent = await getSearchRecent();
        const { setRecentEphemeral } = useRecentSearchStore.getState();
        if (Array.isArray(recent)) {
          const keywords = recent.map((r: any) => r.content).filter(Boolean);
          if (keywords.length) setRecentEphemeral(keywords);
        } else if (recent?.data && Array.isArray(recent.data)) {
          const keywords = recent.data.map((r: any) => r.content).filter(Boolean);
          if (keywords.length) setRecentEphemeral(keywords);
        }
      } catch (e) {
        console.error('최근 검색어 불러오기 실패', e);
      }
    })();
  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const keyword = inputValue.trim();

    if (!isLoggedIn) {
      // 비로그인: 기존 로컬 recent 저장 로직 유지
      addKeyword(keyword);
    }

    try {
      await postSearch(keyword); // 토큰 자동 포함 (로그인 시)
    } catch (err) {
      console.error('postSearch 실패', err);
    }
    router.push(`/search/result?q=${encodeURIComponent(keyword)}`);
  };

  const clearInput = () => {
    setInputValue('');
    onChange?.('');
    router.push(`/search`);
  };

  return (
    <header className="flex h-14 items-center justify-between gap-3">
      <button onClick={() => router.replace('/')}>
        <PrevIcon />
      </button>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 items-center justify-between rounded-xl bg-[#F4F4F4] px-2 font-medium text-gray-700"
      >
        <input
          className="w-full px-4 py-2"
          placeholder="검색어를 입력하세요."
          onChange={handleChange}
          value={inputValue}
        />
        {inputValue && (
          <button type="button" onClick={clearInput}>
            <CloseIcon />
          </button>
        )}
        <button type="submit" className="hidden"></button>
      </form>
      <CartIcon />
    </header>
  );
}
