'use client';

import { useState, useEffect } from 'react';
import { ProductCardList } from '@/components/card/Product';
import { ReviewCardList } from '@/components/card/Review';
import { cn } from '@/lib/utils';

interface MoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'product' | 'review';
  data: any[];
  isLoading: boolean;
}

export default function MoreModal({
  isOpen,
  onClose,
  title,
  type,
  data,
  isLoading,
}: MoreModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 막기
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset'; // 스크롤 복원
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* 배경 오버레이 */}
      <div className="bg-opacity-50 absolute inset-0 bg-black" onClick={onClose} />

      {/* 모달 콘텐츠 */}
      <div className="relative z-10 min-h-screen w-full max-w-md overflow-y-auto bg-white">
        {/* 헤더 */}
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
              aria-label="닫기"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="max-h-[90vh] overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-20 w-20 flex-shrink-0 animate-pulse rounded bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="py-8 text-center text-gray-500">데이터가 없습니다.</div>
          ) : type === 'product' ? (
            <ProductCardList path="/products" products={data} query={{ from: 'more-modal' }} />
          ) : (
            <ReviewCardList layout="list" reviews={data} />
          )}
        </div>
      </div>
    </div>
  );
}
