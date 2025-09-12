import { buildUrl } from '@/lib/config';
import { useAuthStore } from '@/store/useAuthStore';

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

export interface SearchRequest {
  content: string;
}

export interface SearchResponse<T = any> {
  status?: number;
  message?: string;
  data?: T;
}

// 상품 검색
export const createSearch = async (data: Search) => {
  const url = buildUrl('/search');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to create search');
  }

  return response.json();
};

// 실시간 급상승 검색어 조회
export const getSearchTopRisingToday = async () => {
  const url = buildUrl('/search/top-rising/today');

  const response = await fetch(url);

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to fetch top-rising search');
  }

  return response.json();
};

// 연관 검색어 조회
export const getSearchRelated = async (data: SearchRelated) => {
  const url = buildUrl('/search/related');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to fetch related search');
  }

  return response.json();
};


// 최근 검색어 조회 (로그인 필요: Authorization 포함)
export const getSearchRecent = async () => {
  const url = buildUrl('/search/recent');

  let headers: Record<string, string> = {};
  try {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  } catch {}

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to fetch recent search');
  }

  return response.json();
};

// 최근 검색어 삭제
export const deleteSearchRecent = async (keywordId: number) => {
  const url = buildUrl(`/search/recent/${keywordId}`);

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to delete recent search');
  }

  return response.json();
};

// 검색어로 POST 요청 (body: { content: string }) - 로그인 시 토큰 포함
export const postSearch = async (content: string) => {
  const url = buildUrl('/search');

  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  try {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  } catch {}

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content } as SearchRequest),
  });

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to post search');
  }

  return response.json() as Promise<SearchResponse>;
};
