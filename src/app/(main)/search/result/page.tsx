import SearchHeader from '../_components/SearchHeader';
import SearchResultPage from '../_components/SearchResultPage';

interface Props {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  const queries = q ? (Array.isArray(q) ? q : [q]) : [];
  if (!queries) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">검색어가 없습니다.</h2>
        <p className="mt-2 text-gray-500">검색어를 입력해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4">
      <SearchHeader />

      <SearchResultPage query={queries} />
    </div>
  );
}
