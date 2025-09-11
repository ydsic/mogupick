'use client';

export interface StatusFilterProps {
  value: 'ongoing' | 'canceled';
  onChange: (value: 'ongoing' | 'canceled') => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex items-center rounded-full bg-white p-1 font-semibold text-black">
      <button
        onClick={() => onChange('ongoing')}
        className={
          value === 'ongoing'
            ? 'rounded-full bg-black px-2.5 py-1 text-[13px] text-white'
            : 'px-2.5 py-1 text-[13px]'
        }
      >
        진행중
      </button>
      <button
        onClick={() => onChange('canceled')}
        className={
          value === 'canceled'
            ? 'rounded-full bg-black px-2.5 py-1 text-[13px] text-white'
            : 'px-2.5 py-1 text-[13px]'
        }
      >
        해지
      </button>
    </div>
  );
}
