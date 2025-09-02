import StarIcon from '@/assets/icons/common/star-16px.svg';
import LikeIcon from '@/assets/icons/common/hand-like.svg';
import { Review } from '../page';

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <li className="border-t border-gray-200 py-4">
      {/* 리뷰 이미지 리스트 */}
      <div className="flex gap-1 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square w-36 flex-shrink-0 rounded-xs bg-gray-200" />
        ))}
      </div>
      <div>
        {/* 유저 정보 */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          {/* 프로필 이미지 placeholder */}
          <div>
            <div className="flex items-center gap-1 text-sm font-medium text-black">
              <span>{review.user}</span>
              <span className="text-gray-600">· {review.period} 구독중</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
              <span className="ml-1">{review.date}</span>
            </div>
          </div>
        </div>

        {/* 리뷰 텍스트 */}
        <p className="mt-2 text-sm leading-relaxed text-gray-800">{review.content} </p>

        {/* 좋아요 버튼 */}
        <button className="mt-3 flex items-center gap-1 text-sm text-gray-500">
          <div className="inline-flex items-center justify-center gap-1 rounded border border-gray-500 px-2 py-1">
            <LikeIcon />
            <span className="justify-start text-sm text-gray-600">100</span>
          </div>
        </button>
      </div>
    </li>
  );
}
