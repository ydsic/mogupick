'use client';

import KakaoIcon from '@/assets/icons/sns/icon-16-kakao.svg';
import GoogleIcon from '@/assets/icons/sns/icon-16-google.svg';
import { buildUrl } from '@/lib/config';

export default function LoginForm() {
  return (
    <div className="mt-40 flex w-full flex-col items-center gap-3 text-gray-900">
      <button
        onClick={() => {
          window.location.href = buildUrl('/oauth2/authorization/kakao', 'oauth');
        }}
        className="flex w-full items-center justify-center gap-1 rounded-xs bg-amber-300 py-3 font-medium"
      >
        <KakaoIcon />
        <span>카카오로 시작하기</span>
      </button>
      <button
        onClick={() => {
          window.location.href = buildUrl('/oauth2/authorization/google', 'oauth');
        }}
        className="flex w-full items-center justify-center gap-1 rounded-xs border border-gray-400 py-3 font-medium"
      >
        <GoogleIcon />
        <span>구글로 시작하기</span>
      </button>
    </div>
  );
}
