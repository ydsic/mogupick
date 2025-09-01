'use client';

import { useState } from 'react';
import RecentSearch from './RecentSearch';
import RelatedSearch from './RelatedSearch';
import SearchHeader from './SearchHeader';
import TrendingSearch from './TrendingSearch';
import { useRouter } from 'next/navigation';

interface Props {
  initialQuery?: string;
}

export default function SearchPage({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const router = useRouter();

  const handleSearch = (keyword: string) => {
    setQuery(keyword);
    router.push(`/search/result?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="flex flex-col">
      <SearchHeader value={query} onChange={setQuery} />

      <div className="mt-6 flex flex-col gap-10">
        {query ? (
          <>
            {/* 검색어 입력값이 있는 경우, 연관 검색어 */}
            <RelatedSearch query={query} onSelect={handleSearch} />
          </>
        ) : (
          <>
            {/* 검색어 입력없는 경우, 최근 검색어 & 급상승 검색어 */}
            <RecentSearch onSelect={handleSearch} />
            <TrendingSearch onSelect={handleSearch} />
          </>
        )}
      </div>
    </div>
  );
}
