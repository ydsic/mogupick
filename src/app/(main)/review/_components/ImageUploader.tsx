'use client';

import { useRef } from 'react';
import StarIcon from '@/assets/icons/common/big-star.svg';

interface Props {
  images: File[];
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
}

export default function ImageUploader({ images, addImage, removeImage }: Props) {
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="fill-current text-[#F9C927]" />
          ))}
        </div>
        <span className="text-sm text-gray-400">- 직장인 점심 그린 샐러드 식단 2주 플랜 -</span>
      </div>
      {/* 이미지 미리보기 */}
      <div className="flex flex-wrap gap-2">
        {images.map((file, idx) => (
          <div key={idx} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`upload-${idx}`}
              className="h-16 w-16 rounded object-cover"
            />
            <button
              type="button"
              className="absolute top-0 right-0 h-5 w-5 rounded-full bg-black text-xs text-white"
              onClick={() => removeImage(idx)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* 숨겨진 input: 사진첩 */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && addImage(e.target.files[0])}
      />

      {/* 숨겨진 input: 카메라 */}
      {/* <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && addImage(e.target.files[0])}
      /> */}

      {/* 버튼들 */}
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={handleGalleryClick}
          className="flex-1 rounded border border-gray-300 py-3 text-center text-gray-400"
        >
          사진첨부하기
        </button>

        {/* <button
          type="button"
          onClick={handleCameraClick}
          className="flex-1 rounded bg-gray-700 py-2 text-center text-white"
        >
          카메라로 촬영
        </button> */}
      </div>
    </div>
  );
}
