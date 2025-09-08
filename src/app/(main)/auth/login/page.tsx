import Image from 'next/image';
import mogupickLogo from '@/assets/icons/mogupick.png';

import LoginForm from './_components/Loginform';
import HeaderCustom from '@/components/HeaderCustom';
import { redirect } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default async function Page() {
  const session = await getSession();
  console.log('session', session);

  // if (session) {
  //   redirect('/');
  // }

  return (
    <div className="flex h-full flex-col items-center justify-start gap-2">
      <HeaderCustom showBack showHome />
      <div className="my-14 flex min-h-0 w-full flex-1 flex-col px-4">
        {/* 상단 브랜딩 영역 */}
        <div className="mt-6 flex flex-col gap-3">
          <h2 className="text-2xl font-extrabold">
            구독으로 채우는
            <br /> 나의 새로운 일상!
          </h2>

          <Image src={mogupickLogo} alt="Mogupick Logo" className="w-32" />
          <p className="text-base text-gray-500">서비스 이용을 위해 로그인/회원가입을 해주세요.</p>
        </div>

        {/* 로그인 폼 */}
        <LoginForm />

        <div className="mt-16 flex justify-center gap-3 text-xs font-medium underline">
          <span>계정 찾기</span>
          <span>비밀번호 변경</span>
          <span>문의하기</span>
        </div>
      </div>
    </div>
  );
}
