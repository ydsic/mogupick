export interface Product {
  id: number;
  store: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string; // 상품 대표 이미지 URL (선택)
  isLiked?: boolean;
}

export interface ProductDetailType {
  productId: number;
  productName: string;
  productImageUrls: string[];
  productDescriptionImageUrls: string[];
  price: number;
  brandId: number;
  brandName: string;
  averageRating: number;
  reviewCount: number;
}
