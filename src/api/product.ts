import { apiFetch } from './client';

export interface Product {
  rootCategory: string;
  subCategory: string;
  brandId: number;
  name: string;
  price: number;
  options: object;
  productImages: string[]; // 대표 이미지들
  productDescriptionImages: string[]; // 상세 이미지들
}

// 꾸준히 사랑받는 상품 API 관련 타입
export interface ConstantlyPopularItemRaw {
  product: {
    productId: number;
    productImageUrl: string;
    productName: string;
    productPrice: number;
    createdAt: string;
  };
  brand: { brandId: number; brandName: string };
  review: { rating: number; reviewCount: number };
}

export interface ConstantlyPopularResponse {
  status: number;
  message: string;
  data: {
    content: ConstantlyPopularItemRaw[];
    size: number;
    page: number;
    totalPages: number;
  };
}

export interface MappedProductCardItem {
  id: number;
  store: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

export interface ConstantlyPopularMappedResult {
  items: MappedProductCardItem[];
  page: number;
  size: number;
  totalPages: number;
}

// 상품등록
export const createProduct = async (data: Product) => {
  const formData = new FormData();
  formData.append('rootCategory', data.rootCategory);
  formData.append('subCategory', data.subCategory);
  formData.append('brandId', data.brandId.toString());
  formData.append('name', data.name);
  formData.append('price', data.price.toString());
  formData.append('options', JSON.stringify(data.options));

  data.productImages.forEach((file) => formData.append('productImages', file));
  data.productDescriptionImages.forEach((file) =>
    formData.append('productDescriptionImages', file),
  );

  return apiFetch<Product>('/products', 'POST', { body: formData });
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
// 꾸준히 사랑받는 상품목록 조회 (페이지네이션 적용)
export const getProductsConstantlyPopular = async (
  page = 0,
  size = 20,
): Promise<ConstantlyPopularMappedResult> => {
  console.log('[getProductsConstantlyPopular] start fetch', { page, size });
  try {
    const res = await apiFetch<ConstantlyPopularResponse>(
      `/products/constantly-popular?page=${page}&size=${size}`,
    );
    console.log('[getProductsConstantlyPopular] raw response', res);

    const mapped: MappedProductCardItem[] = res.data.content.map(
      (item: ConstantlyPopularItemRaw, idx) => {
        const mappedItem = {
          id: item.product.productId,
          store: item.brand?.brandName ?? '',
          title: item.product.productName,
          price: item.product.productPrice,
          rating: item.review?.rating ?? 0,
          reviewCount: item.review?.reviewCount ?? 0,
          imageUrl: item.product.productImageUrl,
        };
        return mappedItem;
      },
    );
    console.log('[getProductsConstantlyPopular] mapped items', mapped);
    return {
      items: mapped,
      page: res.data.page,
      size: res.data.size,
      totalPages: res.data.totalPages,
    };
  } catch (e: any) {
    console.error('[getProductsConstantlyPopular] error', e?.message || e);
    throw e;
  }
};
// 루트 카테고리에 대한 상품 목록 조회
export const getProductsCategory = () => apiFetch<Product[]>('/products/category');
// 입문용 상품 목록 조회
export const getProductsBeginnerFriendly = () => apiFetch<Product[]>('/products/beginner-friendly');
