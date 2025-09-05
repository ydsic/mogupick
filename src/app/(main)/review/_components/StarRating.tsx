import BigStarIcon from '@/assets/icons/common/bigbig-star.svg';

interface Props {
  rating: number;
  onChange: (rating: number) => void;
}

export default function StarRating({ rating, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} onClick={() => onChange(i)}>
          {i <= rating ? (
            <BigStarIcon className="fill-current text-[#F9C927]" />
          ) : (
            <BigStarIcon className="fill-current text-gray-200" />
          )}
        </button>
      ))}
    </div>
  );
}
