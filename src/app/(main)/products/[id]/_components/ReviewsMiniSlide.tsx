import { Review } from '../page';
import StarIcon from '@/assets/icons/common/star-16px.svg';

export default function ReviewsMiniSlide({
  review,
  onClickReview,
}: {
  review: Review;
  onClickReview: () => void;
}) {
  return (
    <li key={review.id} className="w-64 flex-shrink-0 rounded-sm bg-[#f8f8f8] p-3">
      <button className="flex gap-3 rounded-sm bg-gray-100" onClick={onClickReview}>
        <div className="aspect-square w-20 rounded-sm bg-[#d9d9d9]" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2 text-left text-sm font-medium">
            <span>{review.user}</span>
            <div className="h-1 w-1 rounded-full bg-[#d6d6d6]" />
            <span>{review.period}</span>
          </div>
          <div className="flex gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                // active : --yellow-500
                <StarIcon key={i} className="text-[#a6a6a6]" />
              ))}
            </div>
            <span className="text-xs text-[#a6a6a6]">{review.date}</span>
          </div>
          <p className="line-clamp-2 text-left text-xs text-[var(--color-primary)]">
            {review.content}
          </p>
        </div>
      </button>
    </li>
  );
}
