'use client';

import KakaoIcon from '@/assets/icons/sns/icon-16-kakao.svg';
import GoogleIcon from '@/assets/icons/sns/icon-16-google.svg';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const handleKakaoLogin = () => {
    signIn('kakao', { callbackUrl: '/' });
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };
  // test
  return (
    <div className="mt-40 flex w-full flex-col items-center gap-3 text-gray-900">
      <button
        onClick={handleKakaoLogin}
        className="flex w-full items-center justify-center gap-1 rounded-xs bg-amber-300 py-3 font-medium"
      >
        <KakaoIcon />
        <span>카카오로 시작하기</span>
      </button>
      <button
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-1 rounded-xs border border-gray-400 py-3 font-medium"
      >
        <GoogleIcon />
        <span>구글로 시작하기</span>
      </button>
    </div>
  );
}
