import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

const GOOGLE_CLIENT_ID = reqEnv('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = reqEnv('GOOGLE_CLIENT_SECRET');
const KAKAO_CLIENT_ID = reqEnv('KAKAO_CLIENT_ID');
const KAKAO_CLIENT_SECRET = reqEnv('KAKAO_CLIENT_SECRET');
const NEXTAUTH_SECRET = reqEnv('NEXTAUTH_SECRET');

interface JWTToken {
  accessToken: string;
  refreshToken: string;
  provider: string;
  accessTokenExpires: number;
  error?: string;
  [key: string]: any;
}

// Account 확장 타입
interface AccountWithToken {
  access_token: string;
  refresh_token: string;
  provider: string;
  expires_in?: number;
}

export const runtime = 'nodejs';

function reqEnv(name: string) {
  const v = process.env[name];
  if (!v || v.trim() === '') throw new Error(`[ENV] Missing: ${name}`);
  return v;
}

/** -------------------------------
 *  Refresh token helpers
 *  나중에 소셜로그인이 늘어날 경우 코드 분리
 * ------------------------------- */
async function refreshGoogleToken(token: JWTToken) {
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

async function refreshKakaoToken(token: JWTToken) {
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

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: KAKAO_CLIENT_ID,
      clientSecret: KAKAO_CLIENT_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account }): Promise<JWTToken> {
      console.log('JWT callback token:', token); // 서버로그에서 토큰 발급 시점 확인

      const _token = token as JWTToken;

      if (account) {
        const a = account as AccountWithToken;
        _token.accessToken = a.access_token!;
        _token.refreshToken = a.refresh_token!;
        _token.provider = a.provider!;
        _token.accessTokenExpires = Date.now() + Number(a.expires_in ?? 3600) * 1000;
        return _token;
      }

      // 토큰 만료 여부 확인
      if (Date.now() < (_token.accessTokenExpires ?? 0)) return _token;

      // 토큰 갱신
      if (_token.provider === 'google') return await refreshGoogleToken(_token);
      if (_token.provider === 'kakao') return await refreshKakaoToken(_token);

      return _token;
    },

    async session({ session, token }) {
      const _session = session;
      const _token = token as JWTToken;

      _session.user.accessToken = _token.accessToken;
      _session.user.refreshToken = _token.refreshToken;
      _session.user.provider = _token.provider;
      _session.error = _token.error;

      return _session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
