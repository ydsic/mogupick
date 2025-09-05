import HeaderCustom from '@/components/HeaderCustom';
import DeliveryIcon from '@/assets/icons/common/delivery-24px.svg';
import InfoIcon from '@/assets/icons/common/info-14px.svg';
import DownIcon from '@/assets/icons/down.svg';

export default function Page() {
  return (
    <div>
      <HeaderCustom showBack title="상세보기" />
      <div className="h-dvh bg-gray-100 py-14">
        <div className="flex flex-col gap-3 bg-white p-4">
          <div className="flex gap-3">
            <div className="aspect-[1/1] w-28 rounded-xs bg-gray-200" />
            <div className="flex flex-1 flex-col gap-1 text-sm text-black">
              <span className="text-yellow-600">1회차 진행중</span>
              <span>브랜드명</span>
              <p className="text-base font-semibold">상품이름</p>
              <div className="text-lg font-semibold">
                <span>10,000</span>원
              </div>
              <span className="text-gray-600">수량 1개</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-gray-50 px-3 py-2">
            <p className="font-semibold">[배송주기 ]1달에 한 번 구독</p>
            <button className="rounded-xs border border-gray-200 bg-white p-2 text-sm text-black">
              옵션 변경
            </button>
            <p className="text-xs font-medium text-green-700">
              · 진행중 회차의 ‘결제예정 또는 재결제예정” 외 상태에서 변경하신 옵션은 다음 회차부터
              적용됩니다.
            </p>
          </div>
        </div>

        <div className="mt-2 bg-white px-4">
          <div className="border-b border-gray-200 py-8">
            <h2 className="mb-1 text-xl font-bold">진행상태</h2>
            <p className="text-gray-500">결제예정 · 9월 5일(금)</p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <DeliveryIcon />
                <button className="border border-gray-200 px-3 py-2">배송조회</button>
              </div>
              <div className="h-1 w-full bg-gray-200" />
              <div className="flex items-center gap-1 text-xs">
                <InfoIcon />
                <p>배송이 시작된 이후 배송조회가 가능합니다.</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 py-8">
            <h2 className="mb-3 text-xl font-bold">회차내역</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-end justify-between">
                  <span className="font-medium">1회차</span>
                  <div className="flex gap-5 font-semibold">
                    <span>결제예정</span>
                    <span>25.09.03</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-medium">진행중</span>
                  <div className="flex gap-5 font-semibold">
                    <span>도착예정</span>
                    <span>25.09.05</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-end justify-between">
                  <span className="font-medium">2회차</span>
                  <div className="flex gap-5 font-semibold">
                    <span>결제예정</span>
                    <span>25.10.03</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-medium">진행중</span>
                  <div className="flex gap-5 font-semibold">
                    <span>도착예정</span>
                    <span>25.10.05</span>
                  </div>
                </div>
              </div>

              <button className="mt-2 flex items-center justify-center gap-2">
                <span>더보기</span> <DownIcon />
              </button>
            </div>
          </div>

          <div className="pt-8 pb-13">
            <h2 className="mb-3 text-xl font-bold">배송지 관리</h2>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span>김구름</span>
                  <span>010-0000-0000</span>
                </div>
                <button className="rounded-xs border border-gray-200 bg-white px-3 py-2">
                  변경
                </button>
              </div>
              <p className="">서울시 용산구 서빙고로 137 (용산동6가 168-6)</p>
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
