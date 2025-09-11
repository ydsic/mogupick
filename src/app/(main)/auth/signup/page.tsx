import HeaderCustom from '@/components/HeaderCustom';

export default function Page() {
  return (
    <div className="py-14">
      <HeaderCustom showBack />
      <div className="px-4">
        <form>
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
        </form>
      </div>
    </div>
  );
}
