import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0 z-50 bg-yellow-50 md:left-1/2 md:w-[500px] md:-translate-x-1/2">
      <nav className="flex h-15 items-center justify-around py-2.5">
        <Link
          href="/"
          className="hover:text-primary text-primary flex flex-col items-center text-xs font-semibold transition"
        >
          <span>홈</span>
        </Link>
        <Link
          href="/categories"
          className="hover:text-primary flex flex-col items-center text-xs font-medium transition"
        >
          <span>카테고리</span>
        </Link>
        <Link
          href="/pick"
          className="hover:text-primary flex flex-col items-center text-xs font-medium transition"
        >
          <span>찜</span>
        </Link>
        <Link
          href="/subscribe"
          className="hover:text-primary flex flex-col items-center text-xs font-medium transition"
        >
          <span>구독</span>
        </Link>
        <Link
          href="/mypage"
          className="hover:text-primary flex flex-col items-center text-xs font-medium transition"
        >
          <span>마이페이지</span>
        </Link>
      </nav>
    </footer>
  );
}
