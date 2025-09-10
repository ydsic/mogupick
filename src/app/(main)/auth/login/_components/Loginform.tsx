'use client';

import { signIn, useSession } from 'next-auth/react';
import KakaoIcon from '@/assets/icons/sns/icon-16-kakao.svg';
import GoogleIcon from '@/assets/icons/sns/icon-16-google.svg';
import { buildUrl } from '@/lib/config';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { authFetch } from '@/lib/authFetch';
import Link from 'next/link';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { data: session } = useSession();

  // 전략 A: Spring OAuth -> 프론트 도메인 콜백
  // 1) 카카오/구글 개발자 콘솔 redirect URI 를 반드시
  //    https://<프론트도메인>/login/oauth2/code/{provider}
  //    로 등록
  // 2) Spring 설정 (application.yml) 예시
  //    spring.security.oauth2.client.registration.kakao.redirect-uri=https://<프론트도메인>/login/oauth2/code/kakao
  //    spring.security.oauth2.client.registration.google.redirect-uri=https://<프론트도메인>/login/oauth2/code/google
  // 3) next.config.ts 에 /login/oauth2/** rewrite 추가 (이미 적용)
  // 4) 백엔드 OAuth success handler 에서 최종 리다이렉트 (예: /auth/login/success?jwt=..) 로 보내도록 구현 필요

  // TODO: 성공 후 백엔드가 프론트로 jwt, refresh 등을 쿼리나 해시 혹은 httpOnly 쿠키로 전달하면
  //       여기서 파싱/저장 로직 추가

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
