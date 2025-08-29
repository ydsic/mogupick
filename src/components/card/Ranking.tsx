import { Product } from '@/types/product';

interface RankingProps {
  r: Product;
  limit?: number;
}

function Ranking({ r, limit }: RankingProps) {
  return (
    <div className="flex flex-row gap-1">
      <span className="h-6 w-6 rounded-xs bg-[var(--foreground)] text-center text-xs leading-6 font-semibold text-[var(--color-background)]">
        {limit}
      </span>
      <div className="aspect-[1/1] w-[100px] rounded-sm bg-gray-200"></div>
      <div className="flex flex-1/3 flex-col justify-between pl-1">
        <div className="flex flex-col pt-1">
          <span className="text-xs font-normal">{r.store}</span>
          <span className="text-sm font-medium">{r.title}</span>
        </div>
        <div className="pb-1">
          <span className="text-base font-semibold">{r.price.toLocaleString()}</span>
          <div className="text-xs font-normal">
            <span>{r.reviewCount.toLocaleString()}</span>명이 보고 있어요
          </div>
        </div>
      </div>
    </div>
  );
}

interface RankingListProps {
  ranking: Product[];
  limit?: number;
}

function RankingList({ ranking, limit }: RankingListProps) {
  const visibleRanking = limit ? ranking.slice(0, limit) : ranking;

  return (
    <div className="flex flex-col gap-4">
      {visibleRanking.map((r, idx) => (
        <Ranking key={r.id} r={r} limit={idx + 1} />
      ))}
    </div>
  );
}

export { Ranking, RankingList };
