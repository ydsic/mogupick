'use client';
import React from 'react';

type Props = {
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function FooterSubmitBar({ canSubmit, onSubmit }: Props) {
  return (
    <div className="fixed right-0 bottom-0 left-0 border-t bg-white">
      <div className="px-4 py-3">
        <button
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`h-12 w-full rounded font-medium transition-opacity ${
            canSubmit ? 'bg-black text-white active:bg-gray-800' : 'bg-black/40 text-white'
          }`}
        >
          정기구독 결제하기
        </button>
      </div>
      <div className="flex justify-center pb-2">
        <div className="h-1 w-36 rounded-full bg-black" />
      </div>
    </div>
  );
}
