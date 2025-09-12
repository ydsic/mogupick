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
  brand: {
    brandId: number;
    brandName: string;
  };
  review: {
    rating: number;
    reviewCount: number;
  };
  option: {
    id: string;
    productId: number;
    rootCategory: string;
    subCategory: string;
    options: null;
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
  rootCategory?: string;
  subCategory?: string;
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

// 유사상품 목록조회 (페이지네이션)
export const getProductsSimilarPaged = (page = 0, size = 20) =>
  apiFetch<any>(`/products/similar?page=${page}&size=${size}`);

// 멤버의 최근 본 상품목록조회
export const getProductsRecentlyViewed = () => apiFetch<Product[]>('/products/recently-viewed');
// 내 또래 상품 베스트 리뷰 조회
export const getProductsPeerBestReviews = () => apiFetch<Product[]>('/products/peer-best-reviews');

// 이번 달 새로나온 상품조회
export const getProductsNew = () => apiFetch<Product[]>('/products/new');

// 이번 달 새로나온 상품 API 관련 타입
export interface NewProductItemRaw {
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
    options: any;
  };
}

export interface NewProductResponse {
  status: number;
  message: string;
  data: {
    content: NewProductItemRaw[];
    size: number;
    page: number;
    totalPages: number;
  };
}

export interface NewProductMappedResult {
  items: MappedProductCardItem[];
  page: number;
  size: number;
  totalPages: number;
}

// 내 또래의 베스트 리뷰 Pick
export const getProductsConstantlyPopular = async (
  page = 0,
  size = 20,
): Promise<ConstantlyPopularResponse> => {
  try {
    const res = await apiFetch<ConstantlyPopularResponse>(
      `/products/constantly-popular?page=${page}&size=${size}`,
    );
    return res;
  } catch (e: any) {
    console.error('[getProductsConstantlyPopular] error', e?.message || e);
    throw e;
  }
};

// 꾸준히 사랑받는 상품 목록 조회 (매핑 포함)
export const getProductsConstantlyPopularMapped = async (
  page = 0,
  size = 20,
  rootCategory?: string,
): Promise<ConstantlyPopularMappedResult> => {
  try {
    let url = `/products/constantly-popular?page=${page}&size=${size}`;
    if (rootCategory) {
      url += `&rootCategory=${rootCategory}`;
    }

    const res = await apiFetch<ConstantlyPopularResponse>(url);
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
          rootCategory: item.option?.rootCategory,
          subCategory: item.option?.subCategory,
        };
        return mappedItem;
      },
    );
    return {
      items: mapped,
      page: res.data.page,
      size: res.data.size,
      totalPages: res.data.totalPages,
    };
  } catch (e: any) {
    console.error('[getProductsConstantlyPopularMapped] error', e?.message || e);
    // 에러가 발생해도 빈 배열과 기본 메타데이터 반환
    return {
      items: [],
      page,
      size,
      totalPages: 1,
    };
  }
};
// 루트 카테고리에 대한 상품 목록 조회
export const getProductsCategory = () => apiFetch<Product[]>('/products/category');

// 입문용 상품 API 관련 타입과 함수
export interface BeginnerFriendlyItemRaw {
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
    options: any;
  };
}

export interface BeginnerFriendlyResponse {
  status: number;
  message: string;
  data: {
    content: BeginnerFriendlyItemRaw[];
    size: number;
    page: number;
    totalPages: number;
  };
}

export interface BeginnerFriendlyMappedResult {
  items: MappedProductCardItem[];
  page: number;
  size: number;
  totalPages: number;
}

// 입문용 상품 목록 조회 (매핑 포함)
export const getProductsBeginnerFriendlyMapped = async (
  page = 0,
  size = 20,
  rootCategory?: string,
): Promise<BeginnerFriendlyMappedResult> => {
  try {
    let url = `/products/beginner-friendly?page=${page}&size=${size}`;
    if (rootCategory) {
      url += `&rootCategory=${rootCategory}`;
    }

    const res = await apiFetch<BeginnerFriendlyResponse>(url);

    const mapped: MappedProductCardItem[] = res.data.content.map(
      (item: BeginnerFriendlyItemRaw) => {
        const mappedItem = {
          id: item.product.productId,
          store: item.brand?.brandName ?? '',
          title: item.product.productName,
          price: item.product.productPrice,
          rating: item.review?.rating ?? 0,
          reviewCount: item.review?.reviewCount ?? 0,
          imageUrl: item.product.productImageUrl,
          rootCategory: item.option?.rootCategory,
          subCategory: item.option?.subCategory,
        };
        return mappedItem;
      },
    );
    return {
      items: mapped,
      page: res.data.page,
      size: res.data.size,
      totalPages: res.data.totalPages,
    };
  } catch (e: any) {
    console.error('[getProductsBeginnerFriendlyMapped] error', e?.message || e);
    return {
      items: [],
      page,
      size,
      totalPages: 1,
    };
  }
};

