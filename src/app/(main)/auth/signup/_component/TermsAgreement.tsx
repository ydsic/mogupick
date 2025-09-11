'use client';

type TermsProps = {
  checked: {
    age: boolean;
    terms: boolean;
    marketing: boolean;
    ads: boolean;
  };
  checkedAll: boolean;
  setChecked: React.Dispatch<
    React.SetStateAction<{
      age: boolean;
      terms: boolean;
      marketing: boolean;
      ads: boolean;
    }>
  >;
  setCheckedAll: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TermsAgreement({
  checked,
  checkedAll,
  setChecked,
  setCheckedAll,
}: TermsProps) {
  const handleAllChange = () => {
    const newValue = !checkedAll;
    setCheckedAll(newValue);
    setChecked({
      age: newValue,
      terms: newValue,
      marketing: newValue,
      ads: newValue,
    });
  };

  const handleSingleChange = (name: keyof typeof checked) => {
    const newValue = !checked[name];
    const newChecked = { ...checked, [name]: newValue };
    setChecked(newChecked);
    setCheckedAll(Object.values(newChecked).every(Boolean));
  };

  return (
    <div className="pt-10 pb-16 text-[14px] font-semibold text-[#242424]">
      <h2 className="mb-3 font-semibold">모구픽 이용 약관 동의</h2>

      {/* 전체 동의 */}
      <label className="mb-4 flex cursor-pointer items-center space-x-2">
        <input
          type="checkbox"
          checked={checkedAll}
          onChange={handleAllChange}
          className="h-5 w-5 accent-black"
        />
        <span>전체 동의합니다.</span>
      </label>

      <div className="ml-2 space-y-3">
        <label className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checked.age}
              onChange={() => handleSingleChange('age')}
              className="h-5 w-5 accent-black"
            />
            <span>만 14세 이상입니다. (필수)</span>
          </div>
          <button className="text-xs underline">자세히</button>
        </label>

        <label className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checked.terms}
              onChange={() => handleSingleChange('terms')}
              className="h-5 w-5 accent-black"
            />
            <span>서비스 이용 약관 동의 (필수)</span>
          </div>
          <button className="text-xs underline">자세히</button>
        </label>

        <label className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checked.marketing}
              onChange={() => handleSingleChange('marketing')}
              className="h-5 w-5 accent-black"
            />
            <span>마케팅 목적의 개인정보 수집 및 이용 동의 (선택)</span>
          </div>
          <button className="text-xs underline">자세히</button>
        </label>

        <label className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checked.ads}
              onChange={() => handleSingleChange('ads')}
              className="h-5 w-5 accent-black"
            />
            <span>광고성 정보 수신 동의 (선택)</span>
          </div>
          <button className="text-xs underline">자세히</button>
        </label>
      </div>
    </div>
  );
}
