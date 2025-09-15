'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Category } from '@/types/category';

interface ChipsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  text: string;
}

function Chips({ className, text, selected = false, ...props }: ChipsProps) {
  return (
    <span
      type="button"
      className={cn(
        'cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors',
        selected
          ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--background)]'
          : 'border-[var(--grey-300)] bg-transparent text-[#434343]',
        className,
      )}
      {...props}
    >
      {text}
    </span>
  );
}

interface ChipsListProps {
  className?: string;
  categories: Category[];
  showAll?: boolean;
  onCategoryChange?: (category: Category | null) => void;
}

function ChipsList({ className, categories, showAll, onCategoryChange }: ChipsListProps) {
  const mergedCategories = showAll
    ? [{ id: 0, text: '전체', slug: 'all' }, ...categories]
    : categories;
  const [selectedId, setSelectedId] = useState(mergedCategories[0]?.id);

  const handleCategoryClick = (category: Category) => {
    setSelectedId(category.id);
    // 전체 선택시 null 전달, 특정 카테고리 선택시 해당 카테고리 전달
    onCategoryChange?.(category.id === 0 ? null : category);
  };

  return (
    <div
      className={cn('flex w-full justify-start gap-2 overflow-x-auto whitespace-nowrap', className)}
    >
      {mergedCategories.map((c) => (
        <Chips
          key={c.id}
          text={c.text}
          selected={selectedId === c.id}
          onClick={() => handleCategoryClick(c)}
        />
      ))}
    </div>
  );
}

export { Chips, ChipsList };
