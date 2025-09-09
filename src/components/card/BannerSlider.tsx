'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';
import one from '@/assets/mainbanner/one.png';
import two from '@/assets/mainbanner/two.png';
import three from '@/assets/mainbanner/three.png';
import four from '@/assets/mainbanner/four.png';
import five from '@/assets/mainbanner/five.png';

interface BannerSliderProps {
  num?: number;
}

export default function BannerSlider({ num = 5 }: BannerSliderProps) {
  const images = [one, two, three, four, five];
  const count = Math.min(num, images.length);

  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1.1}
      loop={true}
      initialSlide={0}
    >
      {images.slice(0, count).map((img, idx) => (
        <SwiperSlide key={idx} style={{ width: '80%', borderRadius: '20px', overflow: 'hidden' }}>
          <div className="h-[280px] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md">
            <img src={img.src} alt={`banner-${idx + 1}`} className="h-full w-full object-cover" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
