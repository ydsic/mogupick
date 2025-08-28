import SearchBar from '@/components/SearchBar';

import Header from './_components/Header';
import { ReviewCardList } from '@/components/card/Review';
import Title from '@/components/ui/Title';
import { ChipsList } from '@/components/ui/Chips';
import { ProductCardList } from '@/components/card/Product';
import { categories } from '@/constants/categories';

const dummyReviews = [
  {
    id: 1,
    username: 'Alice',
    review: '정말 마음에 들어요! 배송도 빨랐습니다.',
    store: '쿠팡',
    title: '무선 이어폰',
    rating: 4.8,
    reviewCount: 500,
  },
  {
    id: 2,
    username: 'Bob',
    review: '품질이 생각보다 좋습니다.',
    store: '11번가',
    title: '노트북 거치대',
    rating: 4.5,
    reviewCount: 230,
  },
  {
    id: 3,
    username: 'Alice',
    review: '정말 마음에 들어요! 배송도 빨랐습니다.',
    store: '쿠팡',
    title: '무선 이어폰',
    rating: 4.8,
    reviewCount: 500,
  },
  {
    id: 4,
    username: 'Bob',
    review: '품질이 생각보다 좋습니다.',
    store: '11번가',
    title: '노트북 거치대',
    rating: 4.5,
    reviewCount: 230,
  },
];

export const products = [
  { id: 1, store: '쿠팡', title: '무선 이어폰', price: 59000, rating: 4.5, reviewCount: 120 },
  { id: 2, store: 'G마켓', title: '블루투스 스피커', price: 32000, rating: 4.2, reviewCount: 85 },
  { id: 3, store: '11번가', title: '스마트워치', price: 129000, rating: 4.7, reviewCount: 210 },
  { id: 4, store: '옥션', title: '노트북 쿨링패드', price: 18000, rating: 4.1, reviewCount: 40 },
  { id: 5, store: '쿠팡', title: '게이밍 마우스', price: 45000, rating: 4.6, reviewCount: 95 },
  {
    id: 6,
    store: 'G마켓',
    title: '휴대용 보조배터리',
    price: 25000,
    rating: 4.3,
    reviewCount: 60,
  },
  { id: 7, store: '11번가', title: '무선 키보드', price: 39000, rating: 4.4, reviewCount: 77 },
  { id: 8, store: '쿠팡', title: 'LED 스탠드', price: 22000, rating: 4.2, reviewCount: 34 },
  { id: 9, store: '옥션', title: '스마트폰 삼각대', price: 15000, rating: 4.0, reviewCount: 25 },
  { id: 10, store: 'G마켓', title: '헤드셋', price: 67000, rating: 4.5, reviewCount: 110 },
  { id: 11, store: '11번가', title: 'USB-C 허브', price: 28000, rating: 4.3, reviewCount: 48 },
  { id: 12, store: '쿠팡', title: '무선 충전기', price: 33000, rating: 4.4, reviewCount: 72 },
];

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="min-h-0 flex-1 space-y-10">
        <SearchBar />

        <div>
          <Title text="최근 본 상품과 유사한 상품" adver={true} />
          <ProductCardList products={products} limit={4} />
        </div>

        <div>
          <Title text="꾸준히 사랑받는 상품" />

          <ChipsList categories={categories} />
          <ProductCardList products={products} cols={3} size="s" />
        </div>
        <div>
          <Title text="내 또래의 베스트 리뷰 PICK" />
          <ReviewCardList layout="horizontal" reviews={dummyReviews} />
        </div>

        <div>
          <Title text="지금 주목받는 상품" />
        </div>
      </div>
    </div>
  );
}
