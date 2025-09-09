'use client';

export interface StatusFilterProps {
  value: 'ongoing' | 'canceled';
  onChange: (value: 'ongoing' | 'canceled') => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex items-center rounded-full bg-white p-1 text-gray-400">
      <button
        onClick={() => onChange('ongoing')}
        className={
          value === 'ongoing'
            ? 'rounded-full bg-black px-2.5 py-1 text-sm text-white'
            : 'px-2.5 py-1 text-sm'
        }
      >
        진행중
      </button>
      <button
        onClick={() => onChange('canceled')}
        className={
          value === 'canceled'
            ? 'rounded-full bg-black px-2.5 py-1 text-sm text-white'
            : 'px-2.5 py-1 text-sm'
        }
      >
        해지
      </button>
    </div>
  );
}
