'use client';

import useCalendar, { CalendarStage } from '@nwleedev/use-calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import { CalendarProps } from './types';
import { defaultGetClassNames } from './utils';

import NextIcon from '@/assets/icons/common/next-30px.svg';
import PrevIcon from '@/assets/icons/common/prev-30px.svg';
import clsx from 'clsx';

export default function Calendar({
  mode,
  events = [],
  selectedDate: controlledDate,
  onDateSelect,
  renderEvent,
  isDateDisabled,
  dayClassName,
  weekDays = ['일', '월', '화', '수', '목', '금', '토'],
}: CalendarProps) {
  const [internalDate, setInternalDate] = useState(new Date());
  const selectedDate = controlledDate ?? internalDate;

  const { days, date, months, stage, onMonthChange, onYearChange, onStageChange } = useCalendar({
    defaultValue: selectedDate,
  });

  const month = date.getMonth();

  const handleSelectDate = (day: Date) => {
    if (isDateDisabled?.(day)) return;
    setInternalDate(day);
    onDateSelect?.(day);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
      {stage === CalendarStage.DAYS && (
        <div className="flex h-10 w-full items-center justify-between gap-x-2">
          <button onClick={() => onMonthChange(month - 1)}>
            <PrevIcon />
          </button>
          <h2
            className="cursor-pointer text-xl font-semibold"
            // onClick={() => onStageChange(CalendarStage.MONTHS)}
          >
            {format(date, 'MM월 yyyy')}
          </h2>
          <button onClick={() => onMonthChange(month + 1)}>
            <NextIcon />
          </button>
        </div>
      )}

      {/* 요일 */}
      <div className="grid w-full grid-cols-7 text-center font-medium text-gray-500">
        {weekDays.map((day) => (
          <div key={day} className="flex h-10 items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      {stage === CalendarStage.DAYS && (
        <div className="grid w-full grid-cols-7 gap-x-2 gap-y-1">
          {days.map((day: Date) => {
            // 현재 월과 다른 날짜는 표시하지 않음
            if (day.getMonth() !== month) {
              return (
                <div
                  key={day.getTime()}
                  className={clsx(
                    'flex flex-col items-center',
                    mode === 'select' ? 'h-11' : 'h-20',
                  )}
                />
              );
            }

            const baseClass =
              dayClassName?.(day, selectedDate as Date) ??
              defaultGetClassNames(date, day, selectedDate as Date);

            if (!baseClass)
              return (
                <div
                  key={day.getTime()}
                  className={clsx(
                    'flex flex-col items-center',
                    mode === 'select' ? 'h-11' : 'h-20',
                  )}
                />
              );

            return (
              <div
                key={day.getTime()}
                className={clsx('flex flex-col items-center', mode === 'select' ? 'h-11' : 'h-20')}
              >
                <button
                  className="flex h-8 w-8 items-center justify-center"
                  onClick={() => handleSelectDate(day)}
                  disabled={isDateDisabled?.(day)}
                >
                  <span className={baseClass}>{day.getDate()}</span>
                </button>

                {/* events 모드일 때만 렌더 */}
                {mode === 'events' && (
                  <div className="mt-1 flex w-full flex-col items-center gap-1 overflow-hidden">
                    {events
                      ?.filter(
                        (event) =>
                          event.date.getFullYear() === day.getFullYear() &&
                          event.date.getMonth() === day.getMonth() &&
                          event.date.getDate() === day.getDate(),
                      )
                      .map((event) =>
                        renderEvent ? (
                          renderEvent(event)
                        ) : (
                          <span
                            key={event.id}
                            className={`w-full truncate rounded text-xs ${event.color}`}
                          >
                            {event.title}
                          </span>
                        ),
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 연도 / 월 선택 */}
      {/* {stage === CalendarStage.MONTHS && (
        <>
          <div className="flex h-10 w-full items-center justify-center gap-x-2">
            <button onClick={() => onYearChange(year - 1)}>
              <PrevIcon />
            </button>
            <h2 className="text-xl font-semibold">{format(date, 'yyyy')}</h2>
            <button onClick={() => onYearChange(year + 1)}>
              <NextIcon />
            </button>
          </div>

          <div className="grid w-full max-w-[320px] grid-cols-3 gap-x-2 gap-y-1">
            {months.map((m) => (
              <button
                key={m.getTime()}
                className="h-10"
                onClick={() => {
                  onMonthChange(m.getMonth());
                  onStageChange(CalendarStage.DAYS);
                }}
              >
                <span>{format(m, 'MM')}월</span>
              </button>
            ))}
          </div>
        </>
      )} */}
    </div>
  );
}
