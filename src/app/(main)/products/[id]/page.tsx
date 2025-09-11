import { use } from 'react';
import { products } from '../../(home)/_components/HomePage';
import ProductDetail from './_components/ProductDetail';

export interface Review {
  id: number;
  user: string;
  period: string; // 예: "20회차"
  rating: number;
  content: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    user: '슈블리맘',
    period: '20회차',
    rating: 5,
    content: '고소하고 짭짤하고 달달해서 우리아이 간식으로 딱이에요',
    date: '1주일 전',
  },
  {
    id: 2,
    user: '행복맘',
    period: '15회차',
    rating: 4,
    content: '너무 맛있어서 늘 재구매하고 있어요. 배송도 빠르고 만족합니다.',
    date: '2주일 전',
  },
  {
    id: 3,
    user: '슈블리맘',
    period: '20회차',
    rating: 5,
    content: '고소하고 짭짤하고 달달해서 우리아이 간식으로 딱이에요',
    date: '1주일 전',
  },
  {
    id: 4,
    user: '행복맘',
    period: '15회차',
    rating: 4,
    content: '너무 맛있어서 늘 재구매하고 있어요. 배송도 빠르고 만족합니다.',
    date: '2주일 전',
  },
];
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">상품을 찾을 수 없습니다.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <ProductDetail reviews={reviews} product={product} />
    </div>
  );
}
