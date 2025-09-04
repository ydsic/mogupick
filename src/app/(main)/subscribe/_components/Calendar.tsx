'use client';

import useCalendar, { CalendarStage, DateLibs } from '@nwleedev/use-calendar';
import { format, getWeek } from 'date-fns';
import { useState } from 'react';
import { SubscribeCalendarProps } from './SubscribeCalendar';

import NextIcon from '@/assets/icons/common/next-30px.svg';
import PrevIcon from '@/assets/icons/common/prev-30px.svg';

export default function Calendar({
  selectedCategory,
  selectedDay,
  onDaySelect,
  events,
}: SubscribeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { days, date, months, stage, onMonthChange, onYearChange, onStageChange } = useCalendar({
    defaultValue: selectedDate,
  });
  const month = date.getMonth();
  const year = date.getFullYear();

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
      {stage === CalendarStage.DAYS && (
        <div className="flex h-10 w-full items-center justify-between gap-x-2">
          <button onClick={() => onMonthChange(month - 1)}>
            <PrevIcon />
          </button>
          <h2
            className="text-xl font-semibold"
            role="button"
            onClick={() => {
              onStageChange(CalendarStage.MONTHS);
            }}
          >
            {format(date, 'MM, yyyy')}
          </h2>
          <button onClick={() => onMonthChange(month + 1)}>
            <NextIcon />
          </button>
        </div>
      )}
      <div className="grid w-full grid-cols-7 text-center font-medium text-gray-500">
        {weekDays.map((day) => (
          <div key={day} className="flex h-10 items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      {stage === CalendarStage.DAYS && (
        <div className="grid w-full grid-cols-7 gap-x-2 gap-y-1">
          {days.map((day) => {
            const classNames = getClassNames(date, day, selectedDate);
            if (!classNames) {
              return <div key={day.getTime()} className="h-20" />;
            }

            // 해당 날짜 이벤트 필터링
            const dayEvents = events.filter(
              (event) =>
                event.date.getFullYear() === day.getFullYear() &&
                event.date.getMonth() === day.getMonth() &&
                event.date.getDate() === day.getDate() &&
                (selectedCategory ? event.category === selectedCategory : true),
            );

            return (
              <div className={`${classNames?.div} flex-col`}>
                <button key={day.getTime()} onClick={() => setSelectedDate(day)}>
                  <span className={classNames?.span}>{day.getDate()}</span>
                </button>
                <button className="mt-1 flex w-full flex-1 flex-col items-center gap-1">
                  {dayEvents.map((event) => (
                    <span
                      key={event.id}
                      className={`rounded text-xs ${event.color} w-full truncate`}
                    >
                      {event.title}
                    </span>
                  ))}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {stage === CalendarStage.MONTHS && (
        <div className="flex h-10 w-full items-center justify-center gap-x-2">
          <button onClick={() => onYearChange(year - 1)}>
            <PrevIcon />
          </button>
          <h2 className="text-xl font-semibold">{format(date, 'yyyy')}</h2>
          <button onClick={() => onYearChange(year + 1)}>
            <NextIcon />
          </button>
        </div>
      )}
      {stage === CalendarStage.MONTHS && (
        <div className="grid w-full max-w-[320px] grid-cols-3 gap-x-2 gap-y-1">
          {months.map((month) => {
            return (
              <button
                key={month.getTime()}
                className="h-10"
                onClick={() => {
                  onMonthChange(month.getMonth());
                  onStageChange(CalendarStage.DAYS);
                }}
              >
                <span>{format(month, 'MM')}월</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const getClassNames = (date: Date, day: Date, selectedDate: Date) => {
  if (!DateLibs.isMonthEqual(date, day)) {
    return;
  }
  if (
    DateLibs.isYearEqual(day, selectedDate) &&
    DateLibs.isMonthEqual(day, selectedDate) &&
    DateLibs.isDateEqual(day, selectedDate)
  ) {
    return {
      div: 'flex justify-center items-start h-20',
      span: 'text-white rounded-full bg-black px-1 w-8 h-8 leading-8',
    };
  }
  if (day.getDay() === 0) {
    return {
      div: 'flex justify-center items-start h-20',
      span: 'text-red-500',
    };
  }
  if (day.getDay() === 6) {
    return {
      div: 'flex justify-center items-start h-20',
      span: 'text-blue-600',
    };
  }
  return {
    div: 'flex justify-center items-start h-20',
    span: 'text-gray-700',
  };
};
