'use client';

import { useMemo, useState } from 'react';
import { products } from '../../(home)/_components/HomePage';
import { sortOptions } from '@/constants/sort';
import SortSelector from '@/components/ui/SortSelector';
import { ProductCardList } from '@/components/card/Product';

export default function SearchResultPage({ query }: { query?: string | string[] }) {
  const [sort, setSort] = useState<string>(sortOptions[0].value);
  // TODO: 나중에 API 연동할 자리
  // 현재는 mock 데이터(products)에서 검색어 필터링
  const q = Array.isArray(query) ? query[0] : query;
  const filtered = q
    ? products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase().trim()))
    : [];

  return (
    <div>
      {filtered.length > 0 && (
        <div className="flex items-end justify-between pt-2">
          <div className="text-sm">
            총 <span>{filtered.length}</span>개
          </div>
          <div className="flex items-center gap-2">
            <SortSelector value={sort} onChange={setSort} />
            <span className="rounded-2xl border border-[#E4E6E8] px-3 py-2 pr-8 text-sm">필터</span>
          </div>
        </div>
      )}

      <div className="mt-2 space-y-2">
        {filtered.length > 0 ? (
          <ProductCardList
            path={`/products`}
            products={filtered}
            limit={filtered.length}
            showHeart={true}
            query={{ form: 'search', section: q || '' }}
          />
        ) : (
          <>
            <h2>"{q}"에 대한 검색 결과</h2>
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </>
        )}
      </div>
    </div>
  );
}
