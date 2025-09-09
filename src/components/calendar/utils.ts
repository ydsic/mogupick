import { DateLibs } from '@nwleedev/use-calendar';

export const defaultGetClassNames = (date: Date, day: Date, selectedDate: Date) => {
  if (!DateLibs.isMonthEqual(date, day)) return '';

  if (
    DateLibs.isYearEqual(day, selectedDate) &&
    DateLibs.isMonthEqual(day, selectedDate) &&
    DateLibs.isDateEqual(day, selectedDate)
  ) {
    return 'text-white rounded-full bg-black w-8 h-8 flex items-center justify-center';
  }

  if (day.getDay() === 0) return 'text-red-500';
  if (day.getDay() === 6) return 'text-blue-600';

  return 'text-gray-700';
};
