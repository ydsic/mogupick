'use client';
import { useState } from 'react';
import ImageUploader from './ImageUploader';

interface Props {
  content: string;
  setContent: (text: string) => void;
  images: File[];
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  onSubmit: () => void;
}

export default function ReviewStep2({
  content,
  setContent,
  images,
  addImage,
  removeImage,
  onSubmit,
}: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pt-14 pb-18">
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <ImageUploader images={images} addImage={addImage} removeImage={removeImage} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내 일상 속 구독 경험을 솔직하게 남겨주세요."
          className="h-32 w-full rounded border border-gray-300 p-2"
        />
      </div>
      <button
        onClick={onSubmit}
        className={`w-full rounded py-4 ${content.trim() === '' ? 'bg-gray-300' : 'bg-black text-white'}`}
      >
        완료
      </button>
    </div>
  );
}
