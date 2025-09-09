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

    // 서브카테고리가 있다면 해당 필터도 추가
    if (subCategory && subCategories[subCategory]) {
      // 중복되지 않는 필터만 추가 (key를 기준으로)
      const commonKeys = new Set(common.map((group) => group.option.key));
      const subCategoryFilters = subCategories[subCategory].filter(
        (group) => !commonKeys.has(group.option.key),
      );
      filterGroups = [...filterGroups, ...subCategoryFilters];
    }

    return filterGroups;
  };

  return {
    ...query,
    filterGroups: getFilterGroups(),
  };
}
