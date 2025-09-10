import { buildUrl } from '@/lib/config';

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

export interface SubCategory {
  key: string;
  name: string;
}

export interface RootCategory {
  key: ApiCategory;
  name: string;
  subCategories: SubCategory[];
}

export interface RootCategoriesResponse {
  status: number;
  message: string;
  data: RootCategory[];
}

export async function getFilterOptions(rootCategory: ApiCategory): Promise<FilterOptionsResponse> {
  const url = buildUrl(`/categories/options-filters?rootCategory=${rootCategory}`);
  const response = await fetch(url);

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to fetch filter options');
  }

  return response.json();
}

export async function getRootCategories(): Promise<RootCategoriesResponse> {
  const url = buildUrl('/categories/root');
  const response = await fetch(url);

  if (!response.ok) {
    console.error('API 요청 실패:', response.status, response.statusText);
    throw new Error('Failed to fetch root categories');
  }

  return response.json();
}
