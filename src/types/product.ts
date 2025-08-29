export interface Product {
  id: number;
  store: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  isLiked?: boolean;
}
