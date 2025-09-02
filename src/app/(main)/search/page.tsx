import SearchPage from './_components/SearchPage';

interface Props {
  params: {
    q?: string;
  };
}

interface PageProps {
  searchParams: Promise<{ q: string }>;
}

// search
//  ┣ _components
//  ┃ ┣ RecentSearch.tsx        // Client, localStorage 관리
//  ┃ ┣ RelatedSearch.tsx       // Client, query 기반 연관검색어
//  ┃ ┣ SearchHeader.tsx         // SSR 가능 (form + input)
//  ┃ ┣ SearchPage.tsx          // Clinet, 검색 페이지
//  ┃ ┗ TrendingSearch.tsx      // Client, 1분마다 갱신
//  ┣ result
//  ┃ ┗ page.tsx                  // SSR, searchParams로 분기
//  ┗ page.tsx                  // SSR, searchParams로 분기

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams;

  console.log('q', q);

  return <SearchPage initialQuery={q} />;
}
