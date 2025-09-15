'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import HeaderCustom from '@/components/HeaderCustom';
import SectionDivider from './components/SectionDivider';
import AddressSection from './components/AddressSection';
import ContactSection from './components/ContactSection';
import OrderItemsSection from './components/OrderItemsSection';
import PaymentMethodSection from './components/PaymentMethodSection';
import AgreementsSection from './components/AgreementsSection';
import FooterSubmitBar from './components/FooterSubmitBar';
import type { Phone } from './types';
import { useRouter, useSearchParams } from 'next/navigation';
import { createDeliveryAddress, getDeliveryAddresses } from '@/api/delivery';
import { createOrder } from '@/api/order';
// 신규: 주문 생성 후 최종 결제 청구 API
import { chargeBilling } from '@/api/billing';
import { getMyCart, mapCartResponseToUI } from '@/api/cart';

declare global {
  interface Window {
    daum?: any;
  }
}

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shippingName, setShippingName] = useState('');
  const [receiver, setReceiver] = useState('');
  const [postcode, setPostcode] = useState('');
  const [roadAddr, setRoadAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [phone, setPhone] = useState<Phone>({ p1: '', p2: '', p3: '' });
  const [isDefault, setIsDefault] = useState(true);
  const [request, setRequest] = useState('');
  const [savePayment, setSavePayment] = useState(true);
  const [agreeAll, setAgreeAll] = useState(true);

  // 프리필 여부: 서버의 기존 배송지로 채워졌다면 true
  const [isUsingExistingAddress, setIsUsingExistingAddress] = useState(false);

  // 자동 등록: 직전에 전송한 시그니처 저장하여 동일 데이터 중복 전송 방지
  const lastPostedSignatureRef = useRef<string | null>(null);

  // 선택된 cartItemIds (장바구니 페이지에서 쿼리로 전달) — productId 배열 기준
  const selectedCartItemIds = useMemo(() => {
    const raw = searchParams?.get('cartItemIds') || '';
    let ids: number[] | undefined = undefined;
    if (raw) {
      ids = raw
        .split(',')
        .map((v) => Number(v))
        .filter((n) => Number.isFinite(n));
    }
    // 쿼리에 없으면 로컬스토리지에서 복원 (카드등록 후 돌아온 경우 대비)
    if ((!ids || ids.length === 0) && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('payments.selectedProductIds');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            ids = parsed.filter((n) => typeof n === 'number' && Number.isFinite(n));
          }
        }
      } catch {}
    }
    return ids;
  }, [searchParams]);

  // 서버 배송지 목록에서 선택된 addressId 관리
  const [addressId, setAddressId] = useState<number | undefined>(undefined);

  // 주문 버튼 상태
  const [isOrdering, setIsOrdering] = useState(false);

  // 결제수단 인증(authKey) 유무
  const hasAuthKey = useMemo(() => !!(searchParams?.get('authKey') || ''), [searchParams]);

  // 주소 입력이 모두 채워졌는지 여부 (동의 체크는 제외)
  const isAddressFilled = useMemo(() => {
    const phoneOk = phone.p1.length >= 2 && phone.p2.length >= 3 && phone.p3.length >= 3;
    return (
      shippingName.trim() !== '' &&
      receiver.trim() !== '' &&
      postcode.trim() !== '' &&
      roadAddr.trim() !== '' &&
      detailAddr.trim() !== '' &&
      phoneOk
    );
  }, [shippingName, receiver, postcode, roadAddr, detailAddr, phone]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDeliveryAddresses();
        const list: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (list.length > 0) {
          const last = list[list.length - 1] || {};
          const contact = String(last.contact || '').replace(/\D/g, '');
          const p1 = contact.slice(0, 3);
          const p2 = contact.length === 10 ? contact.slice(3, 6) : contact.slice(3, 7);
          const p3 = contact.length === 10 ? contact.slice(6) : contact.slice(7);

          setShippingName(String(last.addressName || ''));
          setReceiver(String(last.receiver || ''));
          // postcode는 서버 응답에 없으므로 비움 유지
          setRoadAddr(String(last.baseAddress || ''));
          setDetailAddr(String(last.detailAddress || ''));
          setPhone({ p1, p2, p3 });
          setAddressId(Number(last.id ?? last.addressId));

          // 기존 주소로 프리필되었으므로 자동/수동 등록을 건너뛰기 위한 플래그 설정
          setIsUsingExistingAddress(true);
        } else {
          setAddressId(undefined);
        }
      } catch (e) {
        console.error('[DELIVERY][init] fetch failed:', e);
      }
    })();
  }, []);

  const buildAddressPayload = useCallback(() => {
    const contactNumeric = `${phone.p1}${phone.p2}${phone.p3}`.replace(/\D/g, '');
    const body = {
      addressName: shippingName || '기본 배송지',
      baseAddress: roadAddr,
      detailAddress: detailAddr,
      receiver,
      contact: contactNumeric,
    } as const;
    const signature = JSON.stringify(body);
    return { body, signature };
  }, [shippingName, roadAddr, detailAddr, receiver, phone]);

  // 입력 완료 후 3초 뒤 자동 배송지 등록 (단, 기존 주소 프리필 상태는 건너뜀)
  useEffect(() => {
    if (!isAddressFilled || isUsingExistingAddress) return; // 모두 채워지지 않거나 기존 주소면 패스
    const { body, signature } = buildAddressPayload();
    if (lastPostedSignatureRef.current === signature) return; // 동일 데이터 이미 전송함

    const timer = window.setTimeout(async () => {
      try {
        const res = await createDeliveryAddress(body);
        // 서버가 id를 반환하면 최신 addressId로 갱신
        const newId = Number((res as any)?.id ?? (res as any)?.addressId);
        if (Number.isFinite(newId)) setAddressId(newId);

        lastPostedSignatureRef.current = signature;
      } catch (err) {
        console.error('[DELIVERY][auto] create failed:', err);
      }
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isAddressFilled, isUsingExistingAddress, buildAddressPayload]);

  const openPostcode = useCallback(() => {
    if (!window?.daum?.Postcode) return alert('우편번호 스크립트 로딩 중');
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setPostcode(data.zonecode || '');
        setRoadAddr(data.roadAddress || data.jibunAddress || '');
        document.getElementById('detailAddress')?.focus();
      },
    }).open();
  }, []);

  const canSubmit = useMemo(() => {
    // 우편번호(postcode) 제외, 나머지 입력값 + 동의 체크 + authKey 필요
    const phoneOk = phone.p1.length >= 2 && phone.p2.length >= 3 && phone.p3.length >= 3;
    const addressOk =
      shippingName.trim() !== '' &&
      receiver.trim() !== '' &&
      roadAddr.trim() !== '' &&
      detailAddr.trim() !== '' &&
      phoneOk;

    // 기존 주소 사용 시 addressId가 확보되어야 함
    const addressReady = isUsingExistingAddress ? !!addressId : addressOk;

    return (
      hasAuthKey &&
      agreeAll &&
      addressReady &&
      !!(selectedCartItemIds && selectedCartItemIds.length)
    );
  }, [
    shippingName,
    receiver,
    roadAddr,
    detailAddr,
    phone,
    agreeAll,
    hasAuthKey,
    isUsingExistingAddress,
    addressId,
    selectedCartItemIds,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isOrdering) return;

    setIsOrdering(true);

    try {
      let resolvedAddressId = addressId;

      // 기존 주소를 사용하는 경우: addressId 없으면 목록에서 보강 시도
      if (isUsingExistingAddress) {
        if (!resolvedAddressId) {
          try {
            const res = await getDeliveryAddresses();
            const list: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            if (list.length > 0) {
              const last = list[list.length - 1] || {};
              resolvedAddressId = Number(last.id ?? last.addressId);
              if (Number.isFinite(resolvedAddressId)) setAddressId(resolvedAddressId);
            }
          } catch (err) {
            console.error('[DELIVERY][submit] 목록 재조회 실패:', err);
          }
        }

        if (!resolvedAddressId) {
          alert('배송지 정보가 없습니다. 배송지를 입력하거나 다시 시도해주세요.');
          return;
        }
      } else {
        // 신규 입력 주소인 경우: 아직 서버에 없으면 즉시 등록하고 반환 id 사용
        try {
          const { body, signature } = buildAddressPayload();
          if (lastPostedSignatureRef.current !== signature) {
            const res = await createDeliveryAddress(body);
            const newId = Number((res as any)?.id ?? (res as any)?.addressId);
            if (Number.isFinite(newId)) {
              setAddressId(newId);
              resolvedAddressId = newId;
            }
            lastPostedSignatureRef.current = signature;
          } else if (!resolvedAddressId) {
            // 자동 등록이 이미 되었으나 state 반영 전일 수 있으므로 목록에서 보강
            const res2 = await getDeliveryAddresses();
            const list2: any[] = Array.isArray(res2?.data)
              ? res2.data
              : Array.isArray(res2)
                ? res2
                : [];
            if (list2.length > 0) {
              const last = list2[list2.length - 1] || {};
              const id2 = Number(last.id ?? last.addressId);
              if (Number.isFinite(id2)) {
                setAddressId(id2);
                resolvedAddressId = id2;
              }
            }
          }
        } catch (err) {
          console.error('[DELIVERY][submit] create failed:', err);
          alert('배송지 등록에 실패했습니다. 다시 시도해주세요.');
          return;
        }
      }

      // 선택된 productId 목록 확인
      const selectedProductIds =
        selectedCartItemIds && selectedCartItemIds.length ? selectedCartItemIds : undefined;

      if (!selectedProductIds || selectedProductIds.length === 0) {
        alert('선택된 상품이 없습니다. 장바구니에서 상품을 선택해주세요.');
        return;
      }

      // 서버는 cartItemIds(장바구니 아이템 ID)를 요구하므로, 현재 장바구니에서 매핑
      const rawCart = await getMyCart();
      const uiCart = mapCartResponseToUI(rawCart);
      const orderCartItemIds = uiCart
        .filter(
          (it) => typeof it.productId === 'number' && selectedProductIds.includes(it.productId),
        )
        .map((it) => it.id);

      if (!orderCartItemIds.length) {
        console.error(
          '[ORDER] 매핑 결과 cartItemIds가 비어있음. selectedProductIds:',
          selectedProductIds,
          'uiCart:',
          uiCart,
        );
        alert('선택한 상품을 장바구니에서 찾을 수 없습니다. 다시 시도해주세요.');
        return;
      }

      if (!resolvedAddressId) {
        alert('배송지 정보가 확인되지 않았습니다. 다시 시도해주세요.');
        return;
      }

      const orderBody = {
        cartItemIds: orderCartItemIds,
        addressId: Number(resolvedAddressId),
      };

      const orderRes = await createOrder(orderBody);

      // 주문 응답에서 orderId 추출 후 최종 결제 청구
      const orderId: string | undefined =
        String((orderRes as any)?.data?.orderId || (orderRes as any)?.orderId || '') || undefined;
      if (!orderId) {
        console.error('[BILLING] orderId가 응답에 없습니다:', orderRes);
        alert('주문번호(orderId)를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      try {
        const billingRes = await chargeBilling(orderId);
        // 결제 성공 정보를 성공 페이지에서 표시할 수 있도록 저장
        // 선택된 UI 항목 및 합계 계산
        const selectedUiItems = uiCart.filter((it) => orderCartItemIds.includes(it.id));
        const totalPrice = selectedUiItems.reduce(
          (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
          0,
        );

        // cart raw에서 첫 배송일 추출 (첫번째 선택 항목 기준)
        const list: any[] = Array.isArray((rawCart as any)?.data?.items)
          ? (rawCart as any).data.items
          : Array.isArray((rawCart as any)?.data?.content)
            ? (rawCart as any).data.content
            : Array.isArray((rawCart as any)?.data)
              ? (rawCart as any).data
              : Array.isArray(rawCart)
                ? (rawCart as any)
                : [];
        const firstCartItemId = orderCartItemIds[0];
        let firstDeliveryDate: string | undefined = undefined;
        for (const item of list) {
          const id = Number(item?.cartItemId ?? item?.id ?? -1);
          if (id === firstCartItemId) {
            const subscription = item?.subscription ?? item?.option ?? {};
            firstDeliveryDate =
              subscription?.firstDeliveryDate || item?.firstDeliveryDate || subscription?.startDate;
            break;
          }
        }
        const addDays = (iso?: string, days = 0) => {
          if (!iso) return undefined;
          const d = new Date(iso);
          if (isNaN(d.getTime())) return undefined;
          d.setDate(d.getDate() + days);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        const expectedArrivalDate = addDays(firstDeliveryDate, 2);

        const successPayload = {
          orderId,
          items: selectedUiItems.map(({ id, title, brand, price, quantity }) => ({
            id,
            title,
            brand,
            price,
            quantity,
          })),
          totalPrice,
          paymentMethod: 'Toss',
          firstDeliveryDate,
          expectedArrivalDate,
          billing: billingRes,
          createdAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem('payments.lastSuccess', JSON.stringify(successPayload));
        } catch {}
      } catch (billErr) {
        console.error('[BILLING] charge 실패:', billErr);
        alert('결제 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      try {
        localStorage.removeItem('payments.selectedProductIds');
      } catch {}

      // TODO: 성공/실패 UI 처리. 일단 성공으로 가정하고 성공 페이지로 이동
      router.push(`/payments/success?orderId=${encodeURIComponent(orderId)}`);
    } catch (err) {
      console.error('[ORDER] 주문 생성 실패:', err);
      alert('주문 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderCustom title="정기구독" showBack />

      <main className="pb-28">
        <AddressSection
          shippingName={shippingName}
          receiver={receiver}
          postcode={postcode}
          roadAddr={roadAddr}
          detailAddr={detailAddr}
          onChangeShippingName={(v) => {
            setIsUsingExistingAddress(false);
            setShippingName(v);
          }}
          onChangeReceiver={(v) => {
            setIsUsingExistingAddress(false);
            setReceiver(v);
          }}
          onChangePostcode={(v) => {
            setIsUsingExistingAddress(false);
            setPostcode(v);
          }}
          onChangeRoadAddr={(v) => {
            setIsUsingExistingAddress(false);
            setRoadAddr(v);
          }}
          onChangeDetailAddr={(v) => {
            setIsUsingExistingAddress(false);
            setDetailAddr(v);
          }}
          onOpenPostcode={openPostcode}
          postcodeDisabled={isUsingExistingAddress}
        />

        <ContactSection
          phone={phone}
          isDefault={isDefault}
          request={request}
          onChangeIsDefault={setIsDefault}
          onChangeRequest={setRequest}
          onChangePhone={(updater) => {
            setIsUsingExistingAddress(false);
            setPhone(updater);
          }}
        />

        <SectionDivider />

        {/* 선택된 장바구니 아이템만 표시 */}
        <OrderItemsSection onlyIds={selectedCartItemIds} />

        <SectionDivider />

        <PaymentMethodSection savePayment={savePayment} onChangeSavePayment={setSavePayment} />

        <SectionDivider />

        <AgreementsSection agreeAll={agreeAll} onChangeAgreeAll={setAgreeAll} />
      </main>

      <FooterSubmitBar
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
        disabled={isOrdering || !canSubmit}
        label={isOrdering ? '주문 생성 중...' : '정기구독 결제하기'}
      />

      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
