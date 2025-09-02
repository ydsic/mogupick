'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

import MoguPickLogo from '@/assets/icons/mogupick.png';
import BackIcon from '@/assets/icons/common/back-32px.svg';
import HomeIcon from '@/assets/icons/common/main-home-32px.svg';
import SearchIcon from '@/assets/icons/common/search-32px.svg';
import CartIcon from '@/assets/icons/common/shoppingcart-32px.svg';
import CloseIcon from '@/assets/icons/common/close-32px.svg';
import BellIcon from '@/assets/icons/common/bell.svg';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showClose?: boolean;
  showBell?: boolean;
  showLogo?: boolean;
  onClose?: () => void;
  rightCustom?: ReactNode; // 커스텀 우측 요소
}

export default function HeaderCustom({
  title,
  showLogo = false,
  showBack = false,
  showHome = false,
  showSearch = false,
  showCart = false,
  showClose = false,
  showBell = false,
  onClose,
  rightCustom,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white md:left-1/2 md:w-[500px] md:-translate-x-1/2">
      <div className="relative flex h-14 items-center justify-between px-4">
        {/* 왼쪽 */}
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={() => router.back()}>
              <BackIcon />{' '}
            </button>
          )}
          {showLogo && (
            <Link href="/">
              {/* 로고는 왼쪽에 표시됩니다 */}
              <Image src={MoguPickLogo} alt="MoguPick" width={80} height={21} />
            </Link>
          )}
          {title && <span className="text-lg font-semibold">{title}</span>}
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-3">
          {showHome && (
            <Link href="/">
              <HomeIcon />
            </Link>
          )}
          {showSearch && (
            <button>
              <SearchIcon />
            </button>
          )}
          {showBell && (
            <button onClick={onClose}>
              <BellIcon />
            </button>
          )}
          {showCart && (
            <Link href="/cart">
              <CartIcon />
            </Link>
          )}
          {showClose && (
            <button onClick={onClose}>
              <CloseIcon />
            </button>
          )}
          {rightCustom}
        </div>
      </div>
    </header>
  );
}
