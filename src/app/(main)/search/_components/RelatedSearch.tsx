const mockSuggestions = ['노트북 거치대', '노트북 파우치', '노트북 가방', '노트북 스탠드'];

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi')); // 대소문자 무시
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="font-semibold text-blue-500">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function RelatedSearch({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 border-t border-gray-300 pt-6 font-bold">연관 검색어</h3>
      <ul className="space-y-2">
        {mockSuggestions.map((item) => (
          <li
            key={item}
            className="cursor-pointer hover:text-blue-500"
            onClick={() => onSelect(item)}
          >
            <HighlightText text={item} query={query} />
          </li>
        ))}
      </ul>
    </div>
  );
}
