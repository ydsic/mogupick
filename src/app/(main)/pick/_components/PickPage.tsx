'use client';

import HeaderCustom from '@/components/HeaderCustom';
import Tabs from '../../../../components/Tabs';
import { useState } from 'react';
import Pick from './Pick';
import New from './New';

export default function PickPage() {
  const [activeTab, setActiveTab] = useState<'pick' | 'new'>('pick');

  return (
    <div>
      <HeaderCustom title="찜" showSearch showCart />
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'pick', label: '찜 상품' },
          { key: 'new', label: '최근 본' },
        ]}
      />
      {activeTab === 'pick' ? <Pick /> : <New />}
    </div>
  );
}
