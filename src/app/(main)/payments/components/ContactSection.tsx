'use client';
import React from 'react';
import type { Address, AddressHandlers, Phone } from '../types';

type Props = Pick<Address, 'phone' | 'isDefault' | 'request'> &
  Pick<AddressHandlers, 'onChangeIsDefault' | 'onChangeRequest' | 'onChangePhone'>;

export default function ContactSection({
  phone,
  isDefault,
  request,
  onChangeIsDefault,
  onChangeRequest,
  onChangePhone,
}: Props) {
  const toNum = (s: string) => s.replace(/\D/g, '');

  return (
    <section className="px-4 pt-3">
      <div className="flex gap-4">
        <label className="w-14 flex-shrink-0 pt-2.5 text-sm font-medium">연락처*</label>
        <div className="min-w-0 flex-1">
          <div className="flex flex-nowrap gap-2 sm:flex-nowrap">
            <input
              className="h-10 min-w-[60px] flex-1 rounded border border-gray-300 px-3 focus:border-black focus:outline-none"
              value={phone.p1}
              onChange={(e) =>
                onChangePhone((p: Phone) => ({ ...p, p1: toNum(e.target.value).slice(0, 3) }))
              }
              placeholder="010"
              maxLength={3}
              inputMode="numeric"
            />
            <input
              className="h-10 min-w-[80px] flex-1 rounded border border-gray-300 px-3 focus:border-black focus:outline-none"
              value={phone.p2}
              onChange={(e) =>
                onChangePhone((p: Phone) => ({ ...p, p2: toNum(e.target.value).slice(0, 4) }))
              }
              placeholder="0000"
              maxLength={4}
              inputMode="numeric"
            />
            <input
              className="h-10 min-w-[80px] flex-1 rounded border border-gray-300 px-3 focus:border-black focus:outline-none"
              value={phone.p3}
              onChange={(e) =>
                onChangePhone((p: Phone) => ({ ...p, p3: toNum(e.target.value).slice(0, 4) }))
              }
              placeholder="0000"
              maxLength={4}
              inputMode="numeric"
            />
          </div>
          <div className="mt-4 space-y-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => onChangeIsDefault(e.target.checked)}
                className="h-4 w-4 accent-black"
              />
              <span className="text-sm font-medium">기본배송지로 등록</span>
            </label>

            <select
              className="h-10 w-full appearance-none rounded border border-gray-300 px-3 focus:border-black focus:outline-none"
              value={request}
              onChange={(e) => onChangeRequest(e.target.value)}
            >
              <option value="">배송시 요청사항을 선택해주세요.</option>
              <option value="door">문 앞에 놓아주세요</option>
              <option value="call">배송 전 연락주세요</option>
              <option value="guard">경비실에 맡겨주세요</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
