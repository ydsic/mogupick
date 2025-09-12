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
import SettingIcon from '@/assets/icons/alert/setting.svg';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showClose?: boolean;
  showBell?: boolean;
  showLogo?: boolean;
  showSetting?: boolean;
  bgYellow?: boolean;
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
  showSetting = false,
  bgYellow = false,
  onClose,
  rightCustom,
}: HeaderProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const goMyPage = () => {
    if (isLoggedIn) router.push('/mypage');
    else router.push('/auth/credential');
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 md:left-1/2 md:w-[500px] md:-translate-x-1/2 ${
        bgYellow ? 'bg-[#F9C927]' : 'bg-white'
      }`}
    >
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
          <button onClick={goMyPage} aria-label="마이페이지" className="flex items-center">
            <HomeIcon />
          </button>
          {showHome && (
            <Link href="/">
              <HomeIcon />
            </Link>
          )}
          {showSearch && (
            <Link href="/search">
              <SearchIcon />
            </Link>
          )}
          {showBell && (
            <Link href="/alert">
              <BellIcon />
            </Link>
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
          {showSetting && (
            <button onClick={onClose}>
              <SettingIcon />
            </button>
          )}
          {rightCustom}
        </div>
      </div>
    </header>
  );
}
