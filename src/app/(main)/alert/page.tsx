'use client';

import { useState } from 'react';
import HeaderCustom from '@/components/HeaderCustom';

interface Alert {
  id: number;
  title: string;
  message: string;
  time: string;
  category: string;
}

const alertCategories = [
  { id: 'all', name: '전체' },
  { id: 'discount', name: '할인' },
  { id: 'event', name: '이벤트' },
  { id: 'payment', name: '결제/배송' },
  { id: 'interest', name: '관심' },
];

const alertData: Alert[] = [
  {
    id: 1,
    title: '[결제예정] 1회차 스파클 생수 500ml * 24',
    message: '이틀 후 09/05에 11,000원 결제가 진행될 예정입니다.',
    time: '방금 전',
    category: 'payment',
  },
  {
    id: 2,
    title: '[신청완료] 1회차 스파클 생수 500ml * 24',
    message: '상품의 정기구독 신청을 완료했습니다.',
    time: '1시간 전',
    category: 'payment',
  },
  {
    id: 3,
    title: '[배송예정] 1회차 스파클 생수 500ml * 24',
    message: '이틀 후 9/10에 상품이 배송될 예정입니다.',
    time: '2시간 전',
    category: 'payment',
  },
];

export default function AlertPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAlerts =
    selectedCategory === 'all'
      ? alertData
      : alertData.filter((alert) => alert.category === selectedCategory);

  const handleMarkAllAsRead = () => {
    console.log('모든 알림을 읽음 처리');
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderCustom title="알림" showBack showSetting bgYellow />

      <div className="px-4 pt-17">
        <div className="flex flex-1 flex-col gap-8">
          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto">
            {alertCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex h-8 items-center justify-center gap-1 rounded-full border border-gray-200 px-3 py-2 ${
                  selectedCategory === category.id ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                <span className="text-xs leading-none font-normal">{category.name}</span>
              </button>
            ))}
          </div>

          {/* 알림 목록 */}
          <div className="flex flex-col gap-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <span className="text-xs leading-none font-normal text-black">
                전체 {filteredAlerts.length}건
              </span>
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs leading-none font-normal text-black"
              >
                모두읽음
              </button>
            </div>

            {/* 알림 아이템들 */}
            <div className="flex flex-col gap-4">
              {filteredAlerts.map((alert, index) => (
                <div key={alert.id}>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-sm leading-snug font-medium text-black">
                        {alert.title}
                      </div>
                      <div className="text-xs leading-none font-normal text-black">
                        {alert.message}
                      </div>
                    </div>
                    <div className="text-right text-xs leading-none font-normal text-black">
                      {alert.time}
                    </div>
                  </div>

                  {/* 구분선 (마지막 아이템 제외) */}
                  {index < filteredAlerts.length - 1 && (
                    <div className="mt-4 h-px bg-gray-200"></div>
                  )}
                </div>
              ))}

              {/* 알림이 없을 때 */}
              {filteredAlerts.length === 0 && (
                <div className="flex items-center justify-center py-20">
                  <span className="text-sm text-gray-500">해당 카테고리의 알림이 없습니다.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
