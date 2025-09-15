import HeaderCustom from '@/components/HeaderCustom';
import DeliveryIcon from '@/assets/icons/common/delivery-24px.svg';
import InfoIcon from '@/assets/icons/common/info-14px.svg';
import DownIcon from '@/assets/icons/down.svg';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <HeaderCustom showBack title="상세보기" />
      <div className="h-dvh bg-[#f8f8f8] py-14">
        <div className="flex flex-col gap-3 bg-white p-4 pb-8">
          <div className="flex gap-3">
            <div className="aspect-[1/1] w-28 rounded-xs bg-[var(--grey-300)]" />
            <div className="flex flex-1 flex-col justify-center gap-1 text-sm text-black">
              <span className="text-[var(--main-color)]">1회차 진행중</span>
              <span className="text-[var(--grey-500)]">브랜드명</span>
              <p className="text-base font-semibold text-[var(--color-primary)]">상품이름</p>
              <div className="text-lg font-semibold">
                <span>10,000</span>원
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-sm bg-[#f8f8f8] p-3">
            <p className="font-medium text-[var(--color-pprimary)]">[배송주기 ] 1달에 한 번 구독</p>
            <p className="mb-2 text-xs font-normal text-[#a6a6a6]">
              · 진행중 회차의 ‘결제예정 또는 재결제예정” 외 상태에서 변경하신 옵션은 다음 회차부터
              적용됩니다.
            </p>
            <Link
              href={'/subscribe/:id/edit'}
              className="rounded-xs border border-gray-200 bg-white p-2 text-center text-sm text-black"
            >
              옵션 변경
            </Link>
          </div>
        </div>

        <div className="mt-2 bg-white px-4">
          <div className="border-b border-[var(--grey-100)] py-8">
            <h2 className="mb-1 text-xl font-bold">진행상태</h2>
            <p className="text-sm text-[var(--grey-500)]">결제예정 · 9월 5일(금)</p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <DeliveryIcon />
                <button className="rounded-[3px] border border-[var(--grey-200)] px-3 py-2 text-[13px] text-[var(--color-primary)]">
                  배송조회
                </button>
              </div>
              <div className="h-1 w-full rounded-xs bg-[var(--grey-100)]" />
              <div className="flex items-center gap-1 text-xs text-[var(--color-primary)]">
                <InfoIcon />
                <p>배송이 시작된 이후 배송조회가 가능합니다.</p>
              </div>
            </div>
          </div>

          <div className="border-b border-[var(--grey-100)] py-8">
            <h2 className="mb-3 text-xl font-bold">회차내역</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-end justify-between">
                  <span className="font-medium text-[var(--color-primary)]">1회차</span>
                  <div className="flex gap-5 font-normal text-[var(--grey-500)]">
                    <span>결제예정</span>
                    <span>25.09.03</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="rounded-[3px] bg-[var(--grey-500)] px-1 py-0.5 text-sm font-medium text-white">
                    진행예정
                  </span>
                  <div className="flex gap-5 font-normal text-[var(--grey-500)]">
                    <span>도착예정</span>
                    <span>25.09.05</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-end justify-between">
                  <span className="font-medium text-[var(--color-primary)]">2회차</span>
                  <div className="flex gap-5 font-normal text-[var(--grey-500)]">
                    <span>결제예정</span>
                    <span>25.10.03</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="rounded-[3px] bg-[var(--main-color)] px-1 py-0.5 text-sm font-medium text-white">
                    진행중
                  </span>
                  <div className="flex gap-5 font-normal text-[var(--grey-500)]">
                    <span>도착예정</span>
                    <span>25.10.05</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-[4px] border border-[var(--grey-200)] py-3 text-[var(--color-primary)]">
              <span>더보기</span> <DownIcon />
            </button>
          </div>

          <div className="pt-8 pb-16">
            <h2 className="mb-3 text-xl font-bold">배송지 관리</h2>
            <div className="flex flex-col gap-1 text-sm font-medium text-[var(--color-primary)]">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span>김구름</span>
                  <span>010-0000-0000</span>
                  <p>서울시 용산구 서빙고로 137 (용산동6가 168-6)</p>
                </div>
                <button className="rounded-[4px] border border-[var(--grey-200)] bg-white px-3 py-2 text-[var(--color-primary)]">
                  변경
                </button>
              </div>
            </div>
          </div>
          <div className="pb-16">
            <button className="w-full rounded-xs border border-gray-200 bg-white py-3 text-base text-black">
              구독해지
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
