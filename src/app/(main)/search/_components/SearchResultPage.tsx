'use client';

import { useEffect, useState } from 'react';
import { postSearch } from '@/api/search';
import { sortOptions } from '@/constants/sort';
import SortSelector from '@/components/ui/SortSelector';
import { ProductCardList } from '@/components/card/Product';
import EmptySearchIcon from '@/assets/icons/common/empty-search-80px.svg';

export default function SearchResultPage({ query }: { query?: string | string[] }) {
  const [sort, setSort] = useState<string>(sortOptions[0].value);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // TODO: 나중에 API 연동할 자리
  // 현재는 mock 데이터(products)에서 검색어 필터링
  const q = Array.isArray(query) ? query[0] : query;

  useEffect(() => {
    if (!q) return;
    let aborted = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await postSearch(q);
        if (aborted) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setResults(list);
      } catch (e: any) {
        if (!aborted) setError('검색 실패');
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [q]);

  return (
    <div>
      {loading && <p className="text-sm text-gray-500">검색 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {/* 기존 mock 정렬/필터 UI는 유지 */}
      {results.length > 0 && (
        <div className="flex items-center justify-between px-4 py-1">
          <div className="text-sm text-[13px] text-[#f6f6f6]">
            총 <span>{results.length}</span>개
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#434343]">
            <SortSelector value={sort} onChange={setSort} />
            <span className="rounded-2xl border border-[#d6d6d6] px-3 py-2 pr-8">필터</span>
          </div>
        </div>
      )}

      <div className="mt-2 space-y-2">
        {results.length > 0 ? (
          <ProductCardList
            path={`/products`}
            products={results}
            limit={results.length}
            showHeart={true}
            query={{ form: 'search', section: q || '' }}
          />
        ) : (
          !loading && (
            <div className="mt-6 flex h-96 flex-col items-center justify-center border-t border-[#f2f2f2]">
              <EmptySearchIcon />
              <p className="mt-6 text-lg font-semibold text-[#434343]">해당 검색결과가 없습니다.</p>
              <p className="text-[13px] text-[#a6a6a6]">다른 검색어로 재검색을 해주세요.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
