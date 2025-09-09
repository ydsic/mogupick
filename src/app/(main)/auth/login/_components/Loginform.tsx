'use client';

import { signIn, useSession } from 'next-auth/react';
import KakaoIcon from '@/assets/icons/sns/icon-16-kakao.svg';
import GoogleIcon from '@/assets/icons/sns/icon-16-google.svg';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { authFetch } from '@/lib/authFetch';
import Link from 'next/link';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { data: session } = useSession();

  // 소셜로그인 된 후, 바로 백엔드에 api전송
  // useEffect(() => {
  //   if (session?.user.accessToken && session.user.provider) {
  //     const body = {
  //       provider: session.user.provider,
  //       accessToken: session.user.accessToken,
  //     };

  //     authFetch('/auth/social-login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(body),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         alert(`JWT 발급 결과: ${data}`);
  //         // TODO: localStorage, zustand 등에 저장
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // }, []);

  return (
    <div className="mt-40 flex w-full flex-col items-center gap-3 text-gray-900">
      <Link
        href={'http://xn--hy1b12lfh85nbqam9ry5f/oauth2/authorization/kakao'}
        // onClick={() => void signIn('kakao', { callbackUrl })}
        className="flex w-full items-center justify-center gap-1 rounded-xs bg-amber-300 py-3 font-medium"
      >
        <KakaoIcon />
        <span>카카오로 시작하기</span>
      </Link>
      <Link
        href={'http://xn--hy1b12lfh85nbqam9ry5f/oauth2/authorization/google'}
        // onClick={() => void signIn('google', { callbackUrl })}
        className="flex w-full items-center justify-center gap-1 rounded-xs border border-gray-400 py-3 font-medium"
      >
        <GoogleIcon />
        <span>구글로 시작하기</span>
      </Link>
    </div>
  );
}
