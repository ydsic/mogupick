'use client';

import HeaderCustom from '@/components/HeaderCustom';
import { useRouter } from 'next/navigation';

export default function EditPage() {
  const router = useRouter();
  return (
    <div className="min-h-dvh bg-gray-100">
      <HeaderCustom title="옵션 설정" showClose onClose={() => router.back()} />
      <div className="my-4 px-4 py-14">
        <div>
          <h2 className="text-2xl font-bold">원하는 배송주기를 선택해주세요</h2>
          <div>
            <div>
              <h3>빠른 주기 선택</h3>
              <ul>
                <li>
                  <button>1주 마다</button>
                </li>
                <li>
                  <button>2주 마다</button>
                </li>
                <li>
                  <button>3주 마다</button>
                </li>
                <li>
                  <button>4주 마다</button>
                </li>
                <li>
                  <button>1달</button>
                </li>
                <li>
                  <button>2달</button>
                </li>
                <li>
                  <button>3달</button>
                </li>
              </ul>
            </div>
            <div>
              <h3>원하는 주기 선택</h3>
              <div></div>
              <div>
                <span>1달에 한 번 </span>배송됩니다.
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">배송 희망일을 선택해주세요</h2>
          <div>
            <div>캘린더 구역</div>
            <div>
              <span>14일</span>에 첫 배송 예정입니다.
            </div>
          </div>
        </div>
        <div>
          <button>옵션설정 완료</button>
        </div>
      </div>
    </div>
  );
}
