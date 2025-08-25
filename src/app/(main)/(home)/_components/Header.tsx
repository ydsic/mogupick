import Image from 'next/image';
import Link from 'next/link';

import logo from '../../../../../public/next.svg';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-yellow-50 md:left-1/2 md:w-[500px] md:-translate-x-1/2">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex flex-1 items-center gap-4 text-base font-bold">
          <Link href="/">
            <Image src={logo} alt="logo" width={64} height={64} />
          </Link>
          <div className="flex-1">
            <Link href="/search">
              <div className="w-full cursor-pointer">
                {/* search icon추가 해야함 */}
                <div className="w-full rounded-xs bg-[#f2f2f2] py-1.5 pr-4 pl-9 text-sm font-normal">
                  검색어를 입력하세요.
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex gap-2 py-1 pl-2">
          <Link href="/bell">알림</Link>
          <Link href="/cart">장바구니</Link>
        </div>
      </div>
    </header>
  );
}
