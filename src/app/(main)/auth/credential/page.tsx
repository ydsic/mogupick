'use client';

import Image from 'next/image';
import HeaderCustom from '@/components/HeaderCustom';
import LogoImg from '@/assets/icons/mogupick.png';
import EyeHide from '@/assets/icons/common/eye-hide-20px.svg';
import EyeShow from '@/assets/icons/common/eye-show-24px.svg';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

// ✅ yup validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('올바른 이메일 형식을 입력해주세요.')
    .required('이메일을 입력해주세요.'),
  password: yup.string().required('비밀번호를 입력해주세요.'),
});

type LoginForm = yup.InferType<typeof schema>;

export default function Page() {
  const [showPw, setShowPw] = useState(false);
  const { login, loading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    await login(data.email, data.password);

    const { isLoggedIn, error } = useAuthStore.getState();

    if (error) {
      toast.error(error);
      return;
    }

    if (isLoggedIn) {
      router.push('/');
    }
  };

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

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {/* 이메일 */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[14px] text-[#434343]">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일 입력"
              className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#d6d6d6] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"

              {...register('email')}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-[14px] text-[#434343]">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                placeholder="비밀번호(영문, 숫자, 특수문자 8~20자)"
                className="w-full rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 pr-10 text-sm text-[#434343] placeholder-[#d6d6d6] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={() => setShowPw((p) => !p)}
                aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPw ? <EyeShow /> : <EyeHide />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-[4px] bg-black py-3 text-base font-medium text-white disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
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
