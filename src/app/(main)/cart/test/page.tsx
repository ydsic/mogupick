'use client';

import React, { useState } from 'react';
import HeaderCustom from '@/components/HeaderCustom';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/api/client';

export default function CartApiTestPage() {
  const { memberId, accessToken } = useAuthStore();

  // 하드코딩된 페이로드 (필요시 아래 값만 수정)
  const payload = {
    productId: 5,
    subscriptionOptionId: 10,
    firstDeliveryDate: '2025-09-11',
  } as const;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 로그인 API와 동일한 방식 (getApiBaseUrl + fetch)
  const sendLikeLogin = async () => {
    setError(null);
    setResult(null);

    if (!memberId) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);

      const { getApiBaseUrl } = await import('@/lib/config');
      const base = getApiBaseUrl(); // '/proxy/api/v1'
      const url = `${base}/carts`;

      const body = {
        productId: payload.productId,
        subscriptionOptionId: payload.subscriptionOptionId,
        firstDeliveryDate: payload.firstDeliveryDate,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `요청 실패 (status: ${res.status})`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      console.error('[Test] 로그인식 실패:', e);
      setError(e?.message || '로그인식 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  // apiFetch를 사용한 정석적인 방식
  const sendWithApiFetch = async () => {
    setError(null);
    setResult(null);

    if (!memberId) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);

      const body = {
        productId: payload.productId,
        subscriptionOptionId: payload.subscriptionOptionId,
        firstDeliveryDate: payload.firstDeliveryDate,
      };

      const data = await apiFetch('/carts', 'POST', { body });
      setResult(data);
    } catch (e: any) {
      console.error('[Test] apiFetch 실패:', e);
      setError(e?.message || 'apiFetch 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  // 기존 직접 fetch 방식
  const send = async () => {
    setError(null);
    setResult(null);

    if (!memberId) {
      setError('로그인이 필요합니다.');
      return;
    }
    if (!accessToken) {
      setError('accessToken이 없습니다. 로그인 상태를 확인하세요.');
      return;
    }

    try {
      setLoading(true);

      const url = 'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/carts';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: payload.productId,
          subscriptionOptionId: payload.subscriptionOptionId,
          firstDeliveryDate: payload.firstDeliveryDate,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `요청 실패 (status: ${res.status})`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e?.message || '요청 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 min-h-dvh bg-white text-neutral-900">
      <HeaderCustom title="장바구니 API 테스트" showBack showHome showSearch showCart />
      <main className="space-y-4 p-4">
        {/* 로그인 방식 테스트 */}
        <div className="rounded border border-purple-200 p-3 text-sm">
          <div className="mb-2 font-medium text-purple-700">
            로그인 API 방식 (getApiBaseUrl + fetch)
          </div>
          <div className="mb-2 text-xs text-gray-600">
            POST /proxy/api/v1/carts (useAuthStore.login과 동일한 패턴)
          </div>
          <pre className="rounded bg-neutral-50 p-2 text-xs break-all whitespace-pre-wrap">{`
Authorization: Bearer <accessToken> (수동)
Content-Type: application/json

{
  "productId": ${payload.productId},
  "subscriptionOptionId": ${payload.subscriptionOptionId},
  "firstDeliveryDate": "${payload.firstDeliveryDate}"
}`}</pre>
          <button
            onClick={sendLikeLogin}
            disabled={loading}
            className="mt-3 h-10 w-full rounded bg-purple-600 text-white disabled:opacity-50"
          >
            {loading ? '전송 중...' : '로그인식으로 전송'}
          </button>
        </div>

        {/* apiFetch 테스트 */}
        <div className="rounded border border-blue-200 p-3 text-sm">
          <div className="mb-2 font-medium text-blue-700">apiFetch 방식 (프록시 사용)</div>
          <div className="mb-2 text-xs text-gray-600">POST /proxy/api/v1/carts</div>
          <pre className="rounded bg-neutral-50 p-2 text-xs break-all whitespace-pre-wrap">{`
Authorization: Bearer <accessToken> (자동)
Content-Type: application/json

{
  "productId": ${payload.productId},
  "subscriptionOptionId": ${payload.subscriptionOptionId},
  "firstDeliveryDate": "${payload.firstDeliveryDate}"
}`}</pre>
          <button
            onClick={sendWithApiFetch}
            disabled={loading}
            className="mt-3 h-10 w-full rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? '전송 중...' : 'apiFetch로 전송'}
          </button>
        </div>

        {/* 직접 fetch 테스트 */}
        <div className="rounded border border-green-200 p-3 text-sm">
          <div className="mb-2 font-medium text-green-700">직접 fetch 방식 (EC2 직접 호출)</div>
          <div className="mb-2 text-xs text-gray-600">
            POST http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/carts
          </div>
          <pre className="rounded bg-neutral-50 p-2 text-xs break-all whitespace-pre-wrap">{`
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "productId": ${payload.productId},
  "subscriptionOptionId": ${payload.subscriptionOptionId},
  "firstDeliveryDate": "${payload.firstDeliveryDate}"
}`}</pre>
          <button
            onClick={send}
            disabled={loading}
            className="mt-3 h-10 w-full rounded bg-green-600 text-white disabled:opacity-50"
          >
            {loading ? '전송 중...' : '직접 fetch로 전송'}
          </button>
        </div>

        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <pre className="rounded border border-neutral-200 bg-neutral-50 p-3 text-xs break-all whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
}
