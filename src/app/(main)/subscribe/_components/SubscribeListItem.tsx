import Link from 'next/link';
import SubscribeIcon from '@/assets/icons/common/subscription-16px.svg';
import type { SubscriptionItem } from '@/api/subscription';
import Image from 'next/image';

function formatWon(n: number) {
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
}

function formatKoreanDate(iso?: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}월 ${day}일`;
}

// http 이미지를 https로 보정(혼합 콘텐츠 방지)
function toHttps(url?: string) {
  if (!url) return undefined;
  try {
    return url.replace(/^http:\/\//i, 'https://');
  } catch {
    return url;
  }
}

export default function SubscribeListItem({ item }: { item: SubscriptionItem }) {
  const progressLabel = `${item.progressRound}회차 구독중`;
  const price = formatWon(item.price);
  const nextBilling = formatKoreanDate(item.nextBillingDate);
  // deliveryCycle 예: "1달" / "2주" 등 서버 포맷을 그대로 표시

  const imgSrc = toHttps(item.productThumbnailUrl || item.productImageUrl || item.imageUrl);

  return (
    <li className="flex flex-col gap-3 rounded-sm bg-white p-4">
      <div className="flex gap-3">
        <div className="relative aspect-[1/1] w-28 overflow-hidden rounded-[4px] bg-[var(--grey-300)]">
          {imgSrc && (
            <Image src={imgSrc} alt={item.productName} fill className="object-cover" unoptimized />
          )}
        </div>
        <div className="flex-1">
          <span className="mb-1 block text-sm text-[#a6a6a6]">{progressLabel}</span>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#434343]">{item.productName}</p>
            <span className="text-xs text-[#6f6f6f]">{item.brandName}</span>
          </div>
          <div className="text-base font-semibold text-[#242424]">
            <strong>{price}</strong>원
          </div>
          <div>
            <span className="text-sm text-[#6f6f6f]">[결제 예정] {nextBilling}</span>
            <div className="mt-1 flex items-center gap-1 bg-[#F3F9EB] p-2">
              <SubscribeIcon className="fill-current text-[#7AB335]" />
              <div className="text-sm text-[#7AB335]">{item.deliveryCycle} 구독</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 text-center text-sm text-[#434343]">
        <>
          <Link href="/review" className="flex-1 rounded-[4px] border border-[#d6d6d6] py-2">
            리뷰작성
          </Link>
          <Link
            href={`/subscribe/${item.subscriptionId}`}
            className="flex-1 rounded-[4px] border border-[#d6d6d6] py-2"
          >
            주문확인 및 변경
          </Link>
        </>
      </div>
    </li>
  );
}
