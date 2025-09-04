import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

export const runtime = 'nodejs';

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

  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
