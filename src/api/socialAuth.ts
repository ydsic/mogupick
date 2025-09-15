import { SOCIAL_LOGIN_CONFIG, type SocialProvider } from '@/lib/config';

// 타입들을 re-export
export type { SocialProvider };

export interface SocialLoginRequest {
  provider: SocialProvider;
  accessToken: string;
  baseUrl?: string;
}

export interface SocialLoginResponse {
  id: string;
  name: string;
  email: string;
  // 추가 응답 필드들은 API 응답에 따라 수정
}

/**
 * 소셜 로그인 API 요청
 * @param params - 소셜 로그인 요청 파라미터
 * @returns 소셜 로그인 응답 데이터
 */
export async function socialLogin(params: SocialLoginRequest): Promise<SocialLoginResponse> {
  const { provider, accessToken, baseUrl = window.location.origin } = params;

  const config = SOCIAL_LOGIN_CONFIG[provider];

  // 기본 요청 데이터
  const socialLoginData: any = {
    provider,
    accessToken,
    clientId: config.clientId,
    scope: config.scope,
    redirectUri: config.redirectUri(baseUrl),
  };

  // Kakao 전용 설정값 추가
  if (provider === 'kakao') {
    const kakaoConfig = config as any;
    socialLoginData.clientAuthenticationMethod = kakaoConfig.clientAuthenticationMethod;
    socialLoginData.authorizationGrantType = kakaoConfig.authorizationGrantType;
    socialLoginData.clientName = kakaoConfig.clientName;
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080';

  const response = await fetch(`${apiBaseUrl}/api/v1/auth/social-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(socialLoginData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Google 소셜 로그인
 */
export async function googleSocialLogin(accessToken: string, baseUrl?: string) {
  return socialLogin({ provider: 'google', accessToken, baseUrl });
}

/**
 * Kakao 소셜 로그인
 */
export async function kakaoSocialLogin(accessToken: string, baseUrl?: string) {
  return socialLogin({ provider: 'kakao', accessToken, baseUrl });
}
