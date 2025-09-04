import Link from 'next/link';
import SubscribeIcon from '@/assets/icons/common/subscription-24px.svg';

export default function SubscribeListItem() {
  return (
    <li className="flex flex-col gap-3 rounded-sm bg-white p-4">
      <div className="flex gap-3">
        <div className="aspect-square w-28 rounded-xs bg-gray-200" />
        <div className="flex-1">
          <span className="mb-3 block text-sm">19회차 구독중</span>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-black">Product</p>
            <span>수량 1개</span>
          </div>
          <div className="text-lg font-bold text-black">
            <strong>10,000</strong>원
          </div>
          <div>
            <span className="text-sm text-gray-400">[결제 예정] 10월 5일</span>
            <div className="flex items-center gap-2 bg-green-50 p-2 text-green-700">
              <SubscribeIcon className="fill-current text-green-700" />
              <div>
                <span>1달</span>에 <span>한번</span> 구독
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 text-center text-gray-800">
        <Link href="/review/edit" className="flex-1 rounded-xs border border-gray-300 py-2">
          리뷰작성
        </Link>
        <Link href="/subscribe/:id" className="flex-1 rounded-xs border border-gray-300 py-2">
          주문확인 및 변경
        </Link>
      </div>
    </li>
  );
}
