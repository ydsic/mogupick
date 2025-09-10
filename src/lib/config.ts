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

// 소셜 로그인 설정
interface BaseSocialConfig {
  clientId: string;
  scope: readonly string[];
  redirectUri: (baseUrl: string) => string;
}

interface GoogleConfig extends BaseSocialConfig {}

interface KakaoConfig extends BaseSocialConfig {
  clientAuthenticationMethod: string;
  authorizationGrantType: string;
  clientName: string;
}

export const SOCIAL_LOGIN_CONFIG = {
  google: {
    clientId:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '371140249433-06gt9tu4tjmtkvp3fjvs73lj0h69h22r.apps.googleusercontent.com',
    scope: ['profile', 'email'],
    redirectUri: (baseUrl: string) => `${baseUrl}/login/oauth2/code/google`,
  } as GoogleConfig,
  kakao: {
    clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '176bd58bb9828831e99e28b905c81b61',
    scope: ['profile_nickname', 'account_email'],
    clientAuthenticationMethod: 'client_secret_post',
    authorizationGrantType: 'authorization_code',
    redirectUri: (baseUrl: string) =>
      `http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com/login/oauth2/code/kakao`,
    clientName: 'Kakao',
  } as KakaoConfig,
} as const;

export type SocialProvider = keyof typeof SOCIAL_LOGIN_CONFIG;
export type SocialConfig = GoogleConfig | KakaoConfig;
