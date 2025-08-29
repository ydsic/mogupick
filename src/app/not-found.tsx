import Image from 'next/image';
import one from '@/assets/icons/notfound/one.png';
import two from '@/assets/icons/notfound/two.png';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-yellow-50">
      <div className="mb-8 border-2 shadow">
        <div className="relative flex flex-col items-center">
          <Image src={one} alt="notfound-1" width={350} />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-xs text-white">
            페이지 있어요?
          </p>
        </div>
        <div className="relative flex flex-col items-center">
          <Image src={two} alt="notfound-2" width={350} />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-xs text-white">
            없어요
          </p>
        </div>
      </div>
      <a
        href="/"
        className="rounded border border-black bg-blue-200 px-5 py-2 text-base font-semibold text-black shadow transition-colors"
      >
        홈으로 가기
      </a>
    </div>
  );
}
