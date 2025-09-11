import Link from 'next/link';
import SubscribeIcon from '@/assets/icons/common/subscription-16px.svg';

export default function SubscribeListItem() {
  return (
    <li className="flex flex-col gap-3 rounded-sm bg-white p-4">
      <div className="flex gap-3">
        <div className="aspect-[square] w-28 rounded-[4px] bg-[var(--grey-300)]" />
        <div className="flex-1">
          <span className="mb-1 block text-sm text-[#a6a6a6]">19회차 구독중</span>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#434343]">Product</p>
            <span className="text-xs text-[#6f6f6f]">수량 1개</span>
          </div>
          <div className="text-base font-semibold text-[#242424]">
            <strong>10,000</strong>원
          </div>
          <div>
            <span className="text-sm text-[#6f6f6f]">[결제 예정] 10월 5일</span>
            <div className="flex items-center gap-1 bg-[#F3F9EB] p-2">
              <SubscribeIcon className="fill-current text-[#7AB335]" />
              {/* text-[#6f6f6f] */}
              <div className="text-sm text-[#7AB335]">
                <span>1달</span>에 <span>한번</span> 구독
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 text-center text-sm text-[#434343]">
        <>
          <Link href="/review" className="flex-1 rounded-[4px] border border-[#d6d6d6] py-2">
            리뷰작성
          </Link>
          <Link href="/subscribe/:id" className="flex-1 rounded-[4px] border border-[#d6d6d6] py-2">
            주문확인 및 변경
          </Link>
        </>
        {/* <button className="flex-1 rounded-[4px] border border-[#d6d6d6] py-2">구독 재시작</button> */}
      </div>
    </li>
  );
}
