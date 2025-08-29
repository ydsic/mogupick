import { categories } from '@/constants/categories';
import Link from 'next/link';

export default function CategoriesPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Categories Page</h1>
      <p>카테고리 목록 페이지</p>
      <div className="mt-6 grid w-full grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="rounded bg-black px-4 py-2 text-center text-base font-semibold text-white shadow hover:bg-yellow-500"
          >
            {cat.text} 가기
          </Link>
        ))}
      </div>
    </div>
  );
}
