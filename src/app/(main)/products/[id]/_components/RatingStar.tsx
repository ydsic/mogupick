import StarIcon from '@/assets/icons/common/star-16px.svg';
import RatingStarIcon from '@/assets/icons/common/icon-16-star-fill.svg';

interface RatingStarProps {
  rating?: number; // 채워진 별 개수
  maxRating?: number; // 최대 별 개수, 기본 5
  className?: string; // 전체 wrapper 클래스
}

export default function RatingStar({ rating = 5, maxRating = 5, className = '' }: RatingStarProps) {
  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: maxRating }).map((_, i) =>
        i < rating ? (
          <StarIcon key={i} className="fill-current text-[var(--color-warning)]" />
        ) : (
          <RatingStarIcon key={i} className="fill-current text-[var(--grey-200)]" />
        ),
      )}
    </div>
  );
}
