import { useQuery } from '@tanstack/react-query';
import { getFilterOptions, FilterOptionsResponse, FilterGroup, ApiCategory } from '@/api/filters';

export function useFilterOptions(rootCategory: ApiCategory, subCategory?: string) {
  const query = useQuery<FilterOptionsResponse>({
    queryKey: ['filterOptions', rootCategory],
    queryFn: () => getFilterOptions(rootCategory),
    enabled: !!rootCategory,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
  });

  // 공통 필터와 서브카테고리 필터를 결합
  const getFilterGroups = (): FilterGroup[] => {
    if (!query.data?.data) return [];

    const { common, subCategories } = query.data.data;
    let filterGroups = [...common];

    // 모든 서브카테고리 필터를 추가 (중복 제거)
    const commonKeys = new Set(common.map((group) => group.option.key));

    Object.values(subCategories).forEach((subCategoryFilters) => {
      const uniqueFilters = subCategoryFilters.filter(
        (group) =>
          !commonKeys.has(group.option.key) &&
          !filterGroups.some((existing) => existing.option.key === group.option.key),
      );
      filterGroups = [...filterGroups, ...uniqueFilters];
    });

    return filterGroups;
  };

  return {
    ...query,
    filterGroups: getFilterGroups(),
  };
}
