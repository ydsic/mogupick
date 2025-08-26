import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChipsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

function Chips({ className, children, selected = false, ...props }: ChipsProps) {
  return (
    <span
      type="button"
      className={cn(
        'cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors',
        selected
          ? 'border-black bg-black text-white'
          : 'border-gray-700 bg-transparent text-gray-700',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface ChipsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function ChipsList({ className, children, ...props }: ChipsListProps) {
  return (
    <div
      className={cn('flex w-full justify-start gap-1 overflow-x-auto whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Chips, ChipsList };

/** 사용법 */
// const categories = [
//   '신선식품',
//   '정육·수산물',
//   '유제품·음료',
//   '간편식',
//   '간식',
//   '건강식품',
//   '생활잡화',
//   '위생용품',
//   '반려동물',
//   '육아용품',
// ];
// const [selected, setSelected] = useState<string | null>(null);
// <ChipsList>
//   {categories.map((cat) => (
//     <Chips key={cat} selected={selected === cat} onClick={() => setSelected(cat)}>
//       {cat}
//     </Chips>
//   ))}
// </ChipsList>;
