import Image from 'next/image';
import HeaderCustom from '@/components/HeaderCustom';
import LogoImg from '@/assets/icons/mogupick.png';
import EyeHide from '@/assets/icons/common/eye-hide-20px.svg';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="py-14">
      <HeaderCustom showBack />
      <div className="px-4">
        <div className="mb-14 pt-6">
          <Image src={LogoImg} alt="logo" width={200} height={50} />
          <h2 className="mt-5 text-[22px] font-semibold tracking-normal">
            구독으로 채우는 <br />
            나의 새로운 일상!
          </h2>
        </div>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[14px] text-[#434343]">
              이메일
            </label>
            <input
              type="email"
              placeholder="이메일 입력"
              className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#d6d6d6] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="relative flex flex-col gap-1">
            <label htmlFor="password" className="text-[14px] text-[#434343]">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호(영문, 숫자, 특수문자 8~20자)"
              className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#d6d6d6] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
            <button className="absolute top-[55%] right-2 -translate-y-1/8">
              <EyeHide />
            </button>
          </div>
        </form>
        <button
          type="submit"
          className="mt-12 w-full rounded-[4px] bg-black py-3 text-base font-medium text-white"
        >
          로그인
        </button>
        <div className="mt-8 flex items-center justify-center space-x-3 text-sm text-[#434343]">
          <Link href={'/auth/signup'} className="text-[var(--color-secondary)]">
            회원가입
          </Link>
          <span className="h-2 w-px bg-gray-300"></span>

          <span>비밀번호 찾기</span>
          <span className="h-2 w-px bg-gray-300"></span>

          <span>문의하기</span>
        </div>
      </div>
    </div>
  );
}
