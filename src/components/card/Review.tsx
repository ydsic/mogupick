import { cn } from '@/lib/utils';

import RatingStarIcon from '@/assets/icons/common/rating-star-14px.svg';
import ReviewIcon from '@/assets/icons/common/review-14px.svg';
import Image from 'next/image';

export interface ReviewUser {
  id: number;
  username: string;
  avatar?: string;
  store: string;
  title: string;
  rating: number;
  reviewCount: number;
}

interface ReviewCardProps {
  r: ReviewUser;
  className?: string;
}

function ReviewCard({ r, className }: ReviewCardProps) {
  return (
    <div className={cn('flex flex-col rounded-xl shadow-[var(--shadow-md)]', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          {r.avatar && (
            <Image src={r.avatar} alt={r.username} className="h-full w-full object-cover" />
          )}
        </div>
        <span className="font-normal">{r.username}</span>
      </div>

      {/* Images */}
      <div className="aspect-[9/10] flex-1 bg-gray-100"></div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 p-3">
        <p className="text-sm text-gray-500">{r.store}</p>
        <p className="text-base font-semibold">{r.title}</p>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <RatingStarIcon />
            <span>{r.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            /<ReviewIcon />
            <span>{r.reviewCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type ReviewListLayout = 'grid' | 'horizontal' | 'list';

interface ReviewCardListProps {
  reviews: ReviewUser[];
  layout?: ReviewListLayout;
}

function ReviewCardList({ reviews, layout = 'grid' }: ReviewCardListProps) {
  if (layout === 'horizontal') {
    return (
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
        {reviews.map((r) => (
          <ReviewCard key={r.id} r={r} className="min-w-[250px] flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-6">
        {reviews.map((r) => (
          <ReviewCard key={r.id} r={r} className="w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} r={r} />
      ))}
    </div>
  );
}

export { ReviewCard, ReviewCardList };