// 입문용 상품 목록 조회 (기존)
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
  try {
    let res: PeerBestReviewResponse | null = null;
    try {
      res = await apiFetch<PeerBestReviewResponse>(
        `/products/peer-best-reviews?page=${page}&size=${size}`,
      );
    } catch (e) {
      console.warn('[getProductsPeerBestReviewsMapped] wrapper 형태 아님, fallback 시도');
    }

    let rawItems;
    if (res && res.data && res.data.content) {
      rawItems = res.data.content;
    } else {
      const fallbackRes = await apiFetch<any>(
        `/products/peer-best-reviews?page=${page}&size=${size}`,
      );
      if (Array.isArray(fallbackRes)) {
        rawItems = fallbackRes;
      } else if (
        fallbackRes &&
        typeof fallbackRes === 'object' &&
        fallbackRes.data &&
        Array.isArray(fallbackRes.data.content)
      ) {
        rawItems = fallbackRes.data.content;
      } else {
        rawItems = [];
      }
    }

    const mapped: MappedPeerBestReviewItem[] = rawItems.map((item: any, idx: number) => ({
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

    const meta =
      res && res.data
        ? { page: res.data.page, size: res.data.size, totalPages: res.data.totalPages }
        : { page, size, totalPages: 1 };

    return { items: mapped, ...meta };
  } catch (e: any) {
    console.error('[getProductsPeerBestReviewsMapped] error', e?.message || e);
    return { items: [], page, size, totalPages: 1 };
  }
};

// 최근 본 상품 목록 조회 (매핑 포함)
export const getProductsRecentlyViewedMapped = async (): Promise<MappedProductCardItem[]> => {
  try {
    const rawData = await getProductsRecentlyViewed();

    // rawData가 없거나 배열이 아닌 경우 빈 배열 반환
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }

    // 기본 Product[] 타입이므로 안전하게 변환
    const mapped: MappedProductCardItem[] = rawData.map((item: any, idx: number) => ({

      id: item.productId ?? item.id ?? idx,
      store: item.brandName ?? item.store ?? '',
      title: item.productName ?? item.title ?? item.name ?? '상품',
      price: item.productPrice ?? item.price ?? 0,
      rating: item.rating ?? item.starRate ?? 4.5,
      reviewCount: item.reviewCount ?? 0,
      imageUrl: item.productImageUrl ?? item.imageUrl,
      rootCategory: item.rootCategory,
      subCategory: item.subCategory,
    }));

    return mapped;
  } catch (e: any) {
    console.error('[getProductsRecentlyViewedMapped] error', e?.message || e);
    return [];
  }
};

// 이번 달 새로나온 상품 목록 조회 (매핑 포함)
export const getProductsNewMapped = async (
  page = 0,
  size = 20,
  rootCategory?: string,
): Promise<NewProductMappedResult> => {
  try {
    let url = `/products/new?page=${page}&size=${size}`;
    if (rootCategory) {
      url += `&rootCategory=${rootCategory}`;
    }

    const res = await apiFetch<NewProductResponse>(url);

    const mapped: MappedProductCardItem[] = res.data.content.map((item: NewProductItemRaw) => {
      const mappedItem = {
        id: item.product.productId,
        store: item.brand?.brandName ?? '',
        title: item.product.productName,
        price: item.product.productPrice,
        rating: item.review?.rating ?? 0,
        reviewCount: item.review?.reviewCount ?? 0,
        imageUrl: item.product.productImageUrl,
        rootCategory: item.option?.rootCategory,
        subCategory: item.option?.subCategory,
      };
      return mappedItem;
    });

    return {
      items: mapped,
      page: res.data.page,
      size: res.data.size,
      totalPages: res.data.totalPages,
    };
  } catch (e: any) {
    console.error('[getProductsNewMapped] error', e?.message || e);
    return {
      items: [],
      page,
      size,
      totalPages: 1,
    };
  }
};

// 지금 주목받는 상품 API 관련 타입
export interface MostViewedItemRaw {
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
    options: any;
  };
}

export interface MostViewedResponse {
  status: number;
  message: string;
  data: {
    content: MostViewedItemRaw[];
    size: number;
    page: number;
    totalPages: number;
  };
}

export interface MostViewedMappedResult {
  items: MappedProductCardItem[];
  page: number;
  size: number;
  totalPages: number;
}

// 지금 주목받는 상품 목록 조회 (매핑 포함)
export const getProductsMostViewedMapped = async (
  page = 0,
  size = 20,
  rootCategory?: string,
): Promise<MostViewedMappedResult> => {
  try {
    let url = `/products/view-count/most-daily-view-stat-change?page=${page}&size=${size}`;
    if (rootCategory) {
      url += `&rootCategory=${rootCategory}`;
    }

    const res = await apiFetch<MostViewedResponse>(url);

    const mapped: MappedProductCardItem[] = res.data.content.map((item: MostViewedItemRaw) => {
      const mappedItem = {
        id: item.product.productId,
        store: item.brand?.brandName ?? '',
        title: item.product.productName,
        price: item.product.productPrice,
        rating: item.review?.rating ?? 0,
        reviewCount: item.review?.reviewCount ?? 0,
        imageUrl: item.product.productImageUrl,
        rootCategory: item.option?.rootCategory,
        subCategory: item.option?.subCategory,
      };
      return mappedItem;
    });

    return {
      items: mapped,
      page: res.data.page,
      size: res.data.size,
      totalPages: res.data.totalPages,
    };
  } catch (e: any) {
    console.error('[getProductsMostViewedMapped] error', e?.message || e);

    return {
      items: [],
      page,
      size,
      totalPages: 1,
    };
  }
};
