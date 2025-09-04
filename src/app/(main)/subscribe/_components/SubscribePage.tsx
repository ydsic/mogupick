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
  { date: new Date(2025, 7, 1), title: '샐러드', category: 'fresh', price: 10000 },
  { date: new Date(2025, 7, 1), title: '신선기름', category: 'dairy', price: 10000 },
  { date: new Date(2025, 7, 4), title: '오메가3', category: 'health', price: 10000 },
  { date: new Date(2025, 7, 6), title: '도시락', category: 'snack', price: 10000 },
  { date: new Date(2025, 7, 15), title: '샐러드', category: 'fresh', price: 10000 },
  { date: new Date(2025, 7, 20), title: '도시락', category: 'snack', price: 10000 },
  { date: new Date(2025, 7, 30), title: '견사료', category: 'pet', price: 10000 },
];

export default function SubscribePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'ongoing' | 'paused' | 'canceled'>('ongoing');

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
        {activeTab === 'list' && <StatusFilter value={statusFilter} onChange={setStatusFilter} />}
        <CategoryFilter selectedCategory={selectedCategory} onSelect={setSelectedCategory} />

        <div>
          {activeTab === 'list' ? (
            <SubscribeList />
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
