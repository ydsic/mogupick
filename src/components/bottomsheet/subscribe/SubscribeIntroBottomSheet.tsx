import BottomSheet from '../BottomSheet';
import LikeIcon from '@/assets/icons/common/icon-24-like.svg';

interface SubscribeIntroBottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  subscriberCount?: number;
  onSubscribe: () => void;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function SubscribeIntroBottomSheet({
  isOpen,
  onClose,
  subscriberCount,
  onSubscribe,
  onLike,
}: SubscribeIntroBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <p className="py-4 text-center text-sm text-lime-500">
        현재 {subscriberCount}명이 정기구독중이에요
      </p>

      <div className="mt-3 flex items-center justify-between">
        <button className="flex flex-col items-center text-gray-500" onClick={onLike}>
          <LikeIcon className="mb-1 h-6 w-6 fill-current text-[#555]" />
          <span className="text-sm">좋아요</span>
        </button>

        <button
          onClick={onSubscribe}
          className="ml-4 flex-1 rounded bg-black py-3 text-center text-white"
        >
          구독하기
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <span className="h-1.5 w-36 rounded-full bg-black" />
      </div>
    </BottomSheet>
  );
}
