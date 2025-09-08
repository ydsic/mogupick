'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '../(home)/_components/Footer';
import { useSession } from 'next-auth/react';

interface MainLayoutClientProps {
  children: ReactNode;
}

const MAIN_ROUTES = ['/', '/categories', '/pick', '/subscribe', '/mypage'];

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);
  const { data: session } = useSession();

  // 확인용
  useEffect(() => {
    console.log('client session', session);
  }, [session]);

  useEffect(() => {
    const el = mainRef.current ?? document.querySelector('main');
    if (el && 'scrollTo' in el) {
      (el as HTMLElement).scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]);

  const showHeader = MAIN_ROUTES.indexOf(pathname) !== -1;

  const HIDE_FOOTER_ROUTES = ['/categories/', '/footer숨길경로추가'];
  const hideFooter = HIDE_FOOTER_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <>
      <div>{session ? '로그인 됌' : '로그인 필요'}</div>
      <main
        ref={mainRef}
        className={`${showHeader ? 'pt-14 pb-14 md:pb-18' : ''} h-full overflow-y-auto`}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
