import { products } from '../../(home)/_components/HomePage';
import { ProductCardList } from '@/components/card/Product';

export default function New() {
  return (
    <div className="p-4">
      <div>
        총 <span>100</span>개
      </div>
      <ProductCardList
        path={`/pick`}
        products={products}
        cols={2}
        query={{ from: 'pick' }}
        showCartButton
        showHeart
      />
    </div>
  );
}
