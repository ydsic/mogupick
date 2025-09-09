import { FilterGroup } from '@/api/filters';

export type SortKey = 'recommended' | 'new' | 'popular' | 'review' | 'priceLow';

export interface FilterState {
  [key: string]: string[];
}

export interface FilterData {
  tabs: FilterGroup[];
  activeTab: string;
  selectedFilters: FilterState;
}
