export function getApiBaseUrl(): string {
  // 브라우저에서 실행 중이고 HTTPS 프로토콜을 사용하는 경우 (배포 환경)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return '/proxy/api/v1';
  }

  // 서버사이드에서는 환경변수 확인
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 환경변수가 HTTP로 시작하고 현재 프로덕션 환경이면 프록시 사용
  if (baseUrl && baseUrl.startsWith('http://') && process.env.NODE_ENV === 'production') {
    return '/proxy/api/v1';
  }

  // 그 외의 경우 환경변수 사용 (개발 환경)
  return baseUrl || '/proxy/api/v1';
}

export function getOAuthBaseUrl(): string {
  // 브라우저에서 실행 중이고 HTTPS 프로토콜을 사용하는 경우 (배포 환경)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return '/proxy';
  }

  // 서버사이드에서는 환경변수 확인
  const baseUrl = process.env.NEXT_PUBLIC_OAUTH_BASE_URL;

  // 환경변수가 HTTP로 시작하고 현재 프로덕션 환경이면 프록시 사용
  if (baseUrl && baseUrl.startsWith('http://') && process.env.NODE_ENV === 'production') {
    return '/proxy';
  }

  // 그 외의 경우 환경변수 사용 (개발 환경)
  return baseUrl || '/proxy';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function buildUrl(path: string, type: 'api' | 'oauth' = 'api'): string {
  const baseUrl = type === 'api' ? getApiBaseUrl() : getOAuthBaseUrl();

  if (type === 'api') {
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
