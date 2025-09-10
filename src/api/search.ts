import { apiFetch } from './client';

interface Search {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  brandName: string;
  rating: number;
  reviewCount: number;
}

interface SearchRelated {
  id: number;
  content: string;
  searchedCount: number;
}

// 상품 검색
export const createSearch = (data: Search) => apiFetch('/search', 'POST', { body: data });

// 실시간 급상승 검색어 조회
export const getSearchTopRisingToday = () => apiFetch('/search/top-rising/today');

// 연관 검색어 조회
export const getSearchRelated = (data: SearchRelated) =>
  apiFetch('/search/related', 'POST', { body: data });

// 최근 검색어 조회
export const getSearchRecent = () => apiFetch('/search/recent');

// 최근 검색어 삭제
export const deleteSearchRecent = (keywordId: number) => apiFetch(`/search/recent/${keywordId}`);
