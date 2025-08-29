import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

// 객체 구조 분해
const {
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLIENT_SECRET: googleClientSecret,
  KAKAO_CLIENT_ID: kakaoClientId,
  KAKAO_CLIENT_SECRET: kakaoClientSecret,
  NEXT_PUBLIC_API_URL: nextAuthSecret,
} = process.env;

// null/empty 안전 체크
const isValidString = (value: string | undefined): value is string =>
  value !== null && value !== undefined && value.trim() !== '';

if (!isValidString(googleClientId) || !isValidString(googleClientSecret)) {
  throw new Error('Google OAuth 환경 변수가 없습니다.');
}

if (!isValidString(kakaoClientId) || !isValidString(kakaoClientSecret)) {
  throw new Error('Kakao OAuth 환경 변수가 없습니다.');
}

if (!isValidString(nextAuthSecret)) {
  throw new Error('NEXT_PUBLIC_API_URL 환경 변수가 없습니다.');
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
    KakaoProvider({
      clientId: kakaoClientId,
      clientSecret: kakaoClientSecret,
    }),
  ],
  secret: nextAuthSecret,
  pages: {
    signIn: '/login', // 로그인 UI 직접 만들 경우
  },
});

export { handler as GET, handler as POST };
