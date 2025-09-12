'use client';
import React from 'react';
import Image from 'next/image';
import TossIcon from '@/assets/icons/payments/toss.png';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useAuthStore } from '@/store/useAuthStore';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/api/client';
import { registerPaymentMethod } from '@/api/billing';

type Props = {
  savePayment: boolean;
  onChangeSavePayment: (v: boolean) => void;
};

export default function PaymentMethodSection({ savePayment, onChangeSavePayment }: Props) {
  // 고객 정보 (이메일/이름) 스토어에서 로드
  const customerEmail = useAuthStore((s) => s.email);
  const customerName = useAuthStore((s) => s.name);

  // 결제 인증 성공 시 redirect로 전달되는 authKey 확인
  const searchParams = useSearchParams();
  const authKey = searchParams.get('authKey');
  const isCardRegistered = !!authKey;

  // 카드 등록 성공 후 주소창 authKey를 서버에 등록
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!authKey) return;
      try {
        await registerPaymentMethod(authKey);
        if (!mounted) return;
        console.log('[PAYMENTS] registerPaymentMethod OK');
      } catch (e) {
        console.error('[PAYMENTS] registerPaymentMethod 실패:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [authKey]);

  // 카드 등록 성공 후 돌아오면 스크롤을 맨 하단으로 이동
  React.useEffect(() => {
    if (!isCardRegistered) return;
    const scrollToBottom = () => {
      const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.scrollTo({ top: height, behavior: 'smooth' });
    };
    const id = window.setTimeout(scrollToBottom, 0);
    return () => window.clearTimeout(id);
  }, [isCardRegistered]);

  // ------  SDK 초기화 ------
  // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
  const clientKey = 'test_ck_GePWvyJnrKKXJp2lPRq7rgLzN97E';
  const [customerKey, setCustomerKey] = React.useState<string | null>(null);
  const [payment, setPayment] = React.useState<any>(null);

  // 고객 키 조회 (/members/me/billing)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiFetch<any>('/members/me/billing');
        const d = res?.data ?? res;
        const key =
          d?.customerKey ?? d?.key ?? d?.billingKey ?? d?.customer_id ?? d?.customerId ?? null;
        if (mounted) setCustomerKey(key ? String(key) : null);
        if (!key) console.warn('[PAYMENTS] No customerKey in /members/me/billing response:', d);
      } catch (e) {
        console.error('[PAYMENTS] failed to load customerKey:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Toss SDK 초기화: customerKey가 준비된 후 실행
  React.useEffect(() => {
    if (!customerKey) return;
    let mounted = true;
    (async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const p = tossPayments.payment({ customerKey });
        if (mounted) setPayment(p);
      } catch (error) {
        console.error('Error initializing TossPayments:', error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [clientKey, customerKey]);

  // ------ '결제수단 등록하기' 버튼 누르면 결제창 띄우기 ------
  // @docs https://docs.tosspayments.com/sdk/v2/js#paymentrequestpayment
  const requestBillingAuth = async () => {
    if (isCardRegistered) return; // 이미 등록 완료 상태면 동작 안 함
    if (!payment) return;
    try {
      if (!customerEmail || !customerName) {
        console.warn('[PAYMENTS] Missing customer info. email/name not set in store');
      }
      const currentSearch = searchParams.toString();
      const qs = currentSearch ? `?${currentSearch}` : '';
      await payment.requestBillingAuth({
        method: 'CARD', // 자동결제(빌링)는 카드만 지원합니다
        successUrl: window.location.origin + '/payments' + qs,
        failUrl: window.location.origin + '/payments/fail' + qs,
        customerEmail: customerEmail || undefined,
        customerName: customerName || undefined,
      });
    } catch (err) {
      console.error('requestBillingAuth 실패', err);
    }
  };

  return (
    <section className="px-4">
      <h2 className="mb-5 text-xl font-bold">결제수단 등록</h2>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <input type="radio" className="h-5 w-5" defaultChecked />
          <Image src={TossIcon} alt="토스" />
        </div>

        <div className="flex justify-center rounded border border-black p-4">
          <button
            type="button"
            onClick={requestBillingAuth}
            disabled={!payment || isCardRegistered}
            className="rounded-full bg-black px-6 py-2.5 text-sm text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCardRegistered ? '카드 등록 완료' : '결제수단 등록하기'}
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={savePayment}
            onChange={(e) => onChangeSavePayment(e.target.checked)}
            className="h-4 w-4 accent-black"
          />
          <span className="text-sm font-medium">선택한 결제 수단을 다음에도 사용</span>
        </label>
      </div>
    </section>
  );
}
