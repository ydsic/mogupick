'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'posting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const authKey = useMemo(
    () => searchParams.get('authKey') ?? searchParams.get('auth_key'),
    [searchParams],
  );
  const customerKey = useMemo(
    () => searchParams.get('customerKey') ?? searchParams.get('customer_key'),
    [searchParams],
  );

  useEffect(() => {
    // 성공 리다이렉트로 전달된 파라미터 확인
    if (!authKey) {
      setError('authKey가 없습니다. 결제가 정상적으로 완료되지 않았습니다.');
      return;
    }

    const postAuthKey = async () => {
      setStatus('posting');
      setError(null);
      try {
        const res = await fetch(
          'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/billing/payment-methods',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authKey }),
          },
        );

        // 응답이 JSON일 수도, 빈 응답일 수도 있으므로 안전하게 처리
        const text = await res.text();
        try {
          const json = text ? JSON.parse(text) : null;
        } catch {}

        setStatus('done');
      } catch (e) {
        console.error('[POST billing/payment-methods] 실패:', e);
        setError('서버로 전송 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    postAuthKey();
  }, [authKey, customerKey]);

  return (
    <div className="min-h-dvh px-4 py-20">
      <h1 className="mb-3 text-xl font-semibold">카드 등록 결과</h1>

      {!authKey && (
        <p className="text-sm text-red-600">authKey 파라미터가 없어 처리를 진행할 수 없습니다.</p>
      )}

      {authKey && (
        <div className="space-y-2 text-sm">
          <p>고객키: {customerKey ?? '-'}</p>
          <p>인증키(authKey): {authKey}</p>
          {status === 'posting' && <p className="text-gray-600">서버에 등록 요청 중...</p>}
          {status === 'done' && <p className="text-green-700">등록 요청이 완료되었습니다.</p>}
          {status === 'error' && <p className="text-red-600">오류가 발생했습니다.</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}

      <div className="mt-6">
        <button
          className="rounded-full border px-4 py-2 text-sm"
          onClick={() => router.push('/payments')}
        >
          결제 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
