'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderCustom from '@/components/HeaderCustom';
import TermsAgreement from './TermsAgreement';
import { getApiBaseUrl } from '@/lib/config';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import EyeHide from '@/assets/icons/common/eye-hide-24px.svg';
import EyeShow from '@/assets/icons/common/eye-show-24px.svg';
import { useState } from 'react';

const schema = yup
  .object({
    password: yup
      .string()
      .required('비밀번호를 입력해 주세요')
      .min(10, '비밀번호는 최소 10자 이상이어야 합니다')
      .max(20, '비밀번호는 20자 이하로 입력해 주세요'),
    passwordCheck: yup
      .string()
      .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다')
      .required('비밀번호 확인이 필요합니다'),
    name: yup
      .string()
      .required('이름을 입력해 주세요')
      .max(10, '이름은 10자 이하로 입력해 주세요')
      .matches(/^[가-힣a-zA-Z]+$/, '올바른 이름을 입력해 주세요.'),
    email: yup.string().email('올바른 이메일이 아닙니다').required(),
    phone: yup
      .string()
      .required('휴대폰 번호를 입력해 주세요')
      .matches(/^\d{11}$/, '휴대폰 번호는 숫자 11자리여야 합니다'),
    birthDate: yup
      .string()
      .required('생년월일을 입력해 주세요')
      .matches(/^\d{8}$/, '생년월일은 YYYYMMDD 8자리 숫자여야 합니다'),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;

export default function Page() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState({
    age: false,
    terms: false,
    marketing: false,
    ads: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const onValid: SubmitHandler<FormValues> = async (data) => {
    try {
      // 필수 약관 체크 확인
      if (!checked.age || !checked.terms) {
        toast.error('필수 약관에 동의해 주세요.');
        return;
      }
      // YYYY-MM-DD 형식으로 변환
      const formattedBirthDate = data.birthDate.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

      const { passwordCheck, ...payloadData } = data;
      const payload = {
        email: payloadData.email,
        password: payloadData.password,
        name: payloadData.name,
        birthDate: formattedBirthDate,
        phoneNumber: payloadData.phone,
      };

      const base = getApiBaseUrl();
      const res = await fetch(`${base}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || '회원가입 실패');
      }

      await res.json();
      toast.success('회원가입이 완료되었습니다! 🎉');
      router.push('/auth/credential');
    } catch (err: any) {
      toast.error(`회원가입 오류: ${err.message}`);
      console.error('회원가입 오류 : ', err.message);
    }
  };

  const onInvalid = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0] as keyof FormValues;
    setFocus(firstErrorField);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <HeaderCustom showBack />
      <div className="px-4">
        <h2 className="mb-5 text-xl font-bold text-[#434343]">회원가입</h2>
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          <div className="flex flex-col gap-3 border-b border-[#d6d6d6] pb-10">
            {/* 이름 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-[14px] font-medium text-[#434343]">
                이름<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="name"
                type="text"
                maxLength={10}
                placeholder="이름을 입력해 주세요"
                {...register('name')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-[14px] font-medium text-[#434343]">
                비밀번호<span className="text-base text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  maxLength={20}
                  placeholder="비밀번호를 입력해 주세요"
                  {...register('password')}
                  className="w-full rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
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
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="passwordCheck" className="text-[14px] font-medium text-[#434343]">
                비밀번호 확인<span className="text-base text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="passwordCheck"
                  type={showPwCheck ? 'text' : 'password'}
                  maxLength={20}
                  placeholder="비밀번호를 다시 입력해 주세요"
                  {...register('passwordCheck')}
                  className="w-full rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={() => setShowPwCheck((p) => !p)}
                  aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPwCheck ? <EyeShow /> : <EyeHide />}
                </button>
              </div>
              {errors.passwordCheck && (
                <p className="text-xs text-red-600">{errors.passwordCheck.message}</p>
              )}
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-[14px] font-medium text-[#434343]">
                이메일<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해 주세요"
                {...register('email')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* 휴대폰 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-[14px] font-medium text-[#434343]">
                휴대폰<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="\d*"
                maxLength={11}
                placeholder="'-없이' 휴대폰번호를 입력해 주세요"
                {...register('phone')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            {/* 생년월일 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="birthDate" className="text-[14px] font-medium text-[#434343]">
                생년월일<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="birthDate"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={8}
                placeholder="YYYYMMDD 형식으로 입력해주세요"
                {...register('birthDate')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.birthDate && (
                <p className="text-xs text-red-600">{errors.birthDate.message}</p>
              )}
            </div>
          </div>

          <TermsAgreement
            checked={checked}
            checkedAll={checkedAll}
            setChecked={setChecked}
            setCheckedAll={setCheckedAll}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-black py-3 text-white disabled:opacity-50"
          >
            가입하기
          </button>
        </form>
      </div>
    </>
  );
}
