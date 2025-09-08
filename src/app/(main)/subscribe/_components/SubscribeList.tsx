import StatusFilter, { StatusFilterProps } from './StatusFilter';
import SubscribeListItem from './SubscribeListItem';

export default function SubscribeList({ value, onChange }: StatusFilterProps) {
  return (
    <div className="bg-gray-100 p-4">
      <div className="mb-1 flex items-end justify-between text-gray-500">
        <div className="mb-2 text-sm font-medium">
          총 <span>6</span>개
        </div>
        <StatusFilter value={value} onChange={onChange} />
      </div>
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SubscribeListItem key={i} />
        ))}
      </ul>
    </div>
  );
}
