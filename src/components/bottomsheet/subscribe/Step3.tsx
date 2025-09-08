import LikeIcon from '@/assets/icons/common/icon-24-like.svg';
import Link from 'next/link';

export default function Step3({
  productName,
  pricePerItem,
  quantity,
  resultDay,
  resultWeek,
  increase,
  decrease,
  onLike,
  isLiked,
}: {
  productName: string;
  pricePerItem: number;
  quantity: number;
  resultDay: string;
  resultWeek: string;
  increase: () => void;
  decrease: () => void;
  onLike?: () => void;
  isLiked?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 pt-4">
      <div className="flex flex-col justify-between gap-3 rounded bg-gray-100 px-4 py-3">
        <span className="text-base font-medium">{productName}</span>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center text-base font-medium">
            <button className="rounded-tl rounded-bl bg-white px-3 py-1" onClick={decrease}>
              -
            </button>
            <span className="bg-white px-3 py-2 text-xs">{quantity}</span>
            <button className="rounded-tr rounded-br bg-white px-3 py-1" onClick={increase}>
              +
            </button>
          </div>
          <div className="text-lg font-medium">
            <span>{pricePerItem.toLocaleString()}</span>원
          </div>
        </div>
      </div>
      <div className="mb-2 flex flex-col items-center rounded border border-lime-50 text-base font-medium">
        <span className="w-full bg-lime-50 py-3 text-center">구독주기</span>
        <p className="py-4 text-lime-600">
          {resultWeek}에 한번 ∙ 배송희망일 {resultDay}
        </p>
      </div>
      <div className="flex gap-3 text-base">
        <button className="flex flex-col text-xs text-gray-500" onClick={onLike}>
          <LikeIcon className="mb-1 h-6 w-6 fill-current text-[#555]" />
          <span className="text-sm">좋아요</span>
        </button>
        <Link href={'/cart'} className="flex-1 rounded border border-gray-300 py-3 text-center">
          장바구니
        </Link>
        <Link href={'/paments'} className="flex-1 rounded bg-black py-3 text-center text-white">
          바로구매
        </Link>
      </div>
    </div>
  );
}
