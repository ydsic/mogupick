export function getApiBaseUrl(): string {
  // 프로덕션 환경에서는 항상 프록시 사용
  return '/proxy/api/v1';
}

export function getOAuthBaseUrl(): string {
  // 환경변수로 절대 경로 지정 가능 (예: http://ec2-...)
  return process.env.NEXT_PUBLIC_OAUTH_BASE || '/proxy';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function buildUrl(path: string, type: 'api' | 'oauth' = 'api'): string {
  const baseUrl = type === 'api' ? getApiBaseUrl() : getOAuthBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 절대 URL 기반 (http/https) 이면 그대로 결합
  if (/^https?:\/\//i.test(baseUrl)) {
    return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
  }
  return `${baseUrl}${normalizedPath}`;
}
