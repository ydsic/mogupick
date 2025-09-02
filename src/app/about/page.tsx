import QuoteIcon from '@/assets/icons/common/bi_quote-32px.svg';
import CategoryIcon from '@/assets/icons/common/category-24px.svg';
import CloseIcon from '@/assets/icons/common/close-16px.svg';
import DownIcon from '@/assets/icons/common/down-16px.svg';
import FillterIcon from '@/assets/icons/common/fillter-16px.svg';
import HandIcon from '@/assets/icons/common/hand-24px.svg';
import HeartIcon from '@/assets/icons/common/heart-24px.svg';
import HomeIcon from '@/assets/icons/common/home-24px.svg';
import InfoIcon from '@/assets/icons/common/info-14px.svg';
import LikeIcon from '@/assets/icons/common/like-24px.svg';
import NextIcon from '@/assets/icons/common/next-24px.svg';
import NotificationIcon from '@/assets/icons/common/notification-32px.svg';
import RatingStarIcon from '@/assets/icons/common/rating-star-14px.svg';
import ReviewIcon from '@/assets/icons/common/review-14px.svg';
import UserIcon from '@/assets/icons/common/user-24px.svg';
import RankDownIcon from '@/assets/icons/rank/rank-down-12px.svg';
import RankStableIcon from '@/assets/icons/rank/rank-stable-12px.svg';
import RankUpIcon from '@/assets/icons/rank/rank-up-12px.svg';
import { ChipsList } from '@/components/ui/Chips';
import { ProductCardList } from '@/components/card/Product';
import { categories } from '@/constants/categories';
import { ReviewCardList } from '@/components/card/Review';
import { dummyReviews, products } from '../(main)/(home)/_components/HomePage';
import Title from '@/components/ui/Title';

export default function About() {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">테스트용 페이지</h1>

      <div className="flex min-h-dvh items-center justify-center bg-gray-100">
        <div className="relative w-full overflow-hidden bg-white px-4 md:w-[500px]">
          <div>
            <ProductCardList path={`products`} products={products} showHeart={true} limit={4} />
          </div>
          <div>
            <Title text="내 또래의 베스트 리뷰 PICK" />
            <ReviewCardList layout="horizontal" reviews={dummyReviews} />
          </div>

          <div>
            <Title text="지금 주목받는 상품" />
            <ChipsList categories={categories} />
          </div>
          <br />
          <br />
          <div>
            <div>
              <h2>ProductCard Test</h2>
              <ProductCardList
                path={`/products`}
                products={products}
                layout="grid"
                cols={3}
                size="s"
              />
              <br />
              <ProductCardList path={`/products`} products={products} layout="horizontal" />
              <br />
              <ProductCardList
                path={`/products`}
                products={products}
                layout="grid"
                cols={2}
                size="l"
              />
            </div>

            <br />

            <ReviewCardList layout="horizontal" reviews={dummyReviews} />
          </div>

          <br />
          <br />
        </div>
      </div>

      <div className="min-h-screen p-8">
        <div className="m-10 space-y-8 bg-gray-700 p-5">
          <section>
            <div className="flex flex-col items-center gap-10 space-x-4">
              <div className="flex flex-col items-center">
                <p className="mb-2">12px 아이콘들</p>
                <RankUpIcon width="20px" height="24px" className="h-6 w-6" />
                <RankDownIcon className="h-6 w-6" />
                <RankStableIcon className="h-6 w-6" />
              </div>

              <div className="flex flex-col items-center">
                <p className="mb-2">14px 아이콘들</p>
                <InfoIcon className="h-6 w-6" />
                <RatingStarIcon className="h-6 w-6" />
                <ReviewIcon className="h-6 w-6" />
              </div>

              <div className="flex flex-col items-center">
                <p className="mb-2">16px 아이콘들</p>
                <CloseIcon className="h-6 w-6 fill-black" />
                <FillterIcon className="h-6 w-6 fill-black" />
                <DownIcon className="h-6 w-6 fill-black" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="mb-2">24px 아이콘들</p>
                <CategoryIcon className="h-8 w-8 fill-blue-500" />
                {/* <HandIcon className="h-8 w-8 fill-green-500" /> */}
                <HeartIcon className="h-8 w-8 fill-red-500" />
                <HomeIcon className="h-8 w-8 fill-orange-500" />
                <LikeIcon className="h-8 w-8 fill-pink-500" />
                <NextIcon className="h-8 w-8 fill-teal-500" />
                <UserIcon className="h-8 w-8 fill-cyan-500" />
              </div>

              <div className="flex flex-col items-center">
                <p className="mb-2">32px 아이콘들</p>
                <QuoteIcon className="h-12 w-12" />
                <NotificationIcon className="h-12 w-12" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
