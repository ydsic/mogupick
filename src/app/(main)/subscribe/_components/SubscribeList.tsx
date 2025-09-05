import SubscribeListItem from './SubscribeListItem';

export default function SubscribeList() {
  return (
    <div className="min-h-[73dvh] bg-gray-100 p-4">
      <div className="text-gray-500">
        <div className="mb-4 flex items-center justify-between text-sm font-medium">
          <div>
            총 <span>6</span>개
          </div>
          <div className="flex gap-4">
            <div className="rounded-full bg-black px-2.5 py-1 text-white">진행중</div>
            <div className="rounded-full bg-white px-2.5 py-1">해지</div>
          </div>
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
