import { refreshGoogleToken, refreshKakaoToken } from '@/lib/auth/refreshTokens';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

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

interface JWTToken {
  accessToken: string;
  refreshToken: string;
  provider: string;
  accessTokenExpires: number;
  userId?: string;
  error?: string;
  [key: string]: any;
}

interface AccountWithToken {
  access_token: string;
  refresh_token: string;
  provider: string;
  expires_in?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
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
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, account, user }): Promise<JWTToken> {
      const _token = token as JWTToken;

      // first sign-in
      if (account && user) {
        const a = account as unknown as AccountWithToken;
        _token.accessToken = a.access_token!;
        _token.refreshToken = a.refresh_token!;
        _token.provider = a.provider!;
        _token.accessTokenExpires = Date.now() + Number(a.expires_in ?? 3600) * 1000;
        // set userId from provider profile
        _token.userId = (user as any).sub ?? (user as any).id ?? _token.userId;
        return _token;
      }

      // set userId if present
      _token.userId = user ? ((user as any).sub ?? (user as any).id) : _token.userId;

      // if access token is still valid, return it
      if (Date.now() < (_token.accessTokenExpires ?? 0)) return _token;

      // refresh
      if (_token.provider === 'google') return await refreshGoogleToken(_token);
      if (_token.provider === 'kakao') return await refreshKakaoToken(_token);

      return _token;
    },

    async session({ session, token }) {
      const _session = session;
      const _token = token as JWTToken;

      (_session.user as any).id = _token.userId ?? (_token as any).sub ?? (_token as any).sub;
      (_session.user as any).accessToken = _token.accessToken;
      (_session.user as any).refreshToken = _token.refreshToken;
      (_session.user as any).provider = _token.provider;
      (session as any).error = _token.error;

      return _session;
    },
  },
};

