import { products } from '../../(home)/_components/HomePage';

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">상품을 찾을 수 없습니다.</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>스토어: {product.store}</p>
      <p>가격: {product.price.toLocaleString()}원</p>
      <p>
        평점: {product.rating} / 리뷰 {product.reviewCount}개
      </p>
    </div>
  );
}
