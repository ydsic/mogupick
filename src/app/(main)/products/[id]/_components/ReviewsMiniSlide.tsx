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
    <li key={review.id} className="w-64 flex-shrink-0 rounded-sm bg-gray-100 p-3">
      <button className="flex gap-3 rounded-sm bg-gray-100" onClick={onClickReview}>
        <div className="aspect-square w-20 rounded-xs bg-gray-200" />
        <div className="flex-1">
          <div className="text-sm font-medium">
            <span>{review.user}</span>
            <span>{review.period}</span>
          </div>
          <div className="flex gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-gray-700">{review.content}</p>
        </div>
      </button>
    </li>
  );
}
