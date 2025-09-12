'use client';

import { useState, useEffect } from 'react';
import HeaderCustom from '@/components/HeaderCustom';
import EmptyIcon from '@/assets/icons/common/empty-80px.svg';
import { getNotifications } from '@/api/notification';
import type { Notification as ApiNotification } from '@/api/notification';

export default function AlertPage() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await getNotifications();
        console.log('[GET /api/v1/notifications] 응답:', res);
        const list = Array.isArray(res) ? res : (res as any)?.data;
        setNotifications(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('[GET /api/v1/notifications] 실패:', e);
        setNotifications([]);
      }
    })();
  }, []);

  const handleMarkAllAsRead = () => {
    console.log('모든 알림을 읽음 처리');
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderCustom title="알림" showBack showSetting />

      <div className="px-4 pt-17">
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="text-xs leading-none font-normal text-black">
              전체 {notifications.length}건
            </span>
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs leading-none font-normal text-black"
            >
              모두읽음
            </button>
          </div>

          {/* 알림 목록 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {notifications.map((n, index) => (
                <div key={n.id} className="flex flex-col gap-1.5">
                  <div className="text-sm font-medium text-black">{n.title}</div>
                  <div className="text-xs leading-none font-normal text-[#6f6f6f]">{n.content}</div>
                  <div className="text-right text-xs leading-none font-normal text-[#6f6f6f]">
                    {n.createdAt}
                  </div>

                  {/* 구분선 (마지막 아이템 제외) */}
                  {index < notifications.length - 1 && <div className="mt-4 h-px bg-gray-200" />}
                </div>
              ))}

              {/* 알림이 없을 때 */}
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-6 py-20">
                  <EmptyIcon />
                  <span className="text-lg font-semibold text-[#434343]">
                    아직 도착한 알림이 없습니다.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
