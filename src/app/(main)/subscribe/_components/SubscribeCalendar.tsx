'use client';

import Calendar from './Calendar';

export interface Event {
  id: number;
  date: Date;
  title: string;
  category: string;
  price: number;
  color: string;
}

export interface SubscribeCalendarProps {
  selectedCategory: string | null;
  selectedDay: Date | undefined;
  onDaySelect: (date: Date | undefined) => void;
  events: Event[];
}

export default function SubscribeCalendar({
  selectedCategory,
  selectedDay,
  onDaySelect,
  events,
}: SubscribeCalendarProps) {
  // 선택된 날짜와 카테고리에 해당하는 이벤트 가져오기
  const eventsForDay = (day: Date) =>
    events.filter(
      (e) =>
        (!selectedCategory || e.category === selectedCategory) &&
        e.date.getFullYear() === day.getFullYear() &&
        e.date.getMonth() === day.getMonth() &&
        e.date.getDate() === day.getDate(),
    );

  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : [];
  const today = new Date();

  return (
    <div className="min-h-dvh bg-gray-100 p-4 shadow-md">
      <div className="flex w-full flex-col items-center rounded-sm bg-white p-4">
        <div className="w-full">
          <Calendar
            selectedCategory={selectedCategory}
            selectedDay={selectedDay}
            onDaySelect={onDaySelect}
            events={events}
          />
        </div>
        <div className="flex w-full justify-between border-t border-gray-200 px-4 pt-4">
          <p className="text-sm font-medium">이번달 결제 예정 금액</p>
          <div className="font-semibold">
            <span>60,000</span>원
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm font-medium text-gray-500">
          <div>
            총 <span>6</span>개
          </div>
          <div>편집</div>
        </div>
        <div>
          {selectedEvents.length === 0 ? (
            <p className="pt-4 text-sm text-gray-400">선택한 날짜에 구독 내역이 없습니다.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedEvents.map((item, idx) => (
                <>
                  <li key={idx} className="flex items-center gap-4 rounded-sm bg-white px-4 py-2">
                    <p className="text-xs text-gray-500">
                      8월 1일
                      {item.date.toLocaleDateString()}
                    </p>
                    <div className={`h-8 w-1 rounded-xs bg-[#86c53a]`} />
                    <div>
                      <p className="mb-0.5 text-sm font-medium">
                        구독 타이틀 영역
                        {item.title}
                      </p>
                      <p className="text-base font-semibold">
                        10,000
                        {item.price.toLocaleString()}원
                      </p>
                    </div>
                  </li>

                  <li key={idx} className="flex items-center gap-4 rounded-sm bg-white px-4 py-2">
                    <p className="text-xs text-gray-500">
                      8월 1일
                      {item.date.toLocaleDateString()}
                    </p>
                    <div className={`h-8 w-1 rounded-xs bg-[#42A5F6]`} />
                    <div>
                      <p className="mb-0.5 text-sm font-medium">
                        구독 타이틀 영역
                        {item.title}
                      </p>
                      <p className="text-base font-semibold">
                        10,000
                        {item.price.toLocaleString()}원
                      </p>
                    </div>
                  </li>

                  <li key={idx} className="flex items-center gap-4 rounded-sm bg-white px-4 py-2">
                    <p className="text-xs text-gray-500">
                      8월 1일
                      {item.date.toLocaleDateString()}
                    </p>
                    <div className={`h-8 w-1 rounded-xs bg-[#FFA827]`} />
                    <div>
                      <p className="mb-0.5 text-sm font-medium">
                        구독 타이틀 영역
                        {item.title}
                      </p>
                      <p className="text-base font-semibold">
                        10,000
                        {item.price.toLocaleString()}원
                      </p>
                    </div>
                  </li>
                </>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
