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
  option?: {
    id: string;
    productId: number;
    rootCategory: string;
    subCategory: string;
    options: any; // null 가능
  };
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
      (item: ConstantlyPopularItemRaw) => {
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

export interface MappedPeerBestReviewItem {
  id: number;
  username: string;
  avatar?: string;
  store: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

export interface PeerBestReviewItemRaw {
  product: {
    productId: number;
    productImageUrl: string;
    productName: string;
    productPrice: number;
    createdAt: string;
  };
  brand?: { brandId: number; brandName: string };
  review?: { rating: number; reviewCount: number };
  user?: { userId: number; username: string; avatarUrl?: string };
}

export interface PeerBestReviewResponse {
  status: number;
  message: string;
  data: {
    content: PeerBestReviewItemRaw[];
    size: number;
    page: number;
    totalPages: number;
  };
}

export interface PeerBestReviewsMappedResult {
  items: MappedPeerBestReviewItem[];
  page: number;
  size: number;
  totalPages: number;
}

// 내 또래 상품 베스트 리뷰 조회 (매핑 포함)
export const getProductsPeerBestReviewsMapped = async (
  page = 0,
  size = 20,
): Promise<PeerBestReviewsMappedResult> => {
  console.log('[getProductsPeerBestReviewsMapped] start fetch', { page, size });
  try {
    // 기존 단순 Product[] 반환을 고려하여 우선 래핑 시도 후 실패 시 fallback
    let res: PeerBestReviewResponse | null = null;
    try {
      res = await apiFetch<PeerBestReviewResponse>(
        `/products/peer-best-reviews?page=${page}&size=${size}`,
      );
    } catch (e) {
      console.warn('[getProductsPeerBestReviewsMapped] wrapper 형태 아님, fallback 시도');
    }

    const rawItems: PeerBestReviewItemRaw[] = res
      ? res.data.content
      : ((await apiFetch<any[]>(`/products/peer-best-reviews?page=${page}&size=${size}`)) as any[]);

    const mapped: MappedPeerBestReviewItem[] = rawItems.map((item, idx) => ({
      id: item.product?.productId ?? idx,
      username: item.user?.username ?? '사용자',
      avatar: item.user?.avatarUrl,
      store: item.brand?.brandName ?? '',
      title: item.product?.productName ?? '상품',
      price: item.product?.productPrice ?? 0,
      rating: item.review?.rating ?? 0,
      reviewCount: item.review?.reviewCount ?? 0,
      imageUrl: item.product?.productImageUrl,
    }));

    const meta = res
      ? { page: res.data.page, size: res.data.size, totalPages: res.data.totalPages }
      : { page, size, totalPages: 1 };

    console.log('[getProductsPeerBestReviewsMapped] mapped items', mapped);
    return { items: mapped, ...meta };
  } catch (e: any) {
    console.error('[getProductsPeerBestReviewsMapped] error', e?.message || e);
    throw e;
  }
};

// 내 또래 상품 베스트 리뷰 조회 (호환용 별칭 - 매핑 결과 사용)
export const getProductsPeerBestReviews = getProductsPeerBestReviewsMapped;
