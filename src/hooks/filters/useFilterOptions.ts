import { useQuery } from '@tanstack/react-query';
import { getFilterOptions, FilterOptionsResponse } from '@/api/filters';

export function useFilterOptions(rootCategory: string) {
  return useQuery<FilterOptionsResponse>({
    queryKey: ['filterOptions', rootCategory],
    queryFn: () => getFilterOptions(rootCategory),
    enabled: !!rootCategory,
  });
}
