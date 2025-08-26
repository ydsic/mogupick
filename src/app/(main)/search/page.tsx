interface Props {
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: Props) {
  const query = searchParams.q;

  return (
    <div>
      search page 검색페이지
      <span>두둥타 - 닥 !</span>
    </div>
  );
}
