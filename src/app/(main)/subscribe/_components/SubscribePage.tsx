'use client';

import { useMemo, useState } from 'react';
import Tabs from '../../../../components/Tabs';
import CategoryFilter from './CategoryFilter';
import SubscribeList from './SubscribeList';
import SubscribeCalendar from './SubscribeCalendar';
import HeaderCustom from '@/components/HeaderCustom';
import StatusFilter from './StatusFilter';

// 샘플 구독 데이터
const events = [
  {
    id: 1,
    date: new Date(2025, 9, 1),
    title: '샐러드',
    category: 'fresh',
    price: 10000,
    color: 'bg-green-50',
  },
  {
    id: 2,
    date: new Date(2025, 9, 2),
    title: '신선기름',
    category: 'dairy',
    price: 10000,
    color: 'bg-blue-50',
  },
  {
    id: 3,
    date: new Date(2025, 9, 4),
    title: '오메가3',
    category: 'health',
    price: 10000,
    color: 'bg-yellow-50',
  },
  {
    id: 4,
    date: new Date(2025, 9, 6),
    title: '도시락',
    category: 'snack',
    price: 10000,
    color: 'bg-pink-50',
  },
  {
    id: 5,
    date: new Date(2025, 9, 15),
    title: '샐러드',
    category: 'fresh',
    price: 10000,
    color: 'bg-green-50',
  },
  {
    id: 6,
    date: new Date(2025, 9, 20),
    title: '도시락',
    category: 'snack',
    price: 10000,
    color: 'bg-pink-50',
  },
  {
    id: 7,
    date: new Date(2025, 9, 30),
    title: '견사료',
    category: 'pet',
    price: 10000,
    color: 'bg-red-50',
  },
];

export default function SubscribePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'ongoing' | 'canceled'>('ongoing');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  // 카테고리 필터링
  const filteredEvents = useMemo(() => {
    if (!selectedCategory) return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <HeaderCustom title="구독" showSearch showCart />
      <div className="py-14">
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { key: 'list', label: '구독리스트' },
            { key: 'calendar', label: '구독캘린더' },
          ]}
        />

        <div>
          {activeTab === 'list' ? (
            <SubscribeList value={statusFilter} onChange={setStatusFilter} />
          ) : (
            <SubscribeCalendar
              selectedCategory={selectedCategory}
              selectedDay={selectedDay}
              onDaySelect={setSelectedDay}
              events={filteredEvents}
            />
          )}
        </div>
      </div>
    </div>
  );
}
