import SearchHeader from '../_components/SearchHeader';
import { products } from '../../(home)/_components/HomePage';
import { ProductCardList } from '@/components/card/Product';

interface Props {
  searchParams: {
    q?: string;
  };
}

export default async function SearchResultPage({ searchParams }: Props) {
  const query = (await searchParams.q) ?? '';
  if (!query) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">검색어가 없습니다.</h2>
        <p className="mt-2 text-gray-500">검색어를 입력해주세요.</p>
      </div>
    );
  }

  // TODO: 나중에 API 연동할 자리
  // 현재는 mock 데이터(products)에서 검색어 필터링
  const filtered = query
    ? products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase().trim()))
    : [];

  return (
    <div className="flex flex-col">
      <SearchHeader />

      <div>
        {filtered.length > 0 && (
          <div className="flex items-end justify-between pt-2">
            <div className="text-sm">
              총 <span>{filtered.length}</span>개
            </div>
            <div>
              <span>정렬 순</span>
              <span>필터링</span>
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
              query={{ form: 'search', section: query }}
            />
          ) : (
            <>
              <h2>"{query}"에 대한 검색 결과</h2>
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
