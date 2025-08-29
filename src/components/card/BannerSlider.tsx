'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';

interface BannerSliderProps {
  num?: number;
}

export default function BannerSlider({ num = 3 }: BannerSliderProps) {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1.1} // 슬라이드 크기 자동
      loop={true}
      initialSlide={0} // ← 항상 첫 번째 슬라이드부터 시작
      // centeredSlides={true} // 가운데 정렬
      // pagination={{ clickable: true }}
    >
      {[1, 2, 3].map((num) => (
        <SwiperSlide key={num} style={{ width: '80%', borderRadius: '20px', overflow: 'hidden' }}>
          <div className="flex h-[280px] flex-col items-center justify-center rounded-2xl bg-gray-200 text-[var(--color-surface)] shadow-md">
            <h3 className="font-bold">배너 이벤트 타이틀</h3>
            <p>배너 이벤트 본문</p>
            <span>{num} | 03</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
