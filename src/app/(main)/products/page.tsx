import HeaderCustom from '@/components/HeaderCustom';
import { ProductCardList } from '@/components/card/Product';
import { products } from '../(home)/_components/HomePage';
import { sectionTitles } from '@/constants/sectionTitles';

interface Props {
  searchParams: { section?: string };
}

export default function Page({ searchParams }: Props) {
  const section = (searchParams.section as keyof typeof sectionTitles) || 'recent';
  const title = sectionTitles[section];

  return (
    <div>
      <HeaderCustom title={title} showClose />
      <div className="my-14 px-4">
        <div className="mb-3 pt-2 text-sm">
          총<span>{products.length}</span>개
        </div>
        <div>
          <ProductCardList products={products} path="products" showHeart showCartButton />
        </div>
      </div>
    </div>
  );
}
