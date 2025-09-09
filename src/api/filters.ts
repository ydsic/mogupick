import { authFetch } from '@/lib/authFetch';

export type ApiCategory =
  | 'FRESH_FOOD'
  | 'MEAT_SEAFOOD'
  | 'DAIRY_BEVERAGE'
  | 'CONVENIENCE_FOOD'
  | 'SNACK'
  | 'HEALTH_SUPPLEMENTS'
  | 'DAILY_GOODS'
  | 'HYGIENE'
  | 'PET_SUPPLIES'
  | 'BABY_SUPPLIES';

export interface FilterOption {
  key: string;
  name: string;
  type: 'CHOICE' | 'RANGE';
  multiple: boolean;
}

export interface FilterValue {
  name: string;
  expression: string;
}

export interface FilterGroup {
  option: FilterOption;
  optionFilters: FilterValue[];
}

export interface FilterOptionsResponse {
  status: number;
  message: string;
  data: {
    common: FilterGroup[];
    subCategories: Record<string, FilterGroup[]>;
  };
}

export async function getFilterOptions(rootCategory: ApiCategory): Promise<FilterOptionsResponse> {
  const response = await authFetch(
    `http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/categories/options-filters?rootCategory=${rootCategory}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch filter options');
  }

  return response.json();
}
