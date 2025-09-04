'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}
const categories = [
  { key: 'all', name: '전체', color: 'bg-gray-100 hover:bg-gray-200' },
  { key: 'fresh', name: '신선식품', color: 'bg-green-100 hover:bg-green-200' },
  { key: 'dairy', name: '유제품·음료', color: 'bg-blue-100 hover:bg-blue-200' },
  { key: 'snack', name: '간편식', color: 'bg-yellow-100 hover:bg-yellow-200' },
  { key: 'health', name: '건강식품', color: 'bg-purple-100 hover:bg-purple-200' },
  { key: 'pet', name: '반려동물', color: 'bg-red-100 hover:bg-red-200' },
];

export default function CategoryFilter({ selectedCategory, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get('category');

  const handleClick = (c: string) => {
    const params = new URLSearchParams(searchParams);
    if (c === selected) {
      params.delete('category');
    } else {
      params.set('category', c);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="sticky top-14 z-10 flex gap-2 overflow-x-auto bg-white p-2">
      {categories.map((c) => {
        const isSelected = selected === c.name;
        return (
          <button
            key={c.name}
            onClick={() => handleClick(c.name)}
            className={`rounded-xs px-3 py-1 text-sm font-medium whitespace-nowrap ${c.color} ${
              isSelected ? 'scale-105 font-semibold opacity-80 shadow-md' : 'opacity-50'
            } transition-all duration-200 active:scale-95 active:shadow-inner`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
