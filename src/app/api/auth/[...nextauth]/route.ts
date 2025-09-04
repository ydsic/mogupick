import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

// 객체 구조 분해
const {
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLIENT_SECRET: googleClientSecret,
  KAKAO_CLIENT_ID: kakaoClientId,
  KAKAO_CLIENT_SECRET: kakaoClientSecret,
  NEXTAUTH_URLS: nextAuthUrlsRaw,
} = process.env;

// 여러 도메인 지원: 쉼표로 구분된 환경변수에서 현재 호스트와 일치하는 값 선택
const getCurrentDomain = () => {
  if (!nextAuthUrlsRaw) return undefined;
  const urls = nextAuthUrlsRaw
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
  if (typeof window !== 'undefined') {
    const current = window.location.origin;
    return urls.find((url) => current.startsWith(url)) || urls[0];
  } else if (process.env.VERCEL_URL) {
    return urls.find((url) => url.includes(process.env.VERCEL_URL!)) || urls[0];
  }

  return urls[0];
};
const nextAuthSecret = getCurrentDomain();

const isValidString = (value: string | undefined): value is string =>
  value !== null && value !== undefined && value.trim() !== '';

if (!isValidString(googleClientId) || !isValidString(googleClientSecret)) {
  throw new Error('Google OAuth 환경 변수가 없습니다.');
}

if (!isValidString(kakaoClientId) || !isValidString(kakaoClientSecret)) {
  throw new Error('Kakao OAuth 환경 변수가 없습니다.');
}

if (!isValidString(nextAuthSecret)) {
  throw new Error('NEXTAUTH_URLS 환경 변수가 없습니다.');
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
