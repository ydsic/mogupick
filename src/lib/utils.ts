import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 여러 Tailwind CSS 클래스를 조건부로 합칠 때 사용
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 숫자를 한국 숫자 형식으로 포맷, 천 단위 콤마 찍어주는 함수
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

// 날짜 변환 ("0000년 0월 00일 오전 00:00")
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date));
}
