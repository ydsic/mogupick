import { useQuery } from '@tanstack/react-query';
import { getFilterOptions, FilterOptionsResponse, FilterGroup, ApiCategory } from '@/api/filters';

export function useFilterOptions(rootCategory: ApiCategory, currentSubCategoryKey?: string) {
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

    // 공통 키 집합 (중복 제거용)
    const commonKeys = new Set(common.map((group) => group.option.key));

    // 현재 선택된 서브카테고리가 있으면 해당 서브카테고리의 필터만 추가
    if (currentSubCategoryKey && subCategories[currentSubCategoryKey]) {
      const target = subCategories[currentSubCategoryKey];
      const unique = target.filter(
        (group) =>
          !commonKeys.has(group.option.key) &&
          !filterGroups.some((existing) => existing.option.key === group.option.key),
      );
      return [...filterGroups, ...unique];
    }

    // 선택된 서브카테고리가 없으면 모든 서브카테고리 필터를 합집합으로 추가 (기존 동작)
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
