'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderCustom from '@/components/HeaderCustom';
import TermsAgreement from './TermsAgreement';
import { getApiBaseUrl } from '@/lib/config';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const schema = yup
  .object({
    password: yup.string().required('비밀번호를 입력해 주세요').min(6),
    passwordCheck: yup
      .string()
      .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다')
      .required('비밀번호 확인이 필요합니다'),
    name: yup.string().required('이름을 입력해 주세요'),
    email: yup.string().email('올바른 이메일이 아닙니다').required(),
    phone: yup
      .string()
      .matches(/^\d{10,11}$/, '숫자만 입력')
      .required(),
    birthDate: yup
      .string()
      .required('생년월일을 입력해 주세요')
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다'),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const onValid: SubmitHandler<FormValues> = async (data) => {
    try {
      // 항상 YYYY-MM-DD 형식으로 변환
      let formattedBirthDate = data.birthDate.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

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
    // 첫 번째 오류 필드에 자동 포커스
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
            {/* name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-[14px] font-medium text-[#434343]">
                이름<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="이름을 입력해 주세요"
                {...register('name')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-[14px] font-medium text-[#434343]">
                비밀번호<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                {...register('password')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* passwordCheck */}
            <div className="flex flex-col gap-1">
              <label htmlFor="passwordCheck" className="text-[14px] font-medium text-[#434343]">
                비밀번호 확인<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="passwordCheck"
                type="password"
                placeholder="비밀번호를 다시 입력해 주세요"
                {...register('passwordCheck')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.passwordCheck && (
                <p className="text-xs text-red-600">{errors.passwordCheck.message}</p>
              )}
            </div>

            {/* email */}
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

            {/* phone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-[14px] font-medium text-[#434343]">
                휴대폰<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="phone"
                type="text"
                placeholder="'-없이' 휴대폰번호를 입력해 주세요"
                {...register('phone')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            {/* birthDate */}
            <div className="flex flex-col gap-1">
              <label htmlFor="birthDate" className="text-[14px] font-medium text-[#434343]">
                생년월일<span className="text-base text-red-700">*</span>
              </label>
              <input
                id="birthDate"
                type="text"
                placeholder="YYYY-MM-DD 형식으로 입력해주세요"
                {...register('birthDate')}
                className="rounded-[4px] border border-[#d6d6d6] px-2 py-3.5 text-sm text-[#434343] placeholder-[#c2c2c2] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
              {errors.birthDate && (
                <p className="text-xs text-red-600">{errors.birthDate.message}</p>
              )}
            </div>
          </div>

          <TermsAgreement />

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
