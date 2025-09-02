'use client';

import { signIn } from 'next-auth/react';
import KakaoIcon from '@/assets/icons/sns/icon-16-kakao.svg';
import GoogleIcon from '@/assets/icons/sns/icon-16-google.svg';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="mt-40 flex w-full flex-col items-center gap-3 text-gray-900">
      <button
        onClick={() => void signIn('kakao', { callbackUrl })}
        className="flex w-full items-center justify-center gap-1 rounded-xs bg-amber-300 py-3 font-medium"
      >
        <KakaoIcon />
        <span>카카오로 시작하기</span>
      </button>
      <button
        onClick={() => void signIn('google', { callbackUrl })}
        className="flex w-full items-center justify-center gap-1 rounded-xs border border-gray-400 py-3 font-medium"
      >
        <GoogleIcon />
        <span>구글로 시작하기</span>
      </button>
    </div>
  );
}
