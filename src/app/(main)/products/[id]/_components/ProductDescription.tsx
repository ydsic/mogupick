'use client';

import { useState, forwardRef } from 'react';
import NextIcon from '@/assets/icons/common/next-more-24px.svg';

interface ProductDescriptionProps {
  onClickDescription: () => void;
  onClickReview: () => void;
  images?: string[];
}

const ProductDescription = forwardRef<HTMLDivElement, ProductDescriptionProps>(
  ({ onClickDescription, onClickReview, images }, ref) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="mb-10">
        {/* 탭 */}
        <div className="flex px-4">
          <button
            onClick={onClickDescription}
            className="flex-1 border-b-2 border-black py-2 text-center font-bold"
          >
            상품설명
          </button>
          <button
            onClick={onClickReview}
            className="flex-1 border-b-2 border-transparent py-2 text-center font-bold text-[var(--grey-500)]"
          >
            리뷰
          </button>
        </div>

        {/* 상품 설명 */}
        <div ref={ref} className="flex flex-col items-center">
          <div
            className={`w-full overflow-hidden transition-all ${expanded ? 'max-h-none' : 'max-h-96'}`}
          >
            {images && images.length > 0 ? (
              <div className="flex flex-col items-center">
                {images.map((src, idx) => (
                  <img key={idx} src={src} alt={`description-${idx}`} className="w-full" />
                ))}
              </div>
            ) : (
              <div className="h-[800px] bg-[var(--grey-300)]" />
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-5 w-5/6 rounded-xs border border-[var(--grey-200)] py-3"
          >
            {expanded ? (
              <span>접기</span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                상품정보 더보기
                <NextIcon />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  },
);

ProductDescription.displayName = 'ProductDescription';
export default ProductDescription;
