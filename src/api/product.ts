import { apiFetch } from './client';

export interface Product {
  rootCategory: string;
  subCategory: string;
  brandId: number;
  name: string;
  price: number;
  options: object;
  productImages: File[]; // 대표 이미지들
  productDescriptionImages: File[]; // 상세 이미지들
}

// 상품등록
export const createProduct = async (data: Product) => {
  const formData = new FormData();
  formData.append('rootCategory', data.rootCategory);
  formData.append('subCategory', data.subCategory);
  formData.append('brandId', data.brandId.toString());
  formData.append('name', data.name);
  formData.append('price', data.price.toLocaleString());
  formData.append('options', JSON.stringify(data.options));

  data.productImages.forEach((file) => formData.append('productImages', file));
  data.productDescriptionImages.forEach((file) =>
    formData.append('productDescriptionImages', file),
  );

  const res = await apiFetch<Product[]>('/products', 'POST', { body: formData });

  return res;
};

// 상품 상세조회
export const getProduct = (productId: number) => apiFetch<Product>(`/products/${productId}/detail`);
// 유사상품 목록조회
export const getProductsSimilar = () => apiFetch<Product[]>('/products/similar');
// 멤버의 최근 본 상품목록조회
export const getProductsRecentlyViewed = () => apiFetch<Product[]>('/products/recently-viewed');
// 내 또래 상품 베스트 리뷰 조회
export const getProductsPeerBestReviews = () => apiFetch<Product[]>('/products/peer-best-reviews');
// 이번 달 새로나온 상품조회
export const getProductsNew = () => apiFetch<Product[]>('/products/new');
// 꾸준히 사랑받는 상품목록 조회
export const getProductsConstantlyPopular = () =>
  apiFetch<Product[]>('/products/constantly-popular');
// 루트 카테고리에 대한 상품 목록 조회
export const getProductsCategory = () => apiFetch<Product[]>('/products/category');
// 입문용 상품 목록 조회
export const getProductsBeginnerFriendly = () => apiFetch<Product[]>('/products/beginner-friendly');
