import { useQuery } from '@tanstack/react-query';
import { getFilterOptions, FilterOptionsResponse, ApiCategory } from '@/api/filters';

const apiCategories: ApiCategory[] = [
  'FRESH_FOOD',
  'MEAT_SEAFOOD',
  'DAIRY_BEVERAGE',
  'CONVENIENCE_FOOD',
  'SNACK',
  'HEALTH_SUPPLEMENTS',
  'DAILY_GOODS',
  'HYGIENE',
  'PET_SUPPLIES',
  'BABY_SUPPLIES',
];

function toApiCategory(category: string): ApiCategory | undefined {
  return apiCategories.includes(category as ApiCategory) ? (category as ApiCategory) : undefined;
}

export function useFilterOptions(rootCategory: ApiCategory | string) {
  const validCategory =
    typeof rootCategory === 'string' ? toApiCategory(rootCategory) : rootCategory;

  return useQuery<FilterOptionsResponse>({
    queryKey: ['filterOptions', validCategory],
    queryFn: () =>
      validCategory ? getFilterOptions(validCategory) : Promise.reject('Invalid category'),
    enabled: !!validCategory,
  });
}
