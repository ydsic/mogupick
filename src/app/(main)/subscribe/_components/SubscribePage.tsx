'use client';

import { useState } from 'react';
import Tabs from './Tabs';
import CategoryFilter from './CategoryFilter';
import SubscribeList from './SubscribeList';
import SubscribeCalendar from './SubscribeCalendar';
import HeaderCustom from '@/components/HeaderCustom';
import StatusFilter from './StatusFilter';

export default function SubscribePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'ongoing' | 'paused' | 'canceled'>('ongoing');

  return (
    <div>
      <HeaderCustom title="구독" showSearch showCart />
      <div className="py-14">
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'list' && <StatusFilter value={statusFilter} onChange={setStatusFilter} />}
        <CategoryFilter />

        <div>{activeTab === 'list' ? <SubscribeList /> : <SubscribeCalendar />}</div>
      </div>
    </div>
  );
}
