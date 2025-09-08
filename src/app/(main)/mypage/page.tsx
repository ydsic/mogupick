'use client';

import Link from 'next/link';
import HeaderCustom from '@/components/HeaderCustom';
import ReviewIcon from '@/assets/icons/mypage/review.svg';
import AddressIcon from '@/assets/icons/mypage/gps.svg';
import ArrowIcon from '@/assets/icons/mypage/right-arrow.svg';

interface UserStats {
  longestSubscription: number;
  reviewCount: number;
  totalMonths: number;
}

interface MenuItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

export default function MyPagePage() {
  const userStats: UserStats = {
    longestSubscription: 12,
    reviewCount: 8,
    totalMonths: 23,
  };

  const customerSupportItems: MenuItem[] = [
    { title: '고객센터', href: '/support' },
    { title: '공지사항', href: '/notice' },
    { title: '1:1 문의', href: '/inquiry' },
    { title: '자주 묻는 질문', href: '/faq' },
    { title: '로그아웃', onClick: handleLogout },
  ];

  function handleLogout() {
    console.log('로그아웃 처리');
  }

  return (
    <div className="bg-white">
      <HeaderCustom title="마이페이지" showSearch showCart />

      <div>
        {/* 프로필 섹션 */}
        <div className="flex flex-col gap-5 p-4">
          {/* 사용자 정보 */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-300"></div>
            <div className="flex w-36 flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-black">User Name</span>
                <ArrowIcon />
              </div>
              <div className="flex w-50 items-center gap-3">
                <Link href="/review" className="flex items-center gap-1">
                  <ReviewIcon />
                  <span className="text-xs font-medium text-gray-600">리뷰관리</span>
                </Link>
                <div className="h-3 w-px bg-gray-300"></div>
                <div className="flex items-center gap-1">
                  <AddressIcon />
                  <span className="text-xs font-medium text-gray-600">주소관리</span>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="flex flex-col gap-4 rounded-lg bg-green-50 px-4 py-8">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">🗓️</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">가장 오래 구독한 기간은</span>
                <span className="text-lg font-semibold text-black">
                  {userStats.longestSubscription}개월
                </span>
                <span className="text-sm font-medium text-gray-700">이에요.</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">💬</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">지금까지 작성한 리뷰 수는</span>
                <span className="text-lg font-semibold text-black">{userStats.reviewCount}개</span>
                <span className="text-sm font-medium text-gray-700">에요.</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">🎁</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">모구픽과</span>
                <span className="text-lg font-semibold text-black">
                  {userStats.totalMonths}개월
                </span>
                <span className="text-sm font-medium text-gray-700">동안 함께했어요.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="py-4">
          <div className="h-px bg-gray-200"></div>
        </div>

        {/* 고객 지원 섹션 */}
        <div className="px-4">
          <div className="flex flex-col gap-5">
            <span className="text-sm font-medium text-gray-600">고객 지원</span>
            <div className="flex flex-col gap-7">
              {customerSupportItems.map((item, index) => (
                item.href ? (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-left text-base font-medium text-black"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="text-left text-base font-medium text-black"
                  >
                    {item.title}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
