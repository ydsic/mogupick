import SearchHeader from '../_components/SearchHeader';
import SearchResultPage from '../_components/SearchResultPage';

interface Props {
  searchParams: {
    q?: string;
  };
}

export default function Page({ searchParams }: Props) {
  const query = searchParams.q ?? '';
  if (!query) {
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

      <SearchResultPage query={query} />
    </div>
  );
}
