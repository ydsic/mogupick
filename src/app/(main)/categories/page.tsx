import HeaderCustom from '@/components/HeaderCustom';
import { categories } from '@/constants/categories';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <HeaderCustom title="카테고리" showSearch showCart />
      <div className="grid w-full grid-cols-2 gap-2 px-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="font-base flex flex-col items-center gap-4 rounded bg-gray-100 p-8 pb-4 text-base text-black"
          >
            <Image src={cat.image} alt={cat.text} width={111} height={111} />

            <span>{cat.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
