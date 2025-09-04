import SubscribeListItem from './SubscribeListItem';

export default function SubscribeList() {
  return (
    <div className="min-h-[73dvh] bg-gray-100 p-4">
      <div className="text-gray-500">
        <div className="mb-2 text-sm font-medium">
          총 <span>6</span>개
        </div>
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SubscribeListItem key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
