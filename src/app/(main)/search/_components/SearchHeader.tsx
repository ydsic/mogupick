'use client';

import PrevIcon from '@/assets/icons/common/prev-32px.svg';
import CloseIcon from '@/assets/icons/common/close-24px.svg';
import CartIcon from '@/assets/icons/common/shoppingcart-32px.svg';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRecentSearchStore } from '@/store/recentSearchStore';

interface SearchHeaderProps {
  value?: string;
  onChange?: (v: string) => void;
}

export default function SearchHeader({ value = '', onChange }: SearchHeaderProps) {
  const router = useRouter();
  const { addKeyword } = useRecentSearchStore();

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addKeyword(inputValue.trim());
    router.push(`/search/result?q=${encodeURIComponent(inputValue.trim())}`);
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
