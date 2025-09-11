'use client';

import Calendar from '@/components/calendar/Calendar';
import CustomCycle from '@/components/cycle/CustomCycle';
import QuickCycle from '@/components/cycle/QuickCycle';

export default function Step2({
  startDate,
  setStartDate,
  onComplete,
}: {
  startDate: Date | null;
  setStartDate: (date: Date) => void;
  onComplete: () => void;
}) {
  return (
    <div className="pt-10">
      <div className="bg-gray-100 px-3 py-4">
        <QuickCycle />
        <CustomCycle />
      </div>

      <div className="mt-4 bg-white">
        <h2 className="mb-2 text-xl font-bold">첫 배송 희망일을 선택해주세요</h2>
        <div className="bg-gray-100 px-2 pt-4">
          <Calendar
            mode="select"
            selectedDate={startDate ?? new Date()}
            onDateSelect={(date) => setStartDate(date)}
            isDateDisabled={(day) => day < new Date()} // 오늘 이전은 선택 불가
            dayClassName={(day, selected) => {
              const isSelected = day.getTime() === selected.getTime();
              const today = new Date();
              const isToday =
                day.getFullYear() === today.getFullYear() &&
                day.getMonth() === today.getMonth() &&
                day.getDate() === today.getDate();

              if (isSelected) {
                return 'bg-lime-600 text-white rounded-full w-8 h-8 flex items-center justify-center';
              }

              if (isToday) {
                return 'bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-black';
              }

              return 'text-gray-700';
            }}
          />
        </div>

        {startDate && (
          <div className="rounded-br-sm rounded-bl-sm bg-lime-50 py-3 text-center font-bold text-gray-700">
            <span className="text-lime-600">{startDate.getDate()}일</span>에 첫 배송 예정입니다.
          </div>
        )}
      </div>

      <div className="bg-white pt-4">
        <button onClick={onComplete} className="w-full bg-black py-3 text-white">
          완료
        </button>
      </div>
    </div>
  );
}
