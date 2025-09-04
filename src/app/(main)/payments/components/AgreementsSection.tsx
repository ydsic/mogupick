'use client';
import React from 'react';

type Props = {
  agreeAll: boolean;
  onChangeAgreeAll: (v: boolean) => void;
};

export default function AgreementsSection({ agreeAll, onChangeAgreeAll }: Props) {
  return (
    <section className="px-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">개인정보 수집 · 이용 및 처리 동의</span>
          <button className="text-sm underline">보기</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">전자지급 결제대행 서비스 이용약관 동의</span>
          <button className="text-sm underline">보기</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">선불전자지급수단 이용약관 동의</span>
          <button className="text-sm underline">보기</button>
        </div>
      </div>

      <hr className="my-4 border-gray-100" />

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={agreeAll}
          onChange={(e) => onChangeAgreeAll(e.target.checked)}
          className="h-5 w-5 accent-gray-900"
        />
        <span className="text-sm font-medium">신청 내용을 확인했으며, 결제에 동의합니다.</span>
      </label>
    </section>
  );
}
