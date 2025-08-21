'use client';

import Image from 'next/image';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function SocialPage() {
  const { data: session } = useSession();

  console.warn('session', session);

  if (session?.user !== null && session?.user !== undefined) {
    return (
      <div>
        <p>만료: {session.expires}</p>
        <p>AccessToken: {session.accessToken}</p>
        <p>이름: {session.user.name ?? '알 수 없음'}</p>
        <p>프로바이더: {session.user.provider ?? '알 수 없음'}</p>
        <p>
          프로필 이미지:{' '}
          {session.user.image !== null &&
          session.user.image !== undefined &&
          session.user.image !== '' ? (
            <Image src={session.user.image} alt="profile" width={80} height={80} />
          ) : (
            '없음'
          )}
        </p>
        <button onClick={() => void signOut()}>로그아웃</button>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2">
      <button onClick={() => void signIn('kakao')}>카카오로 시작하기</button>
      <button onClick={() => void signIn('google')}>구글로 시작하기</button>
    </div>
  );
}
