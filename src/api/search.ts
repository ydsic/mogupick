import { apiFetch } from './client';

export interface SearchRequest {
  content: string;
}

export interface SearchResponse<T = any> {
  status?: number;
  message?: string;
  data?: T;
}

// 검색어로 POST 요청 (body: { content: string })
export const postSearch = (content: string) =>
  apiFetch<SearchResponse>(`/search`, 'POST', { body: { content } as SearchRequest });
