import StarIcon from '@/assets/icons/common/star-16px.svg';
import LikeIcon from '@/assets/icons/common/hand-like.svg';
import { Review } from '../page';

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <li className="border-t border-[var(--grey-100)] py-4 first:border-none">
      {/* 리뷰 이미지 리스트 */}
      <div className="flex gap-1 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square w-36 flex-shrink-0 rounded-xs bg-[var(--grey-200)]"
          />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          {/* 유저 정보 */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-[var(--grey-200)]" />
            {/* 프로필 이미지 placeholder */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
                <span>{review.user}</span>
                <div className="h-[4px] w-[4px] rounded-full bg-[#d6d6d6]" />
                <span className="font-normal text-gray-600">{review.period} 구독중</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="fill-current text-[var(--grey-200)]" />
                ))}
                <span className="ml-1">{review.date}</span>
              </div>
            </div>
          </div>

          {/* 리뷰 텍스트 */}
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-primary)]">
            {review.content}{' '}
          </p>
        </div>

        {/* 좋아요 버튼 */}
        <button className="flex items-center justify-end gap-1 text-sm text-[#6f6f6f]">
          <div className="inline-flex items-center justify-center gap-1 rounded border border-[#6f6f6f] px-2 py-1">
            <LikeIcon />
            <span className="text-sm font-normal">100</span>
          </div>
        </button>
      </div>
    </li>
  );
}
