'use client';
import React from 'react';
import type { Address, AddressHandlers } from '../types';

type Props = Pick<Address, 'shippingName' | 'receiver' | 'postcode' | 'roadAddr' | 'detailAddr'> &
  Pick<
    AddressHandlers,
    | 'onChangeShippingName'
    | 'onChangeReceiver'
    | 'onChangePostcode'
    | 'onChangeRoadAddr'
    | 'onChangeDetailAddr'
    | 'onOpenPostcode'
  >;

export default function AddressSection({
  shippingName,
  receiver,
  postcode,
  roadAddr,
  detailAddr,
  onChangeShippingName,
  onChangeReceiver,
  onChangePostcode, // 사용은 안 하지만 타입 호환 위해 유지
  onChangeRoadAddr, // 사용은 안 하지만 타입 호환 위해 유지
  onChangeDetailAddr,
  onOpenPostcode,
}: Props) {
  return (
    <section className="px-4 pt-8">
      <h2 className="mb-5 text-xl font-bold">배송지</h2>
      <div className="space-y-3">
        {/* 배송지명 */}
        <div className="flex gap-4">
          <label className="w-14 flex-shrink-0 pt-2.5 text-sm font-medium">배송지명</label>
          <input
            className="h-10 flex-1 rounded border border-gray-900 px-3 focus:border-black focus:outline-none"
            value={shippingName}
            onChange={(e) => onChangeShippingName(e.target.value)}
            placeholder="예: 우리집, 회사"
          />
        </div>

        {/* 수령인 */}
        <div className="flex gap-4">
          <label className="w-14 flex-shrink-0 pt-2.5 text-sm font-medium">수령인 *</label>
          <input
            className="h-10 flex-1 rounded border border-gray-300 px-3 focus:border-black focus:outline-none"
            value={receiver}
            onChange={(e) => onChangeReceiver(e.target.value)}
            placeholder="이름을 입력하세요"
            required
          />
        </div>
        {/* 배송지 */}
        <div className="flex gap-4">
          <label className="w-14 flex-shrink-0 pt-2.5 text-sm font-medium">배송지 *</label>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex gap-2">
              <input
                className="h-10 min-w-0 flex-1 rounded border border-gray-300 px-3 focus:border-black focus:outline-none"
                value={postcode}
                readOnly
                placeholder="우편번호"
              />
              <button
                type="button"
                onClick={onOpenPostcode}
                className="h-10 w-28 flex-shrink-0 rounded bg-neutral-400 px-3 text-xs text-white transition-colors hover:bg-neutral-500"
              >
                우편번호 검색
              </button>
            </div>
            <input
              className="h-10 w-full rounded border border-gray-300 px-3 focus:border-black focus:outline-none"
              value={roadAddr}
              readOnly
              placeholder="기본주소"
            />
            <input
              className="h-10 w-full rounded border border-gray-900 px-3 focus:border-black focus:outline-none"
              value={detailAddr}
              onChange={(e) => onChangeDetailAddr(e.target.value)}
              placeholder="상세주소 입력"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
