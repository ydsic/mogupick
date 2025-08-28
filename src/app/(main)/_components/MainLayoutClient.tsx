'use client';

import { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import Footer from '../(home)/_components/Footer';

interface MainLayoutClientProps {
  children: ReactNode;
}

const MAIN_ROUTES = ['/', '/categories', '/pick', '/subscribe/list', '/mypage'];
export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  const pathname = usePathname();

  // 메인 라우트의 직계 경로인 경우에만 헤더와 푸터를 표시
  const showHeaderFooter = MAIN_ROUTES.indexOf(pathname) !== -1;
  const onlyFooter = pathname.includes('/categories/');

  const HIDE_FOOTER_ROUTES = ['/categories/', '/footer숨길경로추가']; // 숨길 경로를 배열로 관리
  const hideFooter = HIDE_FOOTER_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <>
      <main className={`${showHeaderFooter ? 'pt-14 pb-14 md:pb-10' : ''} h-full overflow-y-auto`}>
        {children}
      </main>
      {!hideFooter && (showHeaderFooter || onlyFooter) && <Footer />}
    </>
  );
}
