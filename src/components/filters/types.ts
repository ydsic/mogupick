export type SortKey = 'recommended' | 'new' | 'popular' | 'review' | 'priceLow';

export type FilterTab =
  | '가격범위'
  | '별점 갯수'
  | '중량'
  | '섭취 방법'
  | '칼로리'
  | '조리 방법'
  | '개당 수량';

export type PriceRange =
  | '선택 안함'
  | '5,000원 미만'
  | '5,000-10,000원'
  | '10,000-20,000원'
  | '20,000-30,000원'
  | '30,000-40,000원'
  | '40,000원 이상';

export interface FilterState {
  priceRange: PriceRange;
  rating: number;
}
