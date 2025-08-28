import SearchBar from '@/components/SearchBar';

import Header from './_components/Header';
import { ReviewCardList } from '@/components/card/Review';

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

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="min-h-0 flex-1 space-y-8">
        <SearchBar />
        내용 컨텐츠 children
        <ReviewCardList layout="horizontal" reviews={dummyReviews} />
      </div>
    </div>
  );
}
