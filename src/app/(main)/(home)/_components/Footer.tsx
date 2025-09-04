'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import HomeIcon from '@/assets/icons/common/home-24px.svg';
import HomeActiveIcon from '@/assets/icons/common/home-active-24px.svg';
import CategoryIcon from '@/assets/icons/common/category-24px.svg';
import CategoryActiveIcon from '@/assets/icons/common/category-active-24px.svg';
import HeartIcon from '@/assets/icons/common/like-24px.svg';
import HeartActiveIcon from '@/assets/icons/common/heart-active-24px.svg';
import SubscriptionIcon from '@/assets/icons/common/subscription-24px.svg';
import SubscriptionActiveIcon from '@/assets/icons/common/hand-active-24px.svg';
import UserIcon from '@/assets/icons/common/user-24px.svg';
import UserActiveIcon from '@/assets/icons/common/user-active-24px.svg';

interface FooterLinkProps {
  href: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  ActiveIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

function FooterLink({ href, label, Icon, ActiveIcon }: FooterLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center text-xs font-medium transition ${
        isActive ? 'text-primary' : 'text-gray-600'
      }`}
    >
      {isActive ? <ActiveIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
      <span className="mt-1">{label}</span>
    </Link>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // Footer를 숨길 페이지들
  const hiddenPages = ['/cart', '/alert', '/payments', '/payments/success'];

  if (hiddenPages.includes(pathname)) {
    return null;
  }

  return (
    <footer className="fixed right-0 bottom-0 left-0 z-50 bg-white md:left-1/2 md:w-[500px] md:-translate-x-1/2">
      <nav className="flex h-15 items-center justify-around py-2.5">
        <FooterLink href="/" label="홈" Icon={HomeIcon} ActiveIcon={HomeActiveIcon} />
        <FooterLink
          href="/categories"
          label="카테고리"
          Icon={CategoryIcon}
          ActiveIcon={CategoryActiveIcon}
        />
        <FooterLink href="/pick" label="찜" Icon={HeartIcon} ActiveIcon={HeartActiveIcon} />
        <FooterLink
          href="/subscribe"
          label="구독"
          Icon={SubscriptionIcon}
          ActiveIcon={SubscriptionActiveIcon}
        />
        <FooterLink href="/mypage" label="마이페이지" Icon={UserIcon} ActiveIcon={UserActiveIcon} />
      </nav>
    </footer>
  );
}
