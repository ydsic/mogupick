export interface CalendarEvent {
  id: string | number;
  title: string;
  date: Date;
  category?: string;
  color?: string;
}

// events : 구독 캘린더 & select : 구독 옵션 설정
export type CalendarMode = 'select' | 'events';

export interface CalendarProps {
  mode: CalendarMode; // 캘린더 모드
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;

  // select 모드
  isDateDisabled?: (date: Date) => boolean;

  // events 모드
  events?: CalendarEvent[];
  renderEvent?: (event: CalendarEvent) => React.ReactNode;

  // 공통
  dayClassName?: (day: Date, selectedDate: Date) => string;
  weekDays?: string[];
}
