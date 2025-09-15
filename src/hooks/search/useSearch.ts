import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSearch,
  getSearchTopRisingToday,
  getSearchRelated,
  getSearchRecent,
  deleteSearchRecent,
} from '@/api/search';

// 상품 검색
export const useCreateSearch = () => {
  return useMutation({
    mutationFn: createSearch,
  });
};

// 오늘 실시간 급상승 검색어 조회
export const useSearchTopRisingToday = () =>
  useQuery({
    queryKey: ['searchTopRisingToday'],
    queryFn: getSearchTopRisingToday,
  });

// 연관 검색어 조회
export const useSearchRelated = () =>
  useMutation({
    mutationFn: getSearchRelated,
  });

// 최근 검색어 조회
export const useSearchRecent = () =>
  useQuery({
    queryKey: ['searchRecent'],
    queryFn: getSearchRecent,
  });

// 최근 검색어 삭제
export const useDeleteSearchRecent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSearchRecent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchRecent'] });
    },
  });
};
