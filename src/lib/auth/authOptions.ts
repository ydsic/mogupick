import { refreshGoogleToken, refreshKakaoToken } from '@/lib/auth/refreshTokens';
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
  userId?: string;
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

function reqEnv(name: string) {
  const v = process.env[name];
  if (!v || v.trim() === '') throw new Error(`[ENV] Missing: ${name}`);
  return v;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline', // refresh_token 발급
          response_type: 'code',
        },
      },
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
    async jwt({ token, account, user }): Promise<JWTToken> {
      console.log('JWT callback token:', token); // 서버로그에서 토큰 발급 시점 확인

      const _token = token as JWTToken;
      // 최초 로그인시
      if (account && user) {
        const a = account as AccountWithToken;
        _token.accessToken = a.access_token!;
        _token.refreshToken = a.refresh_token!;
        _token.provider = a.provider!;
        _token.accessTokenExpires = Date.now() + Number(a.expires_in ?? 3600) * 1000;
        return _token;
      }

      // userId 저장 (Google: sub, Kakao: id)
      _token.userId = user ? ((user as any).sub ?? (user as any).id) : _token.userId;

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

      _session.user.id = _token.userId ?? _token.sub ?? _token.sub; // 세션에 id 넣기
      _session.user.accessToken = _token.accessToken;
      _session.user.refreshToken = _token.refreshToken;
      _session.user.provider = _token.provider;
      _session.error = _token.error;

      return _session;
    },
  },
};
