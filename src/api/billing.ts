export interface ChargeBillingBody {
  orderId: string;
}

export type ChargeBillingResponse = any;

// 최종 결제 요청 (빌링 청구)
export async function chargeBilling(orderId: string) {
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/billing/charge`;
    const body: ChargeBillingBody = { orderId };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[BILLING][charge][response:status]', res.status, text);
      throw new Error(text || `요청 실패 (status: ${res.status})`);
    }

    try {
      const json = (await res.json()) as ChargeBillingResponse;
      return json;
    } catch {
      return true as unknown as ChargeBillingResponse;
    }
  } catch (e) {
    console.error('[BILLING][charge][error]', e);
    throw e;
  }
}

// --- 결제수단 등록 ---
export interface RegisterPaymentMethodBody {
  authKey: string;
}

export type RegisterPaymentMethodResponse = any;

export async function registerPaymentMethod(authKey: string) {
  try {
    const { getApiBaseUrl } = await import('@/lib/config');
    const { useAuthStore } = await import('@/store/useAuthStore');

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('로그인이 필요합니다. accessToken이 없습니다.');
    }

    const url = `${getApiBaseUrl()}/billing/payment-methods`;
    const body: RegisterPaymentMethodBody = { authKey };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[BILLING][register][response:status]', res.status, text);
      throw new Error(text || `요청 실패 (status: ${res.status})`);
    }

    try {
      const json = (await res.json()) as RegisterPaymentMethodResponse;
      return json;
    } catch {
      return true as unknown as RegisterPaymentMethodResponse;
    }
  } catch (e) {
    console.error('[BILLING][register][error]', e);
    throw e;
  }
}
