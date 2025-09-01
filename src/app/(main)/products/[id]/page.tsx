import HeaderCustom from '@/components/HeaderCustom';
import { products } from '../../(home)/_components/HomePage';

import LikeIcon from '@/assets/icons/common/icon-24-like.svg';
import ShareIcon from '@/assets/icons/common/icon-24-Share.svg';
import RatingStarIcon from '@/assets/icons/common/icon-16-star-fill.svg';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import StarIcon from '@/assets/icons/common/star-16px.svg';

export default function Page({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">상품을 찾을 수 없습니다.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <HeaderCustom showBack showHome showSearch showCart />
      <div className="py-15">
        <div className="aspect-[1/1] bg-gray-200" />

        <div className="">
          <div className="flex items-start justify-between border-b border-gray-200 px-4 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <span className="text-sm font-medium">브랜드</span>
                <NextIcon />
              </div>
              <p className="text-base font-semibold">생수 330ml X 40개</p>
              <div className="text-2xl font-bold">
                <span>1,1000</span>원
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <RatingStarIcon />
                  <span>4.0</span>
                </div>
                <span className="underline">리뷰 500</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <button>
                <LikeIcon />
              </button>
              <button>
                <ShareIcon />
              </button>
            </div>
          </div>
          <div className="flex justify-start gap-8 border-b border-gray-200 p-4 text-sm">
            <span>배송</span>
            <div>
              <p>당일출발 11:00 마감 | 평균 2일 이내 도착 확률 80%</p>
              <p>지금 결제 시 8.28(목) 발송 예정</p>
              <p>무료배송</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h2 className="mb-3 text-lg font-semibold">장기구독 사용자의 리뷰</h2>
          <ul className="flex gap-2 overflow-x-auto">
            <li className="w-64 flex-shrink-0 rounded-sm bg-gray-100 p-3">
              <div className="flex gap-3 rounded-sm bg-gray-100">
                <div className="aspect-square w-20 rounded-xs bg-gray-200" />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    <span>슈블리맘</span>
                    <span>20회차</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                    </div>
                    <span className="text-xs text-gray-500">일주일 전</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                    고소하고 짭짤하고 달달해서 우리아이 간식으로 딱이에요
                  </p>
                </div>
              </div>
            </li>
            <li className="w-64 flex-shrink-0 rounded-sm bg-gray-100 p-3">
              <div className="flex gap-3 rounded-sm bg-gray-100">
                <div className="aspect-square w-20 rounded-xs bg-gray-200" />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    <span>슈블리맘</span>
                    <span>20회차</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                    </div>
                    <span className="text-xs text-gray-500">일주일 전</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                    고소하고 짭짤하고 달달해서 우리아이 간식으로 딱이에요
                  </p>
                </div>
              </div>
            </li>

            <li className="w-64 flex-shrink-0 rounded-sm bg-gray-100 p-3">
              <div className="flex gap-3 rounded-sm bg-gray-100">
                <div className="aspect-square w-20 rounded-xs bg-gray-200" />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    <span>슈블리맘</span>
                    <span>20회차</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                    </div>
                    <span className="text-xs text-gray-500">일주일 전</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                    고소하고 짭짤하고 달달해서 우리아이 간식으로 딱이에요
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
