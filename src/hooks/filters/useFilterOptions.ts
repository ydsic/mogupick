import { useQuery } from '@tanstack/react-query';
import { getFilterOptions, FilterOptionsResponse, ApiCategory } from '@/api/filters';

export function useFilterOptions(rootCategory: ApiCategory) {
  return useQuery<FilterOptionsResponse>({
    queryKey: ['filterOptions', rootCategory],
    queryFn: () => getFilterOptions(rootCategory),
    enabled: !!rootCategory,
  });
}
