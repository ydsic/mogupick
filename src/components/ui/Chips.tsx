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
          ? 'border-[var(--color-background)] bg-[var(--foreground)] text-[var(--color-surface)]'
          : 'border-[var(--color-text-secondary)] bg-transparent',
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
}

function ChipsList({ className, categories, showAll }: ChipsListProps) {
  const mergedCategories = showAll
    ? [{ id: 0, text: '전체', slug: 'all' }, ...categories]
    : categories;
  const [selectedId, setSelectedId] = useState(mergedCategories[0]?.id);
  return (
    <div
      className={cn('flex w-full justify-start gap-1 overflow-x-auto whitespace-nowrap', className)}
    >
      {mergedCategories.map((c) => (
        <Chips
          key={c.id}
          text={c.text}
          selected={selectedId === c.id}
          onClick={() => setSelectedId(c.id)}
        />
      ))}
    </div>
  );
}

export { Chips, ChipsList };
