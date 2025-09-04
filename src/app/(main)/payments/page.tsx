'use client';

import React, { useCallback, useMemo, useState } from 'react';
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

declare global {
  interface Window {
    daum?: any;
  }
}

export default function PaymentsPage() {
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
    return (
      receiver.trim() !== '' &&
      postcode.trim() !== '' &&
      roadAddr.trim() !== '' &&
      detailAddr.trim() !== '' &&
      phone.p1.length >= 2 &&
      phone.p2.length >= 3 &&
      phone.p3.length >= 3 &&
      agreeAll
    );
  }, [receiver, postcode, roadAddr, detailAddr, phone, agreeAll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log('결제 진행');
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
          onChangeShippingName={setShippingName}
          onChangeReceiver={setReceiver}
          onChangePostcode={setPostcode}
          onChangeRoadAddr={setRoadAddr}
          onChangeDetailAddr={setDetailAddr}
          onOpenPostcode={openPostcode}
        />

        <ContactSection
          phone={phone}
          isDefault={isDefault}
          request={request}
          onChangeIsDefault={setIsDefault}
          onChangeRequest={setRequest}
          onChangePhone={setPhone}
        />

        <SectionDivider />

        <OrderItemsSection />

        <SectionDivider />

        <PaymentMethodSection savePayment={savePayment} onChangeSavePayment={setSavePayment} />

        <SectionDivider />

        <AgreementsSection agreeAll={agreeAll} onChangeAgreeAll={setAgreeAll} />
      </main>

      <FooterSubmitBar canSubmit={canSubmit} onSubmit={handleSubmit} />

      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
