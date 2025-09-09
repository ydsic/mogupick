export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_BASE_URL이 설정되지 않았습니다. 기본값을 사용합니다.');
    return 'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1';
  }

  return baseUrl;
}

export function getOAuthBaseUrl(): string {
  const oauthUrl = process.env.NEXT_PUBLIC_OAUTH_BASE_URL;

  if (!oauthUrl) {
    console.warn('NEXT_PUBLIC_OAUTH_BASE_URL이 설정되지 않았습니다. 기본값을 사용합니다.');
    return 'http://xn--hy1b12lfh85nbqam9ry5f';
  }

  return oauthUrl;
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
