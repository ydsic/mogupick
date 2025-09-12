import { getProduct } from '@/api/product';
import ProductDetail from './_components/ProductDetail';
import { Product as UIProduct } from '@/types/product';

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

// Next 생성 타입에서는 params가 Promise로 정의될 수 있어 이를 수용하도록 변경
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  // 상세 데이터 조회
  let raw: any;
  try {
    raw = await getProduct(numId);
  } catch (e) {
    console.error('[product detail] fetch failed', e);
  }

  const data = raw?.data ?? raw ?? {};

  const gallery: string[] = Array.isArray(data.productImageUrls) ? data.productImageUrls : [];
  const detailImages: string[] = Array.isArray(data.productDescriptionImageUrls)
    ? data.productDescriptionImageUrls
    : [];

  const product: UIProduct = {
    id: data.productId ?? numId,
    store: data.brandName ?? '',
    title: data.productName ?? '상품',
    price: data.price ?? 0,
    rating: data.averageRating ?? 0,
    reviewCount: data.reviewCount ?? 0,
    imageUrl: gallery[0],
  };

  return (
    <div className="flex flex-col space-y-4">
      <ProductDetail
        reviews={reviews}
        product={product}
        gallery={gallery}
        detailImages={detailImages}
      />
    </div>
  );
}
