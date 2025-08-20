'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  // if (session) return router.back('/');
  if (session) {
    return (
      <div>
        {session.expires} {session.accessToken}
        <p>이름: {session.user?.name}</p>
        <p>프로바이더: {session.user?.provider}</p>
        <p>
          프로필 이미지: <img src={session.user?.image ?? ''} alt="profile" />
        </p>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-dvh flex-col items-center justify-center">
        <button onClick={() => signIn('kakao')}>카카오로 시작하기</button>
        <button onClick={() => signIn('naver')}>네이버로 시작하기</button>
        <button onClick={() => signIn('google')}>구글로 시작하기</button>
      </div>
    </div>
  );
}
