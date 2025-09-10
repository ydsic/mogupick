export function getApiBaseUrl(): string {
  // 프로덕션 환경에서는 항상 프록시 사용
  return '/proxy/api/v1';
}

export function getOAuthBaseUrl(): string {
  // 프로덕션 환경에서는 항상 프록시 사용
  return '/proxy';
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
