'use client';

import StatusFilter, { StatusFilterProps } from './StatusFilter';
import SubscribeListItem from './SubscribeListItem';
import React from 'react';
import {
  getSubscriptionsByStatus,
  type SubscriptionItem,
  type SubscriptionStatus,
} from '@/api/subscription';

export default function SubscribeList({ value, onChange }: StatusFilterProps) {
  const [items, setItems] = React.useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const map = { ongoing: 'ONGOING', canceled: 'ENDED' } as const;
    const status = map[value] as SubscriptionStatus;
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getSubscriptionsByStatus(status);
        if (!alive) return;
        setItems(list ?? []);
      } catch (e: any) {
        console.error('[SUBSCRIPTIONS][list][error]', e);
        if (!alive) return;
        setError(e?.message || '구독 목록을 불러오지 못했습니다.');
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [value]);

  const total = items.length;

  return (
    <div className="bg-[#f8f8f8] p-4">
      <div className="mb-1 flex items-center justify-between text-gray-500">
        <div className="mb-2 text-sm font-medium text-[#6f6f6f]">
          총 <span>{loading ? '-' : total}</span>개
        </div>
        <StatusFilter value={value} onChange={onChange} />
      </div>
      {error && <div className="mb-3 rounded bg-red-50 p-2 text-xs text-red-600">{error}</div>}
      <ul className="flex flex-col gap-3">
        {loading ? (
          <li className="rounded-sm bg-white p-4 text-sm text-[#6f6f6f]">불러오는 중...</li>
        ) : total === 0 ? (
          <li className="rounded-sm bg-white p-4 text-sm text-[#6f6f6f]">구독 내역이 없습니다.</li>
        ) : (
          items.map((it) => <SubscribeListItem key={it.subscriptionId} item={it} />)
        )}
      </ul>
    </div>
  );
}
