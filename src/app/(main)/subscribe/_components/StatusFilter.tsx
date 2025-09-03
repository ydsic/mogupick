'use client';

interface StatusFilterProps {
  value: 'ongoing' | 'paused' | 'canceled';
  onChange: (value: 'ongoing' | 'paused' | 'canceled') => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex justify-evenly gap-10 border-b border-gray-200 py-3 text-gray-400">
      <button
        onClick={() => onChange('ongoing')}
        className={value === 'ongoing' ? 'font-semibold text-black' : ''}
      >
        진행중
      </button>
      <button
        onClick={() => onChange('paused')}
        className={value === 'paused' ? 'font-semibold text-black' : ''}
      >
        일시정지
      </button>
      <button
        onClick={() => onChange('canceled')}
        className={value === 'canceled' ? 'font-semibold text-black' : ''}
      >
        해지
      </button>
    </div>
  );
}
