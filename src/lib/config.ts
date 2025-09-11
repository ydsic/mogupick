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
  // baseUrl은 일부 공급자(Google)에서만 사용하므로 선택적 사용을 위해 _baseUrl 변수명
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
    // 개발 편의용 fallback (프로덕션에서는 환경변수 사용 권장)
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
    // Kakao는 현재 고정 Redirect URI 사용 (환경변수 우선), 시그니처 맞추기 위해 매개변수만 형식상 사용
    redirectUri: (_baseUrl: string) =>
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
      'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com/login/oauth2/code/kakao',
    clientName: 'Kakao',
  } as KakaoConfig,
} as const;

export type SocialProvider = keyof typeof SOCIAL_LOGIN_CONFIG;
export type SocialConfig = GoogleConfig | KakaoConfig;

// ---------------- 추가 유틸 (개선사항) ----------------

/** 필수 환경변수 존재 여부 검사 (없으면 에러 throw) */
export function ensureSocialEnv(provider: SocialProvider) {
  const cfg = SOCIAL_LOGIN_CONFIG[provider];
  if (!cfg.clientId) {
    throw new Error(`[Social:${provider}] clientId 누락 - 환경변수 설정 필요`);
  }
  if (provider === 'kakao') {
    const redirect = cfg.redirectUri('');
    if (!redirect) {
      throw new Error('[Social:kakao] redirectUri 누락');
    }
  }
  if (provider === 'google') {
    // google redirectUri는 baseUrl 입력 필요 → 호출 시 주입 확인 정도로 충분
  }
  return true;
}

function buildQuery(params: Record<string, string | undefined>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join('&');
}

/** Kakao Authorization Code 요청 URL 생성 */
export function buildKakaoAuthorizeUrl(state: string) {
  ensureSocialEnv('kakao');
  const cfg = SOCIAL_LOGIN_CONFIG.kakao;
  const redirectUri = cfg.redirectUri('');
  const query = buildQuery({
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: cfg.scope.join(','), // 카카오는 콤마 구분 허용
    state,
  });
  return `https://kauth.kakao.com/oauth/authorize?${query}`;
}

/** Google Authorization Code 요청 URL 생성 (PKCE 미적용 기본 형태) */
export function buildGoogleAuthorizeUrl(state: string, baseUrlForRedirect: string) {
  ensureSocialEnv('google');
  const cfg = SOCIAL_LOGIN_CONFIG.google;
  const redirectUri = cfg.redirectUri(baseUrlForRedirect);
  const query = buildQuery({
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: cfg.scope.join(' '), // Google은 공백 구분
    access_type: 'offline',
    state,
    include_granted_scopes: 'true',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
}

/** 프로바이더별 redirectUri 반환 헬퍼 */
export function getRedirectUri(provider: SocialProvider, baseUrlForGoogle?: string) {
  const cfg = SOCIAL_LOGIN_CONFIG[provider];
  if (provider === 'google') {
    if (!baseUrlForGoogle) {
      throw new Error('Google redirectUri 생성에 baseUrlForGoogle 필요');
    }
    return cfg.redirectUri(baseUrlForGoogle);
  }
  return cfg.redirectUri('');
}

/** scopes를 UI 등에 노출하기 위한 헬퍼 */
export function getScopes(provider: SocialProvider): string[] {
  return [...SOCIAL_LOGIN_CONFIG[provider].scope];
}
