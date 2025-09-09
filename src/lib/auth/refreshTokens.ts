interface JWTToken {
  accessToken: string;
  refreshToken: string;
  provider: string;
  accessTokenExpires: number;
  userId?: string;
  error?: string;
  [key: string]: any;
}

function reqEnv(name: string) {
  const v = process.env[name];
  if (!v || v.trim() === '') throw new Error(`[ENV] Missing: ${name}`);
  return v;
}

const GOOGLE_CLIENT_ID = reqEnv('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = reqEnv('GOOGLE_CLIENT_SECRET');
const KAKAO_CLIENT_ID = reqEnv('KAKAO_CLIENT_ID');
const KAKAO_CLIENT_SECRET = reqEnv('KAKAO_CLIENT_SECRET');
const NEXTAUTH_SECRET = reqEnv('NEXTAUTH_SECRET');

export async function refreshGoogleToken(token: JWTToken) {
  try {
    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const refreshedTokens = await res.json();
    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Google refresh error:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export async function refreshKakaoToken(token: JWTToken) {
  try {
    const url =
      'https://kauth.kakao.com/oauth/token?' +
      new URLSearchParams({
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const refreshedTokens = await res.json();
    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Kakao refresh error:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}
