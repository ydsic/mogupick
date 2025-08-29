'use client';

import Link from 'next/link';
import Image from 'next/image';
import mogupickLogo from '@/assets/icons/mogupick.png';
import { usePathname, useRouter } from 'next/navigation';
import { categoryMap } from '@/constants/categories';

interface HeaderProps {
  categoryName?: string;
}

export default function Header({ categoryName }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const headerTagStyle =
    'fixed top-0 right-0 left-0 z-50 md:left-1/2 md:w-[500px] md:-translate-x-1/2';
  const divTagStyle = 'relative flex h-14 items-center justify-between px-4';

  const displayName = categoryMap[categoryName ?? ''] ?? '카테고리 설명';

  if (pathname === '/') {
    return (
      <header className={`${headerTagStyle}`}>
        <div className={`${divTagStyle}`}>
          <Link href="/" className="flex flex-1 items-center gap-4 text-base font-bold">
            <Image src={mogupickLogo} alt="Mogupick Logo" className="h-8 w-20" />
          </Link>
          <div className="flex gap-2 py-1 pl-2">
            <Link href="/bell">알림</Link>
            <Link href="/cart">장바구니</Link>
          </div>
        </div>
      </header>
    );
  } else if (pathname.startsWith('/categories/')) {
    return (
      <header className={`${headerTagStyle}`}>
        <div className={`${divTagStyle}`}>
          <button
            type="button"
            className="text-xs font-bold hover:underline"
            onClick={() => router.back()}
          >
            뒤로가기
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-black">
            {displayName}
          </span>
          <div className="flex gap-3">
            <span className="text-xs text-gray-500">검색</span>
            <span className="text-xs text-gray-500">장바구니</span>
          </div>
        </div>
      </header>
    );
  }
}
