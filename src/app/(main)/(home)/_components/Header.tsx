import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-yellow-50 md:left-1/2 md:w-[500px] md:-translate-x-1/2">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex flex-1 items-center gap-4 text-base font-bold">
          <Image src="/next.svg" alt="logo" width={64} height={64} />
        </Link>
        <div className="flex gap-2 py-1 pl-2">
          <Link href="/bell">알림</Link>
          <Link href="/cart">장바구니</Link>
        </div>
      </div>
    </header>
  );
}
