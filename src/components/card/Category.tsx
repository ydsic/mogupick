import type { Category } from '@/types/category';
import Link from 'next/link';

interface CategoryProps {
  c: Category;
}

function Category({ c }: CategoryProps) {
  return (
    <Link href={`/categories/${c.slug}`} className="text-center">
      <div className="aspect-[1/1] w-full rounded-sm bg-gray-200" />
      <span className="text-xs">{c.text}</span>
    </Link>
  );
}

interface CategoryListProps {
  categories: Category[];
}

function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {categories.map((c) => (
        <Category key={c.id} c={c} />
      ))}
    </div>
  );
}

export { Category, CategoryList };
