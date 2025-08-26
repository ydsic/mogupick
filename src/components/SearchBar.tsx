import Link from 'next/link';

import SearchIcon from '@/assets/icons/common/search-32px.svg';

export default function SearchBar() {
  return (
    <div className="flex-1">
      <Link href="/search">
        <div className="relative cursor-pointer">
          <div className="w-full rounded-full bg-[#f7f7f7] px-4 py-3 text-sm font-normal text-[#7E8082]">
            매번 사는 그 상품, 구독으로 받기
          </div>
          <div className="absolute top-2 right-4">
            <SearchIcon />
          </div>
        </div>
      </Link>
    </div>
  );
}
