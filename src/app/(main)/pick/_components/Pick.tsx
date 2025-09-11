import { ChipsList } from '@/components/ui/Chips';
import { categories } from '@/constants/categories';
import { products } from '../../(home)/_components/HomePage';
import { ProductCardList } from '@/components/card/Product';

export default function Pick() {
  return (
    <div className="p-4">
      <ChipsList categories={categories} showAll />

      <div className="pb-20">
        <div className="mt-1 mb-3 pl-4 text-sm text-[#6f6f6f]">
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
    </div>
  );
}
