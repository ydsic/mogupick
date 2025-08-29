interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div>
      search page 검색페이지
      <span>두둥타 - 닥 !{q}</span>
    </div>
  );
}
