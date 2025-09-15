'use client';

import Link from 'next/link';
import HeaderCustom from '@/components/HeaderCustom';
import ReviewIcon from '@/assets/icons/mypage/review.svg';
import AddressIcon from '@/assets/icons/mypage/gps.svg';
import ArrowIcon from '@/assets/icons/mypage/right-arrow.svg';
import { signOut } from 'next-auth/react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/utils/useAuth';
import { useEffect, useState } from 'react';
import { SOCIAL_LOGIN_CONFIG, type SocialProvider } from '@/lib/config';
import { kakaoSocialLogin } from '@/api/socialAuth';
import { useAuthStore } from '@/store/useAuthStore';

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

interface UserData {
  id: string;
  name: string;
  email: string;
  // 추가 필드들은 API 응답에 따라 수정
}

export default function MyPagePage() {
  const { session, logout, accessToken } = useAuth();
  const setProfile = useAuthStore((s) => s.setProfile);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 요청 함수
  const fetchUserData = async () => {
    if (!session?.user?.accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 소셜 로그인 API 함수 사용
      const data = await kakaoSocialLogin(session.user.accessToken);
      setUserData(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 세션이 있을 때 API 요청
  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchUserData();
    }
  }, [session?.user?.accessToken]);

  // 추가: 마이페이지 진입 시 /members/me 호출하여 콘솔 출력 + 프로필 저장
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/members/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('[MY PAGE] /members/me error:', res.status, text);
          return;
        }

        const json = await res.json();
        const d = json?.data || json; // 응답 포맷 유연 처리
        if (d?.email || d?.name) {
          setProfile({
            email: d.email,
            name: d.name,
            nickname: d.nickname ?? null,
            provider: d.provider ?? null,
          });
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('[MY PAGE] /members/me fetch failed:', err);
      }
    })();

    return () => controller.abort();
  }, [accessToken, setProfile]);

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
    { title: '로그아웃', onClick: logout },
  ];

  return (
    <ProtectedRoute>
      <div className="bg-white">
        <HeaderCustom title="마이페이지" showSearch showCart />

        <div>
          {/* API 요청 상태 표시 */}
          {loading && (
            <div className="p-4 text-center text-blue-600">사용자 정보를 불러오는 중...</div>
          )}

          {error && (
            <div className="p-4 text-center text-red-600">
              {error}
              <button onClick={fetchUserData} className="ml-2 text-blue-600 underline">
                다시 시도
              </button>
            </div>
          )}

          {userData && (
            <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900">API 응답 데이터:</h3>
              <pre className="mt-2 overflow-x-auto text-sm text-blue-800">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}

          {/* 프로필 섹션 */}
          <div className="flex flex-col gap-5 p-4">
            {/* 사용자 정보 */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[#d9d9d9]"></div>
              <div className="flex w-36 flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-[#434343]">
                    {userData?.name || session?.user?.name || 'User Name'}
                  </span>
                  <ArrowIcon />
                </div>
                <div className="flex w-50 items-center gap-3">
                  <Link href="/review" className="flex items-center gap-1">
                    <ReviewIcon />
                    <span className="text-xs font-medium text-[#6f6f6f]">리뷰관리</span>
                  </Link>
                  <div className="h-3 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1">
                    <AddressIcon />
                    <span className="text-xs font-medium text-[#6f6f6f]">주소관리</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="flex flex-col gap-4 rounded-lg bg-green-50 px-4 py-8">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">🗓️</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#575757]">
                    가장 오래 구독한 기간은
                  </span>
                  <span className="text-lg font-semibold text-[#242424]">
                    {userStats.longestSubscription}개월
                  </span>
                  <span className="text-sm font-medium text-[#575757]">이에요.</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">💬</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#575757]">
                    지금까지 작성한 리뷰 수는
                  </span>
                  <span className="text-lg font-semibold text-[#242424]">
                    {userStats.reviewCount}개
                  </span>
                  <span className="text-sm font-medium text-[#575757]">에요.</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">🎁</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#575757]">모구픽과</span>
                  <span className="text-lg font-semibold text-[#242424]">
                    {userStats.totalMonths}개월
                  </span>
                  <span className="text-sm font-medium text-[#575757]">동안 함께했어요.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="py-4">
            <div className="h-px bg-[#f2f2f2]"></div>
          </div>

          {/* 고객 지원 섹션 */}
          <div className="px-4">
            <div className="flex flex-col gap-5">
              <span className="text-sm font-medium text-[#a6a6a6]">고객 지원</span>
              <div className="flex flex-col gap-7">
                {customerSupportItems.map((item, index) =>
                  item.href ? (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-left text-base font-medium text-[#434343]"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="text-left text-base font-medium text-[#434343]"
                    >
                      {item.title}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
